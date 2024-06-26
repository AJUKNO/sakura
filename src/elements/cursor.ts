import { BaseElement } from '@/elements/base-element'
import { combinedEvents, SakuraSubscriberCallback } from '@/types/events'
import { SakuraPS } from '@/utils/pubsub'
import { lerp } from '@/utils/general'
import { ICursor } from '@/types/interfaces'

/**
 * Enum representing different cursor states.
 */
export enum CursorState {
  ACTIVE = 'active',
  ZOOM = 'zoom',
  LINK = 'link',
  DOWN = 'down',
  FLOWER = 'flower',
}

class Cursor extends BaseElement implements ICursor {
  position: {
    target: { x: number; y: number }
    current: { x: number; y: number }
    previous: { x: number }
  } = {
    target: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    previous: { x: 0 },
  }
  state: Array<CursorState> = []

  init(): void {
    this.style.transform = 'translate(-50%, -50%)'
    this.setupListeners()
    this.subscribeToEvents()
    this.animateCursor()
  }

  disconnectedCallback(): void {
    document.removeEventListener('mousemove', this.updateCursorPosition.bind(this))
    this.unsubscribeFromEvents()
  }

  animateCursor(): void {
    this.position.current.x = lerp({
      start: this.position.current.x,
      end: this.position.target.x,
      amt: 0.1,
    })
    this.position.current.y = lerp({
      start: this.position.current.y,
      end: this.position.target.y,
      amt: 0.1,
    })

    const deltaX = this.position.current.x - this.position.previous.x
    const swayAngle = deltaX * 10
    const flip = deltaX < 0 ? -1 : 1

    this.style.left = `${this.position.current.x}px`
    this.style.top = `${this.position.current.y}px`
    this.style.transform = `translate(-50%, -50%) rotate(${swayAngle}deg) scaleX(${flip})`

    this.position.previous.x = this.position.current.x
    requestAnimationFrame(this.animateCursor.bind(this))
  }

  expandCursor(): void {
    this.style.width = '40px'
    this.style.height = '40px'
  }

  shrinkCursor(): void {
    this.style.width = '20px'
    this.style.height = '20px'
  }

  displayText(e: MouseEvent): void {
    this.innerText = (e.target as HTMLElement).getAttribute('data-cursor-text') || ''
  }

  clearText(): void {
    this.innerText = ''
  }

  updateCursorPosition(e: MouseEvent): void {
    this.position.target.x = e.clientX
    this.position.target.y = e.clientY
  }

  manageEvents(): void {
    this.setupListeners()
  }

  private updateCursorState(state: CursorState, enable: boolean): void {
    this.state = enable
      ? [...this.state, state]
      : this.state.filter((s) => s !== state)
    if (enable) {
      this.setAttribute(`data-${state}`, '')
    } else {
      this.removeAttribute(`data-${state}`)
    }
  }

  private addMouseEventListeners({
    selectors,
    onEnter,
    onLeave,
  }: {
    selectors: string
    onEnter: () => void
    onLeave: () => void
  }): void {
    document.querySelectorAll(selectors).forEach((element) => {
      element.addEventListener('mouseenter', onEnter)
      element.addEventListener('mouseleave', onLeave)
    })
  }

  private addStateEventListeners(selectors: string, ...states: CursorState[]): void {
    this.addMouseEventListeners({
      selectors,
      onEnter: () => {
        states.forEach((state) => this.updateCursorState(state, true))
      },
      onLeave: () => {
        states.forEach((state) => this.updateCursorState(state, false))
      },
    })
  }

  private setupListeners(): void {
    document.addEventListener('mousemove', this.updateCursorPosition.bind(this))

    document.addEventListener('mousedown', () => {
      this.updateCursorState(CursorState.DOWN, true)
    })
    document.addEventListener('mouseup', () => {
      this.updateCursorState(CursorState.DOWN, false)
    })

    this.addStateEventListeners(
      '[data-cursor-zoom]',
      CursorState.ACTIVE,
      CursorState.ZOOM,
    )
    this.addStateEventListeners(
      '[data-cursor-flower]',
      CursorState.ACTIVE,
      CursorState.FLOWER,
    )
    this.addStateEventListeners('a, button', CursorState.ACTIVE, CursorState.LINK)
  }

  private subscribeToEvents(): void {
    combinedEvents.forEach((event) => {
      SakuraPS.subscribe(
        event,
        this.manageEvents.bind(this) as SakuraSubscriberCallback,
      )
    })
  }

  private unsubscribeFromEvents(): void {
    combinedEvents.forEach((event) => {
      SakuraPS.unsubscribe(
        event,
        this.manageEvents.bind(this) as SakuraSubscriberCallback,
      )
    })
  }
}

export default Cursor
