import { Maybe, makeElement } from "../../util.js";
import { TableView } from "./TableView.js";

/**
 * A class representing a column in a table
 */
export class TableColumn<Element, Data = unknown> {
    title: string;
    description: string;

    converter: (obj: Element) => Data;

    constructor(title: string, converter: (obj: Element) => Data, description?: string) {
        this.title = title;
        this.converter = converter;
        this.description = description ?? "";
    }

    static fromCollection<T extends object>(prototypes: T[]) {
        const keys: Set<keyof T> = new Set();

        prototypes.map(obj => Object.keys(obj) as (keyof T)[]).flat().forEach(keys.add.bind(keys));

        return [...keys].map(e => TableColumn.fromObjectKey<T, keyof T>(e));
    }

    static fromObjectKeys<T extends object>(prototype: T) {
        return (Object.keys(prototype) as (keyof T)[]).map(key => TableColumn.fromObjectKey<T, keyof T>(key));
    }

    static fromObjectKey<T extends object, K extends keyof T = keyof T>(key: K, displayName: string = String(key), description = "") {
        return new TableColumn<T, Maybe<T[K]>>(displayName, e => key in e ? Maybe.from(e[key]) : Maybe.empty(), description);
    }
}