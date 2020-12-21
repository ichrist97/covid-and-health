import { formatFactor } from './data.js'

function renderCountryDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry } = dataContainer
	setFactor(selectedFactor.value)
	setDeaths(data, selectedCountry.value)
	setCountryTitle(data, selectedCountry.value)
	setInfections(data, selectedCountry.value)

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
	let infections = 0
	const weeks = Object.values(data[selectedCountry].covid)
	const scaler = data[selectedCountry].population / 100000
	weeks.forEach(week => {
		// calculate back from population scaler
		let casesWeek = week.cases * scaler
		infections += casesWeek
	})

	const element = document.querySelector('#cumulated-cases')
	const text = formatNumber(infections)
	element.innerText = text
}

function setDeaths(data, selectedCountry) {
	let deaths = 0
	const weeks = Object.values(data[selectedCountry].covid)
	const scaler = data[selectedCountry].population / 100000
	weeks.forEach(week => {
		// calculate back from population scaler
		let deathsWeek = week.deaths * scaler
		deaths += deathsWeek
	})
	const element = document.querySelector('#cumulated-deaths')
	const text = formatNumber(deaths)
	element.innerText = text
}

function setFactor(value) {
	const formattedValue = formatFactor(value)
	const element = document.querySelector('#selected-health-factor')
	element.innerText = formattedValue
}

function formatNumber(number) {
	const str = number.toString()
	const reverseChars = [...str].reverse()
	let text = ''
	for (let i = 0; i < reverseChars.length; i++) {
		if (i % 3 === 0 && i !== 0 && i !== reverseChars.length) {
			text = '.' + text
		}
		text = reverseChars[i] + text
	}
	return text
}

export { renderCountryDetails }
