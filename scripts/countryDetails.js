import { formatFactor } from './data.js'

function renderCountryDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry } = dataContainer
	setFactor(selectedFactor.value)
	setDeaths(data)

	//subscribe to  observables
	selectedFactor.subscribe(() => setFactor(selectedFactor.value))
	selectedCountry.subscribe(() => {
		setInfections(data, selectedCountry.value)
		setDeaths(data, selectedCountry.value)
		setCountryTitle(data, selectedCountry.value)
	})
}
function setCountryTitle(data, selectedCountry) {
	const element = document.querySelector('#selected-country-title')
	const countryName = data[selectedCountry].name
	element.innerText = countryName
}

function setInfections(data, selectedCountry) {
	const infections = 0
	const weeks = Object.values(data[selectedCountry].covid)
	console.log(weeks)
	weeks.forEach(week => {
		// calculate back from population scaler and from per 100.000 capita to absolute value
		let cases = week.cases * 100000
		console.log(cases)
	})

	const element = document.querySelector('#cumulated-cases')
	element.innerText = infections
}

function setDeaths(data) {
	let deaths = 0
	const element = document.querySelector('#cumulated-deaths')
	element.innerText = deaths
}

function setFactor(value) {
	const formattedValue = formatFactor(value)
	const element = document.querySelector('#selected-health-factor')
	element.innerText = formattedValue
}

export { renderCountryDetails }
