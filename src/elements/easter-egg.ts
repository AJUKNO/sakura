import DraggableElement from '@/elements/draggable-element'

/**
 * EasterEgg
 * @extends DraggableElement
 * @description Draggable Easter Egg element
 */
class EasterEgg extends DraggableElement {
  init(): void {
    super.init()

    // Set start position in center, keep width and height of element in mind
    this.style.left = `calc(50% - ${this.getBoundingClientRect().width / 2}px)`
    this.style.top = `calc(50% - ${this.getBoundingClientRect().height / 2}px)`
  }
}

export default EasterEgg
