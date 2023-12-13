import { Maybe, type Mutable, makeElement } from "../../util.js";
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

    readonly #columnSet: Set<TableColumn<Element>> = new Set();
    readonly #columnsArray: TableColumn<Element>[] = [];

    readonly #objectRowMap: Map<Element, HTMLTableRowElement> = new Map;
    readonly #columnHeaderCellMap: Map<TableColumn<Element>, HTMLTableCellElement> = new Map();

    #tableCellGenerator = this.#generateTableCell;
    get tableCellGenerator() { return this.#tableCellGenerator; }
    set tableCellGenerator(value) {
        this.#tableCellGenerator = value;

        this.#objectRowMap.forEach((row, item) => {
            row.replaceChildren(...this.#columnsArray.map(col => value(col, item)));
        });
    }

    constructor() {
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

        this.addColumn(
            new TableColumn("", obj => obj)
        );
    }

    #generateTableCell(column: TableColumn<Element>, item: Element) {
        const value = column.converter(item),
            props: Mutable<NonNullable<Parameters<typeof makeElement<"td">>[1]>> = {
                innerText: String(value)
            };

        if (value instanceof Maybe && !value.hasValue) {
            props.className = "no-value-wrapper";
            props.title = "No value was specified for this attribute";
        }

        return makeElement(
            "td",
            props
        );
    }

    #createHydratedRow(item: Element) {
        const row = makeElement(
            "tr",
            {},
            this.#columnsArray.map(col => this.tableCellGenerator(col, item))
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
            }).filter(
                ((e: any) => e) as unknown as (e?: HTMLTableRowElement) => e is HTMLTableRowElement
            )
        );
    }

    #addColumnToBackings(column: TableColumn<Element>) {
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

    removeAllColumns() {
        this.#columnSet.clear();
        this.#columnsArray.length = 0;

        this.#columnHeaderCellMap.clear();
        this.#dom.columnTitles.remove();
        this.#dom.header.remove();

        this.#dom.columnTitles.childNodes.forEach(node => node.remove());
        this.#objectRowMap.forEach(row => row.childNodes.forEach(node => node.remove()));
    }

    addColumn(column: TableColumn<Element>) {
        if (this.#addColumnToBackings(column)) {
            const headerCell = makeElement(
                "td",
                {
                    innerText: column.title,
                    title: column.description
                }
            );
            this.#columnHeaderCellMap.set(column, headerCell);
            this.#dom.columnTitles.appendChild(headerCell);

            this.#objectRowMap.forEach((row, obj) => {
                row.appendChild(this.tableCellGenerator(column, obj));
            });
        }
    }

    setColumns(...columns: TableColumn<Element>[]) {
        this.removeAllColumns();
        this.addColumns(...columns);
    }

    addColumns(...columns: TableColumn<Element>[]) {
        const mapping = columns.map(col => {
            if (this.#addColumnToBackings(col)) {
                this.#objectRowMap.forEach((row, obj) => {
                    row.appendChild(this.tableCellGenerator(col, obj));
                });

                return [
                    col,
                    makeElement(
                        "td",
                        {
                            innerText: col.title,
                            title: col.description
                        }
                    )
                ] as const;
            }
        }).filter(
            ((e: any) => e) as unknown as (e?: readonly [TableColumn<Element>, HTMLTableCellElement]) => e is readonly [TableColumn<Element>, HTMLTableCellElement]
        );

        this.#dom.columnTitles.append(...mapping.map(([, header]) => header));
        for (const [col, header] of mapping) {
            this.#columnHeaderCellMap.set(col, header);
        }
    }

    addToNode(parent: Node) {
        parent.appendChild(this.#dom.container);
    }
}