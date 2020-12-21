import { formatFactor } from './data.js'

function renderCountryDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry, selectedWeek } = dataContainer
	setFactor(selectedFactor.value)
	setDeaths(data, selectedCountry.value, selectedWeek.value)
	setCountryTitle(data, selectedCountry.value)
	setInfections(data, selectedCountry.value, selectedWeek.value)

	//subscribe to  observables
	selectedFactor.subscribe(() => setFactor(selectedFactor.value))
	selectedCountry.subscribe(() => updateCovidData(data, selectedCountry.value, selectedWeek.value))
	selectedWeek.subscribe(() => updateCovidData(data, selectedCountry.value, selectedWeek.value))
}

function updateCovidData(data, selectedCountry, selectedWeek) {
	setInfections(data, selectedCountry, selectedWeek)
	setDeaths(data, selectedCountry, selectedWeek)
	setCountryTitle(data, selectedCountry)
}

function setCountryTitle(data, selectedCountry) {
	const element = document.querySelector('#selected-country-title')
	const countryName = data[selectedCountry].name
	element.innerText = countryName
}

function setInfections(data, selectedCountry, selectedWeek) {
	let infections = 0
	const weeks = Object.values(data[selectedCountry].covid)
	const scaler = data[selectedCountry].population / 100000

	// sum up infections until selectedWeek
	for (let i = 0; i <= selectedWeek; i++) {
		// calculate back from population scaler
		let casesWeek = weeks[i].cases * scaler
		infections += casesWeek
	}

	const element = document.querySelector('#cumulated-cases')
	const text = formatNumber(infections)
	element.innerText = text
}

function setDeaths(data, selectedCountry, selectedWeek) {
	let deaths = 0
	const weeks = Object.values(data[selectedCountry].covid)
	const scaler = data[selectedCountry].population / 100000

	// sum up infections until selectedWeek
	for (let i = 0; i <= selectedWeek; i++) {
		// calculate back from population scaler
		let deathsWeek = weeks[i].deaths * scaler
		deaths += deathsWeek
	}

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
