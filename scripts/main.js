import { loadData } from './data.js'
import { generateDetailsBarChart } from './detailsBarChart.js'
import { createScatterPlot } from './scatterPlot.js'
import { createTimeline } from './timeline.js'
import { setupFeatures } from './featureSelection.js'

async function buildVisualization() {
  const dataContainer = await loadData()

  setupFeatures(dataContainer)
  generateDetailsBarChart(dataContainer)
  createScatterPlot(dataContainer)
  createTimeline(dataContainer)
}

buildVisualization()
