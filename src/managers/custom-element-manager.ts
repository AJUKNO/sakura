import { CustomElementManager, ElementProvider, LazyProvider } from '@/types';

export default class CustomElementManagerImpl
  implements CustomElementManager<ElementProvider>
{
  elements: Map<string, { active: boolean; provider: ElementProvider }> =
    new Map();

  async define(tag: string, element: ElementProvider): Promise<void> {
    try {
      this.validateElement(tag);

      const provider = await this.resolveProvider(element);

      this.elements.set(tag, {
        active: true,
        provider: element,
      });

      customElements.define(tag, provider);
    } catch (error) {
      this.handleError(tag, element, error);
    }
  }

  get(tag: string): ElementProvider | undefined {
    return this.elements.get(tag)?.provider;
  }

  clear(): void {
    this.elements.clear();
  }

  async redefine(): Promise<void> {
    for (const [tag, elementEntry] of this.elements) {
      await this.define(tag, elementEntry.provider);
    }
  }

  private async resolveProvider(
    element: ElementProvider
  ): Promise<CustomElementConstructor> {
    if (this.isLazyElementProvider(element)) {
      return (await element.provider()).default;
    }
    return element;
  }

  private validateElement(tag: string): void {
    if (!document.querySelector(tag)) {
      throw new Error(`Element with tag '${tag}' not found in DOM`);
    }
    if (customElements.get(tag)) {
      throw new Error(`Element with tag '${tag}' is already defined`);
    }
  }

  private handleError(
    tag: string,
    element: ElementProvider,
    error: unknown
  ): void {
    console.error(`Failed to define element '${tag}':`, error);
    this.elements.set(tag, {
      active: false,
      provider: element,
    });
  }

  private isLazyElementProvider(
    provider: ElementProvider
  ): provider is LazyProvider<CustomElementConstructor> {
    return 'lazy' in provider && provider.lazy;
  }
}
