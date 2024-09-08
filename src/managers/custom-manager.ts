import { ElementManager, ElementProvider } from '@/types';

export default class CustomManager implements ElementManager<ElementProvider> {
  elements: Map<string, ElementProvider>;

  constructor() {
    this.elements = new Map();
  }

  async defineElement(tag: string, element: ElementProvider): Promise<void> {
    this.elements.set(tag, element);
    if (document.querySelector(tag) && !customElements.get(tag)) {
      let elementConstructor: CustomElementConstructor;

      try {
        const res = (
          element as () => Promise<{
            readonly default: CustomElementConstructor;
          }>
        )();

        elementConstructor = (await res).default;
      } catch {
        // If it's not callable and throws an error, it's already a CustomElementConstructor
        elementConstructor = element as CustomElementConstructor;
      }

      customElements.define(tag, elementConstructor);
    }
  }

  getElement(tag: string): ElementProvider | undefined {
    return this.elements.get(tag);
  }

  reset(): void {
    this.elements.clear();
  }

  async redefine(): Promise<void> {
    for (const [tag, element] of this.elements) {
      await this.defineElement(tag, element);
    }
  }
}
