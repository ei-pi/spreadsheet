import { TableView } from "./components/TableView/TableView.js";
import { configureTableView } from "./models/v0.14.0/exporter.js";
import { type GunDefinition } from "./models/v0.14.0/guns.js";

const tableView = new TableView<GunDefinition>();

configureTableView(tableView);

tableView.addToNode(document.body);