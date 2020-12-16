import { loadData } from './data.js'
import { generateDetailsBarChart } from './factorDetails.js'
import { createScatterPlot } from './scatterPlot.js'
import { createTimeline } from './timeline.js'
import { setupFactors } from './factorSelection.js'

async function buildVisualization() {
  const dataContainer = await loadData()

  setupFactors(dataContainer)
  generateDetailsBarChart(dataContainer)
  createScatterPlot(dataContainer)
  createTimeline(dataContainer)
}

buildVisualization()
