import { loadData } from './data.js'
import { createFactorDetails } from './factorDetails.js'
import { createScatterPlot } from './scatterPlot.js'
import { createTimeline } from './timeline.js'
import { setupFactors } from './factorSelection.js'
import { renderCountryDetails } from './countryDetails.js'
import { initHelpModal } from './help.js'

async function buildVisualization() {
	const dataContainer = await loadData()

	setupFactors(dataContainer)
	createFactorDetails(dataContainer)
	createScatterPlot(dataContainer)
	createTimeline(dataContainer)
	renderCountryDetails(dataContainer)

	// deactivate loading animation and activate button to leave introduction at first start of session
	if (sessionStorage.getItem('seenIntroduction') === null) {
		document.querySelector('.spinner-box').style.display = 'none'
		document.querySelector('#loading-text').style.display = 'none'
		document.querySelector('#exit-loading').style.display = 'block'
	} else {
		document.querySelector('#loading').style.display = 'none'
	}
}

// leave introduction on click and set flag in sessionStorage
document.querySelector('#exit-loading').addEventListener('click', () => {
	sessionStorage.setItem('seenIntroduction', true)
	document.querySelector('#loading').style.display = 'none'
})

// dont show introduction again in same session at reload
if (sessionStorage.getItem('seenIntroduction')) {
	document.querySelector('#introduction-text').style.display = 'none'
	document.querySelector('#exit-loading').style.display = 'none'
}

initHelpModal()
buildVisualization()
