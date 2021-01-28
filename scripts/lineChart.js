/// <reference path='d3.js' />

import { theme, styleAxis } from './theme.js'

let svg
let container

// set the dimensions and margins of the graph
const graph = document.querySelector('#lineChart')
const offsetWidth = graph.offsetWidth
const offsetHeight = graph.offsetHeight
const margin = { top: 10, right: 30, bottom: 30, left: 30 },
	width = offsetWidth - margin.left - margin.right,
	height = offsetHeight - margin.top - margin.bottom

/**
 * Currently display covid data type in line chart
 * Either 'cases' or 'deaths'
 * Default: cases
 */
let covidDataType = 'cases'

function createLineChart(dataContainer) {
	//destructure data container
	const { data, selectedFactor, selectedCountry, selectedWeek } = dataContainer

	svg = d3
		.select('#lineChart')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)

	container = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

	// setup event listener to toogle covidDataType change
	function setupDataToogle() {
		Array.from(document.querySelectorAll('.covid-data-toogle')).forEach(item => {
			item.addEventListener('click', event => {
				// deselect all
				Array.from(document.querySelectorAll('.covid-data-toogle')).forEach(item => {
					item.classList.remove('checked')
				})

				// change covid data type
				covidDataType = event.target.dataset.covid
				event.target.classList.add('checked')

				// trigger chart rerender
				updateGraph(dataContainer)
			})
		})
	}

	// updating graph at observable change
	function updateGraph(dataContainer) {
		const { data, selectedFactor, selectedCountry, selectedWeek } = dataContainer
		const filteredData = filterData(data, selectedFactor.value)
		plotLineChart(data, filteredData, selectedCountry, selectedFactor, selectedWeek)
	}

	// subscribe to observable
	selectedWeek.subscribe(() => updateGraph(dataContainer))
	selectedCountry.subscribe(() => updateGraph(dataContainer))
	selectedFactor.subscribe(() => updateGraph(dataContainer))

	// plot line chart
	setupDataToogle()
	const filteredData = filterData(data, selectedFactor.value)
	plotLineChart(data, filteredData, selectedCountry, selectedFactor, selectedWeek)
}

//find the max number of infections from all countries with a factor and according to covid data type
function findFactorMaxInfection(data, factor) {
	const maxPerCountryInfections = []

	for (const country of Object.values(data)) {
		if (country[factor]) {
			const casesPerCountry = []
			for (const week of Object.values(country.covid)) {
				let weekData
				if (covidDataType === 'cases') {
					weekData = week.cases
				} else if (covidDataType === 'deaths') {
					weekData = week.deaths
				} else {
					weekData = 0 // fallback
				}

				casesPerCountry.push(weekData)
			}
			maxPerCountryInfections.push(Math.max(...casesPerCountry))
		}
	}
	return Math.max(...maxPerCountryInfections)
}

//filter data according to selected factor and covid type
function filterData(data, selectedFactor) {
	const allCountriesData = []

	for (let countryKey in data) {
		const countryData = data[countryKey]
		const countryLineData = []

		// only use current country if it has data for the selected factor
		if (!countryData[selectedFactor]) {
			continue
		}

		for (let week = 1; week <= 53; week++) {
			if (week in countryData.covid) {
				countryLineData.push({
					cases: countryData.covid[week].cases,
					deaths: countryData.covid[week].deaths,
					week: week,
				})
			}
		}

		allCountriesData.push({
			country: countryKey,
			name: countryData.name,
			data: countryLineData,
		})
	}

	return allCountriesData
}

