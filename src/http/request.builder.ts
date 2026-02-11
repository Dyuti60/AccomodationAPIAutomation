// src/http/request.builder.ts
export default class RequestBuilder {
  private config: any = {}

  withHeaders(headers: Record<string, string>) {
    this.config.headers = { ...this.config.headers, ...headers }
    return this
  }

  withAuth(token: string, bearer = true) {
    this.config.headers = {
      ...this.config.headers,
      Authorization: bearer ? `Bearer ${token}` : token
    }
    return this
  }

  withQuery(params: Record<string, string | number>) {
    this.config.params = params
    return this
  }

  build() {
    return this.config
  }
}
