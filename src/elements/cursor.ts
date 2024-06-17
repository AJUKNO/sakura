import { BaseElement } from '@/elements/base-element'
import {
  SakuraCartEvent,
  SakuraFilterEvent,
  SakuraProductEvent,
  SakuraSubscriberCallback,
} from '@/types/events'
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
    const swayAngle = deltaX * 2
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
    this.addStateEventListeners('a, button', CursorState.ACTIVE, CursorState.LINK)
  }

  private subscribeToEvents(): void {
    const events = [
      ...Object.values(SakuraCartEvent),
      ...Object.values(SakuraProductEvent),
      ...Object.values(SakuraFilterEvent),
    ]
    events.forEach((event) => {
      SakuraPS.subscribe(
        event,
        this.manageEvents.bind(this) as SakuraSubscriberCallback,
      )
    })
  }

  private unsubscribeFromEvents(): void {
    const events = [
      ...Object.values(SakuraCartEvent),
      ...Object.values(SakuraProductEvent),
      ...Object.values(SakuraFilterEvent),
    ]
    events.forEach((event) => {
      SakuraPS.unsubscribe(
        event,
        this.manageEvents.bind(this) as SakuraSubscriberCallback,
      )
    })
  }
}

export default Cursor

//
// class Cursor extends BaseElement implements ICursor {
//   constructor() {
//     super()
//
//     // Reference to the cursor div
//     this.cursor = this.querySelector('#cursor')
//
//     // Initial positions
//     this.targetX = 0
//     this.targetY = 0
//     this.currentX = 0
//     this.currentY = 0
//     this.previousX = 0
//
//     // Bind methods
//     this.updateCursor = this.updateCursor.bind(this)
//     this.animate = this.animate.bind(this)
//     this.expandCursor = this.expandCursor.bind(this)
//     this.shrinkCursor = this.shrinkCursor.bind(this)
//     this.showText = this.showText.bind(this)
//     this.hideText = this.hideText.bind(this)
//
//     // Initialize cursor position
//     this.cursor.style.transform = 'translate(-50%, -50%)' // Center the cursor initially
//
//     // Start animation loop
//     this.animate()
//   }
//
//   connectedCallback() {
//     document.addEventListener('mousemove', this.updateCursor)
//     this.setListeners()
//     ;[
//       ...Object.values(SakuraCartEvent),
//       ...Object.values(SakuraProductEvent),
//       ...Object.values(SakuraFilterEvent),
//     ].map((event) => {
//       SakuraPS.subscribe(event, <SakuraSubscriberCallback>this.callback.bind(this))
//     })
//   }
//
//   setListeners() {
//     document.addEventListener('mousedown', () => {
//       this.setAttribute('data-down', '')
//     })
//     document.addEventListener('mouseup', () => {
//       this.removeAttribute('data-down')
//     })
//     document.querySelectorAll('[data-cursor-expand]').forEach((el) => {
//       el.addEventListener('mouseenter', this.expandCursor)
//       el.addEventListener('mouseleave', this.shrinkCursor)
//     })
//     document.querySelectorAll('[data-cursor-zoom]').forEach((el) => {
//       el.addEventListener('mouseenter', () => {
//         this.setAttribute('data-active', '')
//         this.setAttribute('data-zoom', '')
//       })
//       el.addEventListener('mouseleave', () => {
//         this.removeAttribute('data-active')
//         this.removeAttribute('data-zoom')
//       })
//     })
//     document.querySelectorAll('[data-cursor-text]').forEach((el) => {
//       el.addEventListener('mouseenter', this.showText)
//       el.addEventListener('mouseleave', this.hideText)
//     })
//
//     document.querySelectorAll('a, button').forEach((el) => {
//       el.addEventListener('mouseenter', () => {
//         this.setAttribute('data-active', '')
//         this.setAttribute('data-link', '')
//       })
//       el.addEventListener('mouseleave', () => {
//         this.removeAttribute('data-active')
//         this.removeAttribute('data-link')
//       })
//     })
//   }
//
//   disconnectedCallback() {
//     document.removeEventListener('mousemove', this.updateCursor)
//   }
//
//   callback() {
//     this.setListeners()
//   }
//
//   updateCursor(e) {
//     // Set target positions
//     this.targetX = e.clientX
//     this.targetY = e.clientY
//   }
//
//   animate() {
//     // Linear interpolation function
//     const lerp = (start: number, end: number, amt: number) =>
//       (1 - amt) * start + amt * end
//
//     // Update current positions with lerp
//     this.currentX = lerp(this.currentX, this.targetX, 0.1)
//     this.currentY = lerp(this.currentY, this.targetY, 0.1)
//
//     // Calculate sway based on horizontal movement
//     const deltaX = this.currentX - this.previousX
//     const swayAngle = deltaX * 2 // Adjust multiplier for desired sway effect
//
//     // Determine flip based on direction
//     const flip = deltaX < 0 ? -1 : 1 // Flip horizontally if moving left, normal if moving right
//
//     // Apply the new positions, sway, and flip to the cursor
//     if (this.cursor) {
//       this.cursor.style.left = `${this.currentX}px`
//       this.cursor.style.top = `${this.currentY}px`
//       this.cursor.style.transform = `translate(-50%, -50%) rotate(${swayAngle}deg) scaleX(${flip})`
//     }
//
//     // Update previousX for the next frame
//     this.previousX = this.currentX
//
//     // Request next animation frame
//     requestAnimationFrame(this.animate)
//   }
//
//   expandCursor() {
//     this.cursor.style.width = '40px'
//     this.cursor.style.height = '40px'
//   }
//
//   shrinkCursor() {
//     this.cursor.style.width = '20px'
//     this.cursor.style.height = '20px'
//   }
//
//   showText(e) {
//     this.cursor.innerText = e.target.getAttribute('data-cursor-text')
//   }
//
//   hideText() {
//     this.cursor.innerText = ''
//   }
// }
