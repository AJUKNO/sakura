export const artValues = [
  'pompompurin',
  'hello_kitty',
  'keroppi',
  'cinnamoroll',
  'doraemon',
  'yuuka',
] as const

/**
 * Parse HTML string to DOM
 * @param html - The HTML string to parse
 * @returns {Document}
 */
export const HTMLParser = (html: string): Document => {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

/**
 * Http client
 */
export const HttpClient = {
  /**
   * Get request
   * @param {RequestInfo | URL} url
   * @param {RequestInit | undefined} options
   * @returns {Promise<Response>}
   */
  get: async (
    url: RequestInfo | URL,
    options?: RequestInit | undefined,
  ): Promise<Response> => {
    return await fetch(url, options)
  },

  /**
   * Post request
   * @param {RequestInfo | URL} url
   * @param {RequestInit | undefined} options
   * @returns {Promise<Response>}
   */
  post: async (
    url: RequestInfo | URL,
    options?: RequestInit | undefined,
  ): Promise<Response> => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    return await fetch(url, requestOptions)
  },
}

/**
 * Rerender an element by its selector
 * @param selector
 * @param html
 */
export const rerenderBySelector = (
  selector: string | undefined,
  html: string,
): Element => {
  if (!selector) throw new Error('Selector is required')

  const element = HTMLParser(html).querySelector(selector)

  if (!element) throw new Error('Element not found')

  const target = document.querySelector(selector)
  target?.replaceWith(element)

  return element
}

/**
 * Delay a promise
 * @param ms - The number of milliseconds to delay
 * @returns {Promise<void>}
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Linear interpolation
 * @param start - The start value
 * @param end - The end value
 * @param amt - The amount to interpolate
 * @returns {number}
 */
export const lerp = ({
  start,
  end,
  amt,
}: {
  start: number
  end: number
  amt: number
}): number => (1 - amt) * start + amt * end

export const debounce = (fn: (...args: unknown[]) => void, wait: number) => {
  let t: string | number | NodeJS.Timeout | undefined
  return (...args: unknown[]) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}
