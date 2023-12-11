import { TableColumn } from "./components/TableView/TableColumn.js";
import { TableView } from "./components/TableView/TableView.js";

const tableView = new TableView<{ x: number, y: number }>("bleh");
tableView.addColumn(new TableColumn("x", e => `${e.x}`));
tableView.addColumn(new TableColumn("y", e => `${e.y}`));
tableView.addAll(
    { x: 0, y: 2 },
    { x: 4, y: 1 }
);
tableView.addToNode(document.body);