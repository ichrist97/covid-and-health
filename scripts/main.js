import { loadData } from './data.js'
import { generateDetailsBarChart } from './detailsBarChart.js'
import { createScatterPlot } from './scatterPlot.js'
import { createTimeline } from './timeline.js'
import { setupFactors } from './featureSelection.js'

async function buildVisualization() {
  const dataContainer = await loadData()

  setupFactors(dataContainer)
  generateDetailsBarChart(dataContainer)
  createScatterPlot(dataContainer)
  createTimeline(dataContainer)
}

buildVisualization()
