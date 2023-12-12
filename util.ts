/**
 * An extension of the `Partial` type provided natively by Typescript that recursively renders fields optional
 * @template T The type whose fields are to be rendered partial
 */
export type DeepPartial<T extends object> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * An extension of the `Required` type provided natively by Typescript that recursively renders fields required
 * @template T The type whose fields are to be rendered required
 */
export type DeepRequired<T extends object> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/**
 * The inverse of the natively provided `Readonly` type, this type marks all fields as mutable
 * @template T The type whose fields are to be rendered mutable
 */
export type Mutable<T extends object> = {
    -readonly [K in keyof T]: T[K]
};

/**
 * Represents an event handler function for `Element.addEventListener`
 * @template T The type of element to which this listener is attached
 * @template K The type of event this listener listens for
*/
export type SimpleListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[T], ev: HTMLElementEventMap[K]) => void;

/**
 * Represents a more complex listener where options—such as `passive` and `once`—have been specified.
 * @template T The type of element to which this listener is attached
 * @template K The type of event this listener listens for
 */
export type OptionsListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = {
    /**
     * The callback to invoke when the corresponding event is fired
     */
    readonly callback: SimpleListener<T, K>;
    /**
     * Identical to the third parameter of `EventTarget.addEventListener`
     */
    readonly options?: boolean | AddEventListenerOptions;
};

/**
 * Creates an element, along with any properties, children and listeners one wishes to add
 * @template K The element's tag name
 * @param key The element's tag name
 * @param properties An object specifying the element's properties. All properties are optional
 * @param children Either a single string, a single Node, or an array of both. (`HTMLElement` extends `Node`)
 * @param listeners An object whose keys correspond to the event's name (same as the first argument to `HTMLElement.addEventListener`)
 * and whose values are either a single listener or an array of them, with each listener being one for the chosen event.
 * (same as the second argument to `HTMLElement.addEventListener`)
 * @returns The created element
 */
export function makeElement<K extends keyof HTMLElementTagNameMap>(
    key: K,
    properties?: Readonly<DeepPartial<HTMLElementTagNameMap[K]>>,
    children?: string | Node | (string | Node)[],
    listeners?: {
        readonly [key in keyof HTMLElementEventMap]?: SimpleListener<K, key> | OptionsListener<K, key> | (SimpleListener<K, key> | OptionsListener<K, key>)[];
    }
): HTMLElementTagNameMap[K] {
    type Element = HTMLElementTagNameMap[K];
    type ElementAttribute = Element[keyof Element];

    const element = document.createElement(key);

    for (const [key, value] of Object.entries(properties ?? {}) as [keyof Element, ElementAttribute][]) {
        if (typeof element[key] == "object")

            for (
                const [
                    objKey,
                    objVal
                ] of
                Object.entries(value as object) as [keyof ElementAttribute, ElementAttribute[keyof ElementAttribute]][]
            ) element[key][objKey] = objVal;
        else element[key] = value;
    }

    children && element.append(...[children].flat().filter(v => v !== void 0));

    for (const [event, lis] of Object.entries(listeners ?? {}))
        for (const li of [lis].flat())
            if (typeof li == "function")
                (element.addEventListener as any /* forgive me for I have sinned */)(event, li);
            else
                (element.addEventListener as any /* anyScript */)(event, li.callback, li.options);

    return element;
}

export class Maybe<T> {
    #hasValue: boolean;
    get hasValue() { return this.#hasValue; }

    #value: T | undefined;
    get value() {
        if (this.#hasValue) {
            return this.#value;
        }

        throw new Error("No value present");
    }

    static #allowInstantiation = false;

    static from<T>(value: T) {
        Maybe.#allowInstantiation = true;
        const maybe = new Maybe(true, value);
        Maybe.#allowInstantiation = false;
        return maybe;
    }

    static empty<T>() {
        Maybe.#allowInstantiation = true;
        const maybe = new Maybe<T>(false);
        Maybe.#allowInstantiation = false;
        return maybe;
    }

    private constructor(hasValue: false)
    private constructor(hasValue: true, value: T)
    private constructor(hasValue: boolean, value?: T) {
        if (!Maybe.#allowInstantiation) {
            throw new Error("Cannot invoke this class' constructor directly. Use the static from or empty methods.");
        }

        if (this.#hasValue = hasValue) {
            this.#value = value;
        }
    }

    toString() {
        return this.#hasValue ? String(this.#value) : "ø";
    }
}