function plotLineChart(completeData, data, selectedCountry, selectedFactor, selectedWeek) {
	//find the start week of the data
	const firstWeek = Math.min(
		...Object.values(completeData).map(x => {
			return Math.min(...Object.keys(x.covid))
		})
	)

	const finalWeek = 53

	const weekDiff = finalWeek - firstWeek

	const maxInfections = findFactorMaxInfection(completeData, selectedFactor.value)

	//set up the x axis
	const xValue = d3.scaleLinear().domain([firstWeek, finalWeek]).range([0, width])

	svg.selectAll('.xAxis').remove()
	let xA = svg
		.append('g')
		.attr('class', 'xAxis')
		.attr('transform', `translate(${margin.left},${height + margin.top})`)
		.call(
			d3
				.axisBottom(xValue)
				.tickValues(d3.range(weekDiff / 2 + 1).map(x => firstWeek + x * 2))
				.tickFormat(function (d) {
					return ''
				})
		)
	styleAxis(xA)

	// xAxis label
	// remove old label
	svg.selectAll('[is-label]').remove()
	// new label
	svg
		.append('text')
		.attr('is-label', true)
		.attr('transform', `translate(${width + margin.right},${height + margin.bottom})`)
		.style('text-anchor', 'end')
		.style('font-size', theme().fontSizeAxis)
		.style('fill', theme().axis)
		.text('weeks of 2020')

	//set up the y axis
	const yValue = d3.scaleLinear().domain([0, maxInfections]).range([height, 0])

	svg.selectAll('.yAxis').remove() //remove old yAxis
	let yA = svg
		.append('g')
		.attr('class', 'yAxis')
		.attr('transform', `translate(${margin.left},${margin.top})`)
		.call(d3.axisLeft(yValue).ticks(6))

	styleAxis(yA)

	//Build the y axis label
	svg.selectAll('.y-axis-label').remove() //remove old yAxis
	const yLabel = svg
		.append('g')
		.classed('axisLabel', true)
		.attr('transform', `translate(${theme().margin + 10},${margin.top})`)
		.append('text')
		.attr('fill', theme().font)
		.attr('dominant-baseline', 'hanging')
		.attr('text-anchor', 'start')
		.attr('fill', theme().axis)
		.attr('class', 'y-axis-label')
		.style('font-size', theme().fontSizeAxis)

	yLabel.append('tspan').text(() => {
		if (covidDataType === 'cases') {
			return 'covid-19 infections'
		} else if (covidDataType === 'deaths') {
			return 'covid-19 deaths'
		}
		return '' // fallback
	})
	yLabel
		.append('tspan')
		.attr('x', 0)
		.attr('dy', theme().fontSizeAxis + 3)
		.text('per 100.000 capita')

	//lines
	const line = d3
		.line()
		.x(function (d) {
			return xValue(d.week)
		})
		.y(function (d) {
			if (covidDataType === 'cases') {
				return yValue(d.cases)
			} else if (covidDataType === 'deaths') {
				return yValue(d.deaths)
			}
			return 0 // fallback
		})

	//drawing
	container.selectAll('.line-group').remove() // remove old line

	const lines = container
		.selectAll('lines')
		.data(data, d => d)
		.join('g')
		.attr('class', 'line-group')
		.attr('data-selected', function (d) {
			return d.country === selectedCountry.value
		})

	lines
		.append('path')
		.attr('class', 'line')
		.attr('y', d => {
			if (covidDataType === 'cases') {
				return yValue(d.cases)
			} else if (covidDataType === 'deaths') {
				return yValue(d.deaths)
			}
			return 0 // fallback
		})
		.attr('stroke', d => {
			if (d.country === selectedCountry.value) {
				return theme().selection
			} else {
				return theme().primaryA
			}
		})
		.style('opacity', d => {
			return d.country === selectedCountry.value ? 1 : 0.4
		})
		// set country on bar for selecting
		.attr('data-country', d => d.country)
		.attr('fill', 'none')
		.attr('stroke-width', d => {
			return d.country === selectedCountry.value ? 4 : 1
		})
		.attr('d', d => {
			return line(d.data)
		})
		// user hovers over line
		.on('mouseenter', event => {
			d3.select(event.target)
				// pointer cursor
				.style('cursor', 'pointer')
				// stoke to hover color
				.attr('stroke', () => {
					// only change when line color is not selected
					const selected = event.target.parentNode.getAttribute('data-selected')
					return selected == 'true' ? theme().selection : theme().hover
				})
				// make stroke width bigger
				.attr('stroke-width', 4)
				// set opacity high
				.style('opacity', 1)
		})
		// user leaves line
		.on('mouseleave', event => {
			d3.select(event.target)
				// default cursor
				.style('cursor', 'default')
				// set back stroke color to default
				.attr('stroke', () => {
					// only change when line color is not selected
					const selected = event.target.parentNode.getAttribute('data-selected')
					return selected == 'true' ? theme().selection : theme().primaryA
				})
				// set back stroke width to default
				.attr('stroke-width', () => {
					const selected = event.target.parentNode.getAttribute('data-selected')
					return selected == 'true' ? 4 : 1
				})
				// set opacity to default after mouse leave
				.style('opacity', d => {
					return d.country === selectedCountry.value ? 1 : 0.4
				})

			d3.select('[data-selected=true]').raise()
		})
		.on('click', event => {
			// update observable
			const country = event.target.getAttribute('data-country')
			selectedCountry.update(country)
		})

	// raise selected line in svg render order
	d3.select('[data-selected=true]').raise()

	const weekDataSelectedCountry = data.filter(item => item.country === selectedCountry.value)
	// only render dot if factor is available for selectedCountry
	if (weekDataSelectedCountry[0]) {
		// draw dot at selected week
		lines
			.append('circle')
			.attr('class', 'dot')
			.attr('fill', theme().selection)
			.attr('stroke', 'none')
			.attr('cx', () => {
				return xValue(selectedWeek.value)
			})
			.attr('cy', function (d) {
				const selectedWeekData = weekDataSelectedCountry[0].data.filter(item => item.week === selectedWeek.value)
				// return zero if values for weeks are not existing
				return selectedWeekData[0] ? yValue(selectedWeekData[0][covidDataType]) : yValue(0)
			})
			.attr('r', 6)
	}

	// draw rect connecting dot and axis
	container.selectAll('.connector').remove()
	container
		.append('rect')
		.attr('class', 'connector')
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		//.attr('stroke-linecap', 'round')
		.attr('stroke-dasharray', '1,2')
		.attr('x', () => {
			return xValue(selectedWeek.value)
		})
		.attr('y', 0)
		.attr('width', 1)
		.attr('height', height)

	// raise dot in svg rendering order
	d3.select('.dot').raise()
}

export { createLineChart }
