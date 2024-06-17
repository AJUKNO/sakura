import { IBaseElement } from '@/types/interfaces'
import { SakuraLogger } from '@/utils/logger'

/**
 * BaseElement
 * @implements IBaseElement
 */
export abstract class BaseElement extends HTMLElement implements IBaseElement {
  identifier: string | undefined
  section: string | undefined
  debug: boolean | undefined
  loading: boolean | undefined
  error: boolean | undefined

  constructor() {
    super()
  }

  public connectedCallback(): void {
    // Initialize data attributes
    this.identifier = this.getAttribute('data-id') || undefined
    this.section = this.getAttribute('data-section') || undefined
    this.debug = this.hasAttribute('data-debug')
    this.loading = this.hasAttribute('data-loading')
    this.error = this.hasAttribute('data-error')

    this.init()

    // Debug log
    this.debug && SakuraLogger.d(`Connected ${this.tagName}`)
  }

  public abstract disconnectedCallback(): void

  public abstract init(): void

  public toggleLoading(state: boolean): void {
    this.toggleAttribute('data-loading', state)
    this.loading = state
  }

  public toggleError(state: boolean, message?: string | undefined): void {
    this.setError(message || '')
    this.toggleAttribute('data-error', state)
    this.error = state
  }

  public setError(message: string): void {
    const errorElement = this.querySelector('[data-id=error-message-content]')
    if (errorElement) {
      errorElement.textContent = message
    }
  }
}
