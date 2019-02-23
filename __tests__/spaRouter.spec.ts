import makeServiceWorkerEnv from 'service-worker-mock';

const filesUnderTest = ['../src/index.ts', '../src/spaRouter.ts'];

const baseURL = 'https://hello-world-react.bibs.codes'

describe('Service worker', () => {

  // setup the service worker environment before each test
  beforeEach(() => {
    // mock the fetch global object
    Object.assign(global, makeServiceWorkerEnv(), { fetch: jest.fn() })
    jest.resetModules()
    filesUnderTest.forEach((f) => require(f));
  })

  it('should add listeners', () => {
    expect((self as CloudflareWorker).listeners.get('fetch')).toBeDefined()
  })

  it('should return index.html for a non asset url', async () => {
    // fetch is a jest mock, setup the response
    (fetch as jest.Mock).mockReturnValue(Promise.resolve(new Response('index', { status: 200 })))

    // create a request and issue the fetch against the mock
    const request = new Request('/home')
    const response = await (self as CloudflareWorker).trigger('fetch', request)

    // check that our mock was called with the correct URL
    expect(fetch).toBeCalledWith(`${baseURL}/index.html`, request)

    // check that our response was the expected one
    expect(response[0].status).toEqual(200)
    await expect(response[0].text()).resolves.toEqual('index')
  })

  it('should return a static asset', async () => {
    (fetch as jest.Mock).mockReturnValue(new Response('img', { status: 200 }))

    const request = new Request('/static/img/home.jpg')
    const response = await (self as CloudflareWorker).trigger('fetch', request)

    expect(fetch).toBeCalledWith(`${baseURL}/static/img/home.jpg`, request);

    expect(response[0].status).toEqual(200)
    await expect(response[0].text()).resolves.toEqual('img')
  })

  it('should return a root level asset', async () => {
    (fetch as jest.Mock).mockReturnValue(new Response('favicon', { status: 200 }))

    const request = new Request('/favicon.ico')
    const response = await (self as CloudflareWorker).trigger('fetch', request)

    expect(fetch).toBeCalledWith(`${baseURL}/favicon.ico`, request);

    expect(response[0].status).toEqual(200)
    await expect(response[0].text()).resolves.toEqual('favicon')
  })

  it('should handle an asset 404 properly', async () => {
    (fetch as jest.Mock).mockReturnValue(new Response('not found', { status: 404 }))

    const request = new Request('/static/js/does_not_exist.js')
    const response = await (self as CloudflareWorker).trigger('fetch', request)

    expect(fetch).toBeCalledWith(`${baseURL}/static/js/does_not_exist.js`, request);

    expect(response[0].status).toEqual(404)
  })
})