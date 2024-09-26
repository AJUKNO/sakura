interface Installer<T> {
  install(items: T[]): void;
}
/**
 * Interface for managing a collection of elements identified by tags.
 *
 * This interface provides methods to define, retrieve, reset, and redefine elements based on their tags.
 * It uses a generic type `T` to specify the type of elements being managed.
 *
 * @template T - The type of elements managed by the interface.
 * @interface
 */
export interface ElementManager<T> {
  /**
   * A map storing elements with their associated tag names.
   *
   * The keys are tag names, and the values are the elements corresponding to those tags.
   */
  elements: Map<string, T>;

  /**
   * Defines a new element with a specified tag. If an element with the same tag already exists, it will be replaced.
   *
   * @param tag - The tag name for the element to be defined.
   * @param element - The element to be associated with the tag. This can be a constructor or a factory function returning a constructor.
   * @returns {Promise<void>} A promise that resolves when the element has been defined.
   */
  defineElement(tag: string, element: T): Promise<void>;

  /**
   * Retrieves an element associated with a given tag.
   *
   * @param tag - The tag name of the element to retrieve.
   * @returns {T | undefined} The element associated with the tag, or `undefined` if no element is found.
   */
  getElement(tag: string): T | undefined;

  /**
   * Resets the manager by clearing all defined elements.
   *
   * @returns {void}
   */
  reset(): void;

  /**
   * Redefines all previously defined elements. This method is useful for reapplying definitions.
   *
   * @returns {Promise<void>} A promise that resolves when all elements have been redefined.
   */
  redefine(): Promise<void>;
}

/**
 * Type representing a provider for a custom element.
 *
 * An `ElementProvider` can be either a function that returns a promise resolving to an object with a default export of a `CustomElementConstructor`,
 * or a `CustomElementConstructor` directly.
 *
 * @typedef {(() => Promise<{ readonly default: CustomElementConstructor }>) | CustomElementConstructor} ElementProvider
 */
export type ElementProvider =
  | (() => Promise<{ readonly default: CustomElementConstructor }>)
  | CustomElementConstructor;

/**
 * Type representing the data associated with a custom element.
 *
 * This type contains the tag name and the element associated with it, providing a structure for managing custom elements.
 *
 * @template T - The type of the element.
 * @typedef {Object} ElementData
 * @property {string} tagName - The tag name of the custom element.
 * @property {T} element - The custom element associated with the tag name.
 */
export type ElementData<T> = {
  tagName: string;
  element: T;
};
