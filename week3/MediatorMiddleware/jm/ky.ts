/**
 * @link https://github.com/sindresorhus/ky/blob/main/source/core/Ky.ts
 */
export class Ky {
  // 중략..

  // eslint-disable-next-line complexity
  constructor(input: Input, options: Options = {}) {
    // 중략..

    this._options = {
      ...(credentials && { credentials }), // For exactOptionalPropertyTypes
      ...options,
      headers: mergeHeaders((this._input as Request).headers, options.headers),
      hooks: deepMerge<Required<Hooks>>(
        {
          beforeRequest: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: [],
        },
        options.hooks
      ),
      method: normalizeRequestMethod(options.method ?? (this._input as Request).method),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      prefixUrl: String(options.prefixUrl || ''),
      retry: normalizeRetryOptions(options.retry),
      throwHttpErrors: options.throwHttpErrors !== false,
      timeout: options.timeout ?? 10_000,
      fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
    }

    // 중략..

    this.request = new globalThis.Request(this._input, this._options)

    if (this._options.searchParams) {
      // eslint-disable-next-line unicorn/prevent-abbreviations
      const textSearchParams =
        typeof this._options.searchParams === 'string'
          ? this._options.searchParams.replace(/^\?/, '')
          : new URLSearchParams(this._options.searchParams as unknown as SearchParamsInit).toString()
      // eslint-disable-next-line unicorn/prevent-abbreviations
      const searchParams = '?' + textSearchParams
      const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams)

      // To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
      if (
        ((supportsFormData && this._options.body instanceof globalThis.FormData) ||
          this._options.body instanceof URLSearchParams) &&
        !(this._options.headers && (this._options.headers as Record<string, string>)['content-type'])
      ) {
        this.request.headers.delete('content-type')
      }

      // The spread of `this.request` is required as otherwise it misses the `duplex` option for some reason and throws.
      this.request = new globalThis.Request(
        new globalThis.Request(url, { ...this.request }),
        this._options as RequestInit
      )
    }

    if (this._options.json !== undefined) {
      this._options.body = this._options.stringifyJson?.(this._options.json) ?? JSON.stringify(this._options.json)
      this.request.headers.set('content-type', this._options.headers.get('content-type') ?? 'application/json')
      this.request = new globalThis.Request(this.request, { body: this._options.body })
    }
  }

  protected async _fetch(): Promise<Response> {
    for (const hook of this._options.hooks.beforeRequest) {
      // eslint-disable-next-line no-await-in-loop
      const result = await hook(this.request, this._options as unknown as NormalizedOptions)

      if (result instanceof Request) {
        this.request = result
        break
      }

      if (result instanceof Response) {
        return result
      }
    }

    const nonRequestOptions = findUnknownOptions(this.request, this._options)

    if (this._options.timeout === false) {
      return this._options.fetch(this.request.clone(), nonRequestOptions)
    }

    return timeout(this.request.clone(), nonRequestOptions, this.abortController, this._options as TimeoutOptions)
  }

  // 중략..
}

/**
 * @link https://github.com/sindresorhus/ky/blob/main/source/utils/options.ts
 */
export const findUnknownOptions = (request: Request, options: Record<string, unknown>): Record<string, unknown> => {
  const unknownOptions: Record<string, unknown> = {}

  for (const key in options) {
    if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys) && !(key in request)) {
      unknownOptions[key] = options[key]
    }
  }

  return unknownOptions
}
