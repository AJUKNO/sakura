import { Logger, SakuraLogger } from '@/utils/logger'
import { ascii } from '@/utils/ascii'
import type {
  IBarbaOptions,
  ICustomElement,
  ILogger,
  ISakura,
  ISakuraOptions,
  SakuraArt,
} from '@/types/interfaces'
import {
  SAKURA_DEBUG,
  SAKURA_DEBUG_GREETING,
  SAKURA_KAWAII_ART,
  SAKURA_KAWAII_GREETING,
} from '@/utils/constants'
import { artValues } from '@/utils/general'
import { ISakuraPubSub } from '@/types/events'
import { SakuraPS } from '@/utils/pubsub'
import LocomotiveScroll from 'locomotive-scroll'
import barba from '@barba/core'

export class Sakura implements ISakura {
  customElementsRegistry: Map<string, CustomElementConstructor> = new Map()
  elements: ICustomElement[] = []
  options: ISakuraOptions
  logger: ILogger = SakuraLogger
  pubSub: ISakuraPubSub = SakuraPS

  constructor(options: ISakuraOptions, callback?: () => void) {
    this.options = {
      debug: SAKURA_DEBUG,
      kawaii: {
        art: SAKURA_KAWAII_ART,
        greeting: SAKURA_KAWAII_GREETING,
      },
      ...options,
    }
    if (this.options.prefix) {
      this.logger = new Logger(this.options.prefix)
    }

    if (this.options.locomotive) {
      new LocomotiveScroll({
        lenisOptions: {
          duration: 0.7,
        },
      })
    }

    if (this.options.barba?.enabled) {
      this.initBarba(this.options.barba)
    }

    callback && callback()
    this.init(this.options)
  }

  static defineElement(element: ICustomElement, debug?: boolean): void {
    if (document.querySelector(element.tagName) === null) {
      SakuraLogger.w(
        `Element ${element.tagName} not found in the DOM. Skipping definition`,
      )
      return
    }

    if (!customElements.get(element.tagName)) {
      debug && SakuraLogger.d(`Defining ${element.tagName}`)
      customElements.define(element.tagName, element.elementClass)
    } else {
      SakuraLogger.w(`Element ${element.tagName} already defined`)
    }
  }

  init(options: ISakuraOptions): void {
    if (options.kawaii) {
      this.logger.i(ascii[options.kawaii.art])
      if (options.kawaii.greeting) {
        this.logger.i(options.kawaii.greeting)
      }
    }
    options.debug && this.logger.d(SAKURA_DEBUG_GREETING)
  }

  define(elements: ICustomElement[]): void {
    this.elements = elements
    elements.forEach(({ tagName, elementClass }) => {
      if (document.querySelector(tagName) === null) {
        this.options.debug &&
          this.logger.w(
            `Element ${tagName} not found in the DOM. Skipping definition`,
          )
        return
      }
      if (!this.customElementsRegistry.has(tagName)) {
        this.options.debug && this.logger.d(`Defining ${tagName}`)
        customElements.define(tagName, elementClass)
        this.customElementsRegistry.set(tagName, elementClass)
      } else {
        this.options.debug && this.logger.w(`Element ${tagName} already defined`)
      }
    })
  }

  reset(): void {
    this.define(this.elements)
  }

  kawaii(art: SakuraArt, greeting?: string): void {
    if (artValues.includes(art)) {
      this.logger.i(ascii[art])
    } else {
      throw new Error(`Art ${art} not found`)
    }
    greeting && this.logger.i(greeting)
  }

  private initBarba(options: IBarbaOptions): void {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual'
    }

    barba.init({
      views: options.views,
      transitions: options.transitions,
    })
    options.hooks &&
      Object.keys(options.hooks).forEach((hook: string) => {
        // @ts-expect-error: Should return HookFunction from options
        options.hooks?.[hook] && barba.hooks[hook](options.hooks[hook])
      })

    barba.hooks.beforeEnter(() => this.reset())
  }
}
