import { TableView } from "./components/TableView/TableView.js";
import { columns } from "./models/v0.14.0/exporter.js";
import { Guns, type GunDefinition } from "./models/v0.14.0/guns.js";

const tableView = new TableView<GunDefinition>();

tableView.addAll(...Guns);
tableView.setColumns(...columns);
tableView.addToNode(document.body);