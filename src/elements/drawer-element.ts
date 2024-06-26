import { IDrawerElement } from '@/types/interfaces'
import { BaseElement } from '@/elements/base-element'

/**
 * DrawerElement
 * @extends BaseElement
 * @implements IDrawerElement
 */
class DrawerElement extends BaseElement implements IDrawerElement {
  static activeDrawer: IDrawerElement | undefined
  open: boolean | undefined
  menu: HTMLElement | undefined
  closeButton: HTMLButtonElement | undefined
  openButton: HTMLButtonElement | undefined

  static closeAllDrawers(): void {
    if (DrawerElement.activeDrawer) {
      DrawerElement.activeDrawer.toggleOpen(false)
    }
  }

  disconnectedCallback(): void {
    this.closeButton?.removeEventListener('click', this.closeHandler.bind(this))
    this.openButton?.removeEventListener('click', this.openHandler.bind(this))

    this.removeEventListener('click', this.onOutsideClick.bind(this))
    document.removeEventListener('keydown', this.keydownHandler.bind(this))
  }

  init(): void {
    this.open = this.hasAttribute('data-open')

    this.closeButton = document.querySelector(
      `[data-id=${this.identifier}-close-button]`,
    ) as HTMLButtonElement
    this.openButton = document.querySelector(
      `[data-id=${this.identifier}-open-button]`,
    ) as HTMLButtonElement
    this.menu = this.querySelector(
      `[data-id=${this.identifier}-menu]`,
    ) as HTMLElement

    this.closeButton?.addEventListener('click', this.closeHandler.bind(this))
    this.openButton?.addEventListener('click', this.openHandler.bind(this))

    this.addEventListener('click', this.onOutsideClick.bind(this))
  }

  onOutsideClick(event: MouseEvent): void {
    // Close the cart drawer if the click is outside the drawer
    if (this.open && !this.menu?.contains(event.target as Node)) {
      this.toggleOpen(false)
    }
  }

  openHandler(): void {
    this.toggleOpen(true)
  }

  toggleOpen(state: boolean): void {
    if (state) {
      DrawerElement.closeAllDrawers() // Close all other drawers before opening the new one
      DrawerElement.activeDrawer = this
      document.addEventListener('keydown', this.keydownHandler.bind(this))
      this.menu?.focus()
    } else {
      DrawerElement.activeDrawer = undefined
      document.removeEventListener('keydown', this.keydownHandler.bind(this))
      // this.openButton?.focus()
    }

    this.open = state
    this.toggleAttribute('data-open', state)
    this.openButton?.setAttribute('aria-expanded', state.toString())
  }

  private keydownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' && DrawerElement.activeDrawer === this) {
      this.toggleOpen(false)
    }
  }

  private closeHandler(): void {
    this.toggleOpen(false)
  }
}

export default DrawerElement
