import { loadData } from "./data.js";
import { generateDetailsBarChart } from "./detailsBarChart.js";
import * as d3 from "./d3.min.js";

const dataContainer = loadData();

generateDetailsBarChart(dataContainer["data"]);
