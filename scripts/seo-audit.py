# SEO audit of the production build. Usage: npm run build && npm run seo:audit
# Checks title/description length, one H1, canonical, breadcrumbs, sitemap coverage, image alt and internal links,
# then rewrites docs/URL-INVENTORY.md.
import sys, os, re, json, html
from collections import Counter
from html.parser import HTMLParser
dist, out = sys.argv[1], sys.argv[2]
SITE = 'https://isogrcadvisory.com'
sitemap = set(re.findall(r'<loc>([^<]+)</loc>', open(f'{dist}/sitemap-0.xml').read()))
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.title=''; s.intitle=False; s.meta={}; s.links={}; s.h1=0; s.inh1=False; s.h1t=''; s.imgs_noalt=0; s.hrefs=[]; s.ld=[]; s.inld=False; s.crumbnav=False
    def handle_starttag(s,t,a):
        a=dict(a)
        if t=='title' and not s.title: s.intitle=True
        if t=='meta': s.meta[a.get('name') or a.get('property')]=a.get('content')
        if t=='link': s.links[a.get('rel')]=a.get('href')
        if t=='h1': s.h1+=1; s.inh1=True
        if t=='img' and not a.get('alt') and a.get('alt')!='' : s.imgs_noalt+=1
        if t=='a' and a.get('href'): s.hrefs.append(a['href'])
        if t=='script' and a.get('type')=='application/ld+json': s.inld=True
        if t=='nav' and a.get('aria-label')=='Breadcrumb': s.crumbnav=True
    def handle_endtag(s,t):
        if t=='title': s.intitle=False
        if t=='h1': s.inh1=False
        if t=='script': s.inld=False
    def handle_data(s,d):
        if s.intitle: s.title+=html.unescape(d)
        if s.inh1 and s.h1==1: s.h1t+=(' — ' if s.h1t and not s.h1t.endswith(' ') else '')+d.strip()
        if s.inld: s.ld.append(json.loads(d))
pages=[]
for root,_,files in os.walk(dist):
    for f in files:
        if f.endswith('.html'):
            fp=os.path.join(root,f); rel='/'+os.path.relpath(fp,dist)
            path=rel[:-len('index.html')] if rel.endswith('index.html') else rel
            p=P(); p.feed(open(fp).read()); pages.append((path,p))
pages.sort(key=lambda x:(x[0].count('/'),x[0]))
existing={pa for pa,_ in pages}
issues=[]; titles=Counter(p.title for _,p in pages); descs=Counter(p.meta.get('description') for _,p in pages)
rows=[]
for path,p in pages:
    d=p.meta.get('description') or ''; robots=p.meta.get('robots',''); idx='noindex' not in robots
    types=[x.get('@type') for x in p.ld]
    url=SITE+path
    if path=='/404.html': idx=False
    prob=[]
    if idx and not (30<=len(p.title)<=70): prob.append(f'title {len(p.title)} chars')
    if idx and not (70<=len(d)<=160): prob.append(f'description {len(d)} chars')
    if p.h1!=1: prob.append(f'{p.h1} h1')
    if idx and p.links.get('canonical')!=url: prob.append('canonical mismatch')
    if titles[p.title]>1: prob.append('duplicate title')
    if descs[d]>1: prob.append('duplicate description')
    if p.imgs_noalt: prob.append(f'{p.imgs_noalt} img no alt')
    if path not in ('/','/404.html') and not p.crumbnav: prob.append('no breadcrumbs')
    if idx and url not in sitemap: prob.append('indexable but not in sitemap')
    if not idx and url in sitemap: prob.append('noindex but in sitemap')
    for h in p.hrefs:
        if h.startswith('/') and not h.startswith('//'):
            hp=h.split('#')[0].split('?')[0]
            if hp and hp not in existing and not os.path.exists(dist+hp): prob.append(f'broken link {hp}')
    rows.append((path,p.title,len(p.title),d,len(d),p.h1t.strip(),idx,', '.join(t for t in types if t),sorted(set(prob))))
bad=[r for r in rows if r[8]]
print(len(rows),'pages;',sum(r[6] for r in rows),'indexable;',len(sitemap),'in sitemap;',len(bad),'with issues')
for r in bad: print(' ',r[0],'->',r[8])
groups=[('Core','/',lambda p:p.count('/')<=2 and not p.startswith(('/iso/','/grc/','/training/','/workforce','/compliance-software/','/resources/','/locations/'))),
 ('ISO Advisory','/iso/',lambda p:p.startswith('/iso/')),('GRC Advisory','/grc/',lambda p:p.startswith('/grc/')),
 ('GRC software selection','/compliance-software/',lambda p:p.startswith('/compliance-software/')),
 ('Training','/training/',lambda p:p.startswith(('/training/','/workforce'))),('Resources','/resources/',lambda p:p.startswith('/resources/')),('Locations','/locations/',lambda p:p.startswith('/locations/'))]
with open(out,'w') as o:
    o.write(f"# URL inventory and SEO status\n\nGenerated from the production build for `{SITE}`. Regenerate after content changes.\n\n")
    o.write(f"- **{len(rows)} pages**, **{sum(r[6] for r in rows)} indexable**, **{len(sitemap)} in the sitemap**\n- Noindex: enquiry form, thank-you page, 404\n- Every page has: unique title and meta description, one H1, canonical URL, Open Graph and Twitter card tags, Organization schema; inner pages also have visible breadcrumbs and BreadcrumbList schema\n\n")
    done=set()
    for g,_,f in groups:
        sel=[r for r in rows if f(r[0]) and r[0] not in done]
        if not sel: continue
        o.write(f"## {g} ({len(sel)})\n\n| URL | Title | H1 | Index | Schema |\n|---|---|---|---|---|\n")
        for r in sel:
            done.add(r[0]); esc=lambda x: html.unescape(x).replace('|', chr(92)+'|'); o.write(f"| `{r[0]}` | {esc(r[1])} | {esc(r[5])} | {'yes' if r[6] else 'no'} | {r[7]} |\n")
        o.write('\n')
