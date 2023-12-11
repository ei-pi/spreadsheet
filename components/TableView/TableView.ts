import { makeElement } from "../../util.js";
import { TableColumn } from "./TableColumn.js";

/**
 * A wrapper around a native `<table>` element used to
 * add extra functionality. It serves to display a list of
 * elements, but each object can only be present once (like in a set).
 * @template Element The type of element displayed in this table
 */
export class TableView<Element> {
    readonly #dom: {
        get container(): HTMLTableElement;
        get header(): HTMLElementTagNameMap["thead"];
        get columnTitles(): HTMLElementTagNameMap["tr"];
        get body(): HTMLElementTagNameMap["tbody"];
        get footer(): HTMLElementTagNameMap["tfoot"];
    };

    readonly #backingSet: Set<Element> = new Set();
    readonly #backingArray: Element[] = [];

    readonly #columnSet: Set<TableColumn<Element, unknown>> = new Set();
    readonly #columnsArray: TableColumn<Element, unknown>[] = [];

    readonly #objectRowMap: Map<Element, HTMLTableRowElement> = new Map;

    title: string;

    constructor(title?: string) {
        this.title = title ?? "";

        const header = makeElement("thead");
        const body = makeElement("tbody");
        const footer = makeElement("tfoot");
        const container = makeElement("table");
        const columnTitles = makeElement("tr");

        this.#dom = {
            get container() { return container; },
            get header() { return header; },
            get columnTitles() { return columnTitles; },
            get body() { return body; },
            get footer() { return footer; }
        };
    }

    #createHydratedRow(item: Element) {
        const row = makeElement(
            "tr",
            {},
            this.#columnsArray.map(col => makeElement(
                "td",
                {
                    innerText: String(col.converter(item))
                }
            ))
        );

        this.#objectRowMap.set(item, row);
        this.#dom.body.appendChild(row);
        return row;
    }

    #addItemToBackings(item: Element) {
        if (this.#backingSet.has(item)) {
            return false;
        }

        const wasEmpty = this.#backingSet.size == 0;

        this.#backingSet.add(item);
        this.#backingArray.push(item);

        const isEmpty = this.#backingSet.size == 0;

        if (wasEmpty != isEmpty) {
            if (isEmpty) {
                this.#dom.body.remove();
            } else {
                this.#dom.container.appendChild(this.#dom.body);
            }
        }

        return true;
    }

    addItem(item: Element) {
        if (this.#addItemToBackings(item)) {
            this.#dom.body.appendChild(this.#createHydratedRow(item));
        }
    }

    addAll(...items: Element[]) {
        this.#dom.body.append(
            ...items.map(item => {
                if (this.#addItemToBackings(item)) {
                    return this.#createHydratedRow(item);
                }
            }).filter(((e?: HTMLTableRowElement) => e) as unknown as (e?: HTMLTableRowElement) => e is HTMLTableRowElement)
        );
    }

    #addColumnToBackings(column: TableColumn<Element, unknown>) {
        if (this.#columnSet.has(column)) return false;

        const wasEmpty = this.#columnSet.size == 0;
        this.#columnSet.add(column);
        this.#columnsArray.push(column);

        const isEmpty = this.#columnSet.size == 0;

        if (wasEmpty != isEmpty) {
            if (isEmpty) {
                this.#dom.columnTitles.remove();
                this.#dom.header.remove();
            } else {
                this.#dom.header.appendChild(this.#dom.columnTitles);
                this.#dom.container.appendChild(this.#dom.header);
            }
        }

        return true;
    }

    addColumn(column: TableColumn<Element, unknown>) {
        if (this.#addColumnToBackings(column)) {
            this.#dom.columnTitles.appendChild(
                makeElement(
                    "td",
                    {
                        innerText: column.title
                    }
                )
            );
        }
    }

    addColumns(...columns: TableColumn<Element, unknown>[]) {
        columns.map(col => {
            if (this.#addColumnToBackings(col)) {
                return makeElement(
                    "td",
                    {
                        innerText: col.title
                    }
                );
            }
        });
    }

    addToNode(parent: Node) {
        parent.appendChild(this.#dom.container);
    }
}