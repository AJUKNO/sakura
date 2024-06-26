import { BaseElement } from '@/elements/base-element'
import { IBaseElement } from '@/types/interfaces'
import { SakuraLogger } from '@/utils/logger'

export interface IDraggableElement extends IBaseElement {
  offset: {
    x: number
    y: number
  }
  isDragging: boolean

  onDrag(event: MouseEvent): void
  onMouseMove(event: MouseEvent): void
  onMouseUp(): void
}

/**
 * DraggableElement
 * @extends BaseElement
 */
class DraggableElement extends BaseElement implements IDraggableElement {
  offset: { x: number; y: number } = { x: 0, y: 0 }
  isDragging: boolean = false

  public init(): void {
    // Add event listeners
    this.addEventListener('mousedown', this.onDrag.bind(this))
  }

  public disconnectedCallback(): void {
    throw new Error('Method not implemented.')
  }

  public onDrag(event: MouseEvent): void {
    this.isDragging = true

    this.offset = {
      x: event.clientX - this.getBoundingClientRect().left,
      y: event.clientY - this.getBoundingClientRect().top,
    }

    SakuraLogger.d('Dragging element', this.offset)

    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  public onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return

    this.style.left = `${event.clientX - this.offset.x}px`
    this.style.top = `${event.clientY - this.offset.y}px`
  }

  public onMouseUp(): void {
    this.isDragging = false

    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    document.removeEventListener('mouseup', this.onMouseUp.bind(this))
  }
}

export default DraggableElement
