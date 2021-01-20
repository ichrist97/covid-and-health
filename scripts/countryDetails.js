import { getFactorUnit } from './data.js'

function renderCountryDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry, selectedWeek } = dataContainer

	setFactorValue(data, selectedCountry.value, selectedFactor.value)
	setPopulation(data, selectedCountry.value)
	setDeaths(data, selectedCountry.value, selectedWeek.value)
	setCountryTitle(data, selectedCountry.value)
	setInfections(data, selectedCountry.value, selectedWeek.value)

	//subscribe to  observables
	selectedFactor.subscribe(() => setFactorValue(data, selectedCountry.value, selectedFactor.value))
	selectedCountry.subscribe(() => {
		setPopulation(data, selectedCountry.value)
		setInfections(data, selectedCountry.value, selectedWeek.value)
		setDeaths(data, selectedCountry.value, selectedWeek.value)
		setCountryTitle(data, selectedCountry.value)
		setFactorValue(data, selectedCountry.value, selectedFactor.value)
	})
	selectedWeek.subscribe(() => {
		setPopulation(data, selectedCountry.value)
		setInfections(data, selectedCountry.value, selectedWeek.value)
		setDeaths(data, selectedCountry.value, selectedWeek.value)
	})
}

function setPopulation(data, selectedCountry) {
	const element = document.querySelector('#population')
	const population = data[selectedCountry].population
	element.innerText = formatNumber(population)
}

function setCountryTitle(data, selectedCountry) {
	const element = document.querySelector('#selected-country-title')
	const countryName = data[selectedCountry].name
	element.innerText = countryName
}

function setInfections(data, selectedCountry, selectedWeek) {
	const element = document.querySelector('#cumulated-cases')
	const category = 'cases'
	const sum = sumCovidData(data, category, selectedCountry, selectedWeek)
	const text = formatNumber(sum)
	element.innerText = text
}

function setDeaths(data, selectedCountry, selectedWeek) {
	const element = document.querySelector('#cumulated-deaths')
	const category = 'deaths'
	const sum = sumCovidData(data, category, selectedCountry, selectedWeek)
	const text = formatNumber(sum)
	element.innerText = text
}

function sumCovidData(data, category, selectedCountry, selectedWeek) {
	let sum = 0
	const weeks = Object.values(data[selectedCountry].covid)
	const scaler = data[selectedCountry].population / 100000

	/**
	 * sum up infections until selectedWeek or until available point if not enough data
	 * is available until selectedWeek
	 */
	const limit = Math.min(...[weeks.length, selectedWeek])
	for (let i = 0; i < limit; i++) {
		// calculate back from population scaler
		let week = Math.round(weeks[i][category] * scaler)
		sum += week
	}
	return sum
}

function setFactorValue(data, selectedCountry, selectedFactor) {
	const element = document.querySelector('#selected-health-factor')
	const factorData = data[selectedCountry][selectedFactor]
	if (factorData) {
		const unit = getFactorUnit(selectedFactor)
		element.innerText = `${factorData.value} ${unit}`
	} else {
		element.innerText = 'Not available'
	}
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
