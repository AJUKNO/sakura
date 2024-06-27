import { Logger, SakuraLogger } from '@/utils/logger'
import { ascii } from '@/utils/ascii'
import type {
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
import { artValues, initEasterEgg } from '@/utils/general'
import { ISakuraPubSub } from '@/types/events'
import { SakuraPS } from '@/utils/pubsub'
import { animations } from '@/utils/animations'

export class Sakura implements ISakura {
  customElementsRegistry: Map<string, CustomElementConstructor> = new Map()
  options: ISakuraOptions
  logger: ILogger = SakuraLogger
  pubSub: ISakuraPubSub = SakuraPS

  constructor(options: ISakuraOptions) {
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
    animations()
    initEasterEgg()
  }

  define(elements: ICustomElement[]): void {
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
    this.define(
      Array.from(this.customElementsRegistry.entries()).map(
        ([tagName, elementClass]) => {
          this.options.debug && this.logger.d(`Resetting ${tagName}`)
          return { tagName, elementClass }
        },
      ),
    )
  }

  kawaii(art: SakuraArt, greeting?: string): void {
    if (artValues.includes(art)) {
      this.logger.i(ascii[art])
    } else {
      throw new Error(`Art ${art} not found`)
    }
    greeting && this.logger.i(greeting)
  }
}
