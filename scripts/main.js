import { loadData } from "./data.js";
import { generateDetailsBarChart } from "./detailsBarChart.js";
import { createScatterPlot } from "./scatterPlot.js";
import { createTimeline } from "./timeline.js";

const dataContainer = loadData();
const data = dataContainer.data;

generateDetailsBarChart(data);
createScatterPlot(dataContainer);
createTimeline(dataContainer);
