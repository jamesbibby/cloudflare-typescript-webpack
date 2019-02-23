// simple interface for handling a request
class SPARouter {

  assetPaths: Array<string>
  baseURL: string

  // configure a new SPA router for a given baseurl and set of paths
  constructor(baseURL: string, assetPaths: Array<string>) {
    this.assetPaths = assetPaths;
    this.baseURL = baseURL;
  }

  handleRequest(request: Request): Promise<Response> {
    // lets parse the URL into a proper URL object
    const url = new URL(request.url)

    // if this is in the asset path, fetch that asset
    // if this is not in the asset paths, return index.html
    const path = this.assetPaths.some((path: string) => url.pathname.startsWith(path))
      ? url.pathname
      : '/index.html'

    // fetch the path from S3, include the original response
    // so that headers, auth, etc aren't lost
    return fetch(
      `${this.baseURL}${path}${url.search}`,
      request
    )
  }
}

export { SPARouter };