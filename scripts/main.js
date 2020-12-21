import { loadData } from './data.js'
import { createFactorDetails } from './factorDetails.js'
import { createScatterPlot } from './scatterPlot.js'
import { createTimeline } from './timeline.js'
import { setupFactors } from './factorSelection.js'
import { renderCountryDetails } from './countryDetails.js'

async function buildVisualization() {
	const dataContainer = await loadData()

	setupFactors(dataContainer)
	createFactorDetails(dataContainer)
	createScatterPlot(dataContainer)
	createTimeline(dataContainer)
	renderCountryDetails(dataContainer)

	// deactivate loading screen when everything is finished rendering
	document.querySelector('#loading').style.display = 'none'
}

buildVisualization()
