import { SPARouter } from './spaRouter';

const helloRouter = new SPARouter(
  'https://hello-world-react.bibs.codes',
  [
    '/asset-manifest.json',
    '/favicon.ico',
    '/manifest.json',
    '/precache-manifest.',
    '/serviceWorker.js',
    '/static/'
  ]
);

self.addEventListener('fetch', (evt: Event) => {
  const event = evt as FetchEvent
  event.respondWith(helloRouter.handleRequest(event.request))
});
