/**
 * A class representing a column in a table
 */
export class TableColumn<Element, Data> {
    title: string;

    converter: (obj: Element) => Data;

    constructor(title: string, converter: (obj: Element) => Data) {
        this.title = title;
        this.converter = converter;
    }
}