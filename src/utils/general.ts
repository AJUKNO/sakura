import { Sakura } from '@/sakura'
import EasterEgg from '@/elements/easter-egg'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const artValues = [
  'pompompurin',
  'hello_kitty',
  'keroppi',
  'cinnamoroll',
  'doraemon',
  'yuuka',
  'lain',
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

/**
 * Debounce function
 * @param fn
 * @param wait
 */
export const debounce = (fn: (...args: unknown[]) => void, wait: number) => {
  let t: string | number | NodeJS.Timeout | undefined
  return (...args: unknown[]) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}

/**
 * Initialize the easter egg
 * Adds an easter egg to the page by listening to the Konami code
 * If the Konami code is entered, an image of Lain from Serial Experiments Lain is added to the page
 * @returns {void}
 */
export const initEasterEgg = (): void => {
  const konamiCode: string[] = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ]
  let konamiCodePosition = 0

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const keyCode = event.code
    const render = () => {
      const easterEgg = document.createElement('easter-egg')
      easterEgg.setAttribute('id', 'easter-egg')
      easterEgg.innerHTML = `<img src="https://miorin.neocities.org/themes/random/images/static30.gif" alt="Lain">`
      document.querySelector('body')?.append(easterEgg)
    }

    if (keyCode === konamiCode[konamiCodePosition]) {
      konamiCodePosition++

      if (konamiCodePosition === konamiCode.length) {
        render()
        Sakura.defineElement({
          tagName: 'easter-egg',
          elementClass: EasterEgg,
        })
        konamiCodePosition = 0
      }
    } else {
      konamiCodePosition = 0
    }
  })
}

export const animateSvgLogo = () => {
  gsap.registerPlugin(ScrollTrigger)
  const colors = [
    '#322320', // Original color
    '#4A3A2A',
    '#5C4C3C',
    '#7A6351',
    '#948079',
    '#BBA9A0',
    '#ECB176',
    '#E6B325',
  ]
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
  const getRandomPaths = () => {
    const paths = document.querySelectorAll('#himawari path')
    return Array.from(paths)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(paths.length * 0.5))
  }
  const animatePaths = () => {
    const randomPaths = getRandomPaths()
    gsap.to(randomPaths, {
      duration: 1,
      stagger: 0.02,
      fill: () => getRandomColor(),
      onComplete: animatePaths,
    })
  }

  gsap.set('#himawari path', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#himawari',
    },
  })

  gsap.to('#himawari path', {
    duration: 2,
    stagger: 0.1,
    ease: 'power4',
    opacity: 1,
  })

  animatePaths()
}
