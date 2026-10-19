// Cloudflare Turnstile, rendered explicitly and only once a visitor starts a form,
// so pages without form interaction never load the challenge script.
// Tokens are single-use: getToken() hands one out and resets the widget for the next call.

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<void> | null = null;

function loadScript() {
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile failed to load'));
    document.head.appendChild(s);
  });
  return loading;
}

export function createChallenge(el: HTMLElement, sitekey: string) {
  let token = '';
  let widgetId: string | undefined;
  const waiters: ((t: string) => void)[] = [];

  const ready = loadScript()
    .then(() => {
      widgetId = window.turnstile!.render(el, {
        sitekey,
        action: 'lead',
        'response-field': false, // don't inject a hidden input; the token is passed explicitly
        appearance: 'interaction-only', // invisible unless Cloudflare needs the visitor to click
        callback: (t: string) => { token = t; waiters.splice(0).forEach((w) => w(t)); },
        'expired-callback': () => { token = ''; },
        'error-callback': () => { token = ''; return true; },
      });
    })
    .catch(() => {});

  return {
    async getToken(timeoutMs = 15000): Promise<string> {
      await ready;
      const take = (t: string) => {
        token = '';
        if (widgetId !== undefined) window.turnstile?.reset(widgetId);
        return t;
      };
      if (token) return take(token);
      return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(''), timeoutMs);
        waiters.push((t) => { clearTimeout(timer); resolve(take(t)); });
      });
    },
  };
}
