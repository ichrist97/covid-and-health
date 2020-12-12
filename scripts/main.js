import { loadData } from "./data.js";
import { generateDetailsBarChart } from "./detailsBarChart.js";

const dataContainer = loadData();
const data = dataContainer.data;

generateDetailsBarChart(data);
