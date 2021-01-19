/// <reference path='d3.js' />

import { theme } from './theme.js'
import { factorExplanation } from './data.js'

let svg
let sortOrder = 'ascending' // default
let currentData // current data subset filtered by selected factor

// set the dimensions and margins of the graph
const container = document.querySelector('#factor-details')
const offsetWidth = container.offsetWidth
const offsetHeight = container.offsetHeight
const margin = { top: 20, right: 20, bottom: 40, left: 20 },
	width = offsetWidth - margin.left - margin.right,
	height = offsetHeight - margin.top - margin.bottom

function filterBarDataForCategory(data, category) {
	const filterData = []
	for (let countryKey in data) {
		const countryData = data[countryKey]
		// filter for countries containing the category
		if (countryData.hasOwnProperty(category)) {
			const countryFullName = countryData['name']
			const categoryData = countryData[category]['value']
			filterData.push({
				id: countryKey,
				country: countryFullName,
				value: categoryData,
			})
		}
	}

	// sort
	const sortedData = filterData.sort((a, b) => {
		if (sortOrder === 'ascending') {
			return parseFloat(a.value) - parseFloat(b.value)
		} else if (sortOrder === 'descending') {
			return parseFloat(b.value) - parseFloat(a.value)
		}
	})
	return sortedData
}

function renderGraph(data, selectedCountry, selectedFactor, bounds) {
	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	svg = d3
		.select('#factor-details')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)

	svg = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	renderBars(data, selectedCountry, selectedFactor, bounds)
}

function renderBars(data, selectedCountry, selectedFactor, bounds) {
	// set the ranges
	let yScale = d3.scaleBand().range([height, 0]).padding(0.1)
	let xScale = d3.scaleLinear().range([0, width])

	// format the data to positive values
	data.forEach(d => {
		d.value = +d.value
	})

	// Scale the range of the data in the domains
	xScale.domain([
		0,
		d3.max(data, d => {
			return d.value
		}),
	])
	yScale.domain(
		data.map(d => {
			return d.country
		})
	)

	// WORKAROUND for bug of staying bars at update of data
	svg.selectAll('.bar-group').remove()

	// indices for data
	let index = 0

	// Create bar groups
	const bars = svg
		.selectAll('.bar-group')
		.data(data, d => {
			d.index = index
			index++
			return d
		})
		.join('g')
		.attr('class', 'bar-group')

	// append rect to group
	bars
		.append('rect')
		.attr('class', 'bar')
		.attr('x', function (d) {
			return 0
		})
		.attr('y', function (d) {
			return yScale(d.country)
		})
		// no bars before animation
		.attr('width', function (d) {
			return xScale(0)
		})
		.attr('height', d => {
			return yScale.bandwidth()
		})
		// set country on bar for selecting
		.attr('data-country', d => d.id)
		// highlight selected country
		.attr('fill', d => {
			return calcFillColor(d.value, bounds)
		})
		// user hovers over bar
		.on('mouseenter', event => {
			d3.select(event.target)
				.attr('fill', d => {
					// only change when bar is not selected
					const country = event.target.getAttribute('data-country')
					return country !== selectedCountry.value ? theme().hover : theme().selection
				})
				.style('cursor', 'pointer')
		})
		// user leaves bar
		.on('mouseleave', event => {
			d3.select(event.target)
				.attr('fill', d => {
					// only change when bar is not selected
					const country = event.target.getAttribute('data-country')
					return country !== selectedCountry.value ? calcFillColor(d.value, bounds) : theme().selection
				})
				.style('cursor', 'default')
		})
		// user clicks bar
		.on('click', event => {
			// deselect all bars
			d3.selectAll('.bar').attr('fill', d => calcFillColor(d.value, bounds))
			// set clicked bar as selected
			d3.select(event.target).attr('fill', theme().selection)
			// update observable
			const country = event.target.getAttribute('data-country')
			selectedCountry.update(country)
		})

	// bar animations
	const t = bars.transition().duration(theme().transitionDuration).ease(d3.easePolyOut)
	bars
		.selectAll('.bar')
		.transition(t)
		.attr('width', d => xScale(d.value))

	// append labels to group
	bars
		.append('text')
		.text(d => {
			return d.country
		})
		.attr('class', 'bar-label')
		// start at 0 for transition
		.attr('x', 0)
		.attr('y', d => {
			return yScale(d.country) + yScale.bandwidth() * 0.5
		})
		.attr('font-family', 'sans-serif')
		.attr('font-size', '60%')
		.attr('fill', d => {
			const readable = determineTextReadability(d.value, bounds)
			return readable ? 'white' : 'black'
		})
		.attr('stroke-width', '1px')
		.attr('stroke-opacity', 0.2)
		.attr('text-anchor', d => {
			const readable = determineTextReadability(d.value, bounds)
			return readable ? 'end' : 'start'
		})
		.attr('dominant-baseline', 'central')

	// label transition with bars
	bars
		.selectAll('.bar-label')
		.transition(t)
		.attr('x', d => {
			const readable = determineTextReadability(d.value, bounds)
			const margin = 4
			return readable ? xScale(d.value) - margin : xScale(d.value) + margin
		})

	// add the xAxis
	svg.selectAll('.xAxis').remove() // remove old axis
	svg.append('g').attr('class', 'xAxis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale))

	// xAxis label
	const label = factorExplanation[selectedFactor.value]
	// remove old label
	svg.selectAll('[is-label]').remove()
	// new label
	svg
		.append('text')
		.attr('is-label', true)
		.attr('transform', 'translate(' + width / 2 + ' ,' + (height + margin.top + 10) + ')')
		.style('text-anchor', 'middle')
		.style('font-size', '12px')
		.style('fill', 'black')
		.text(label)
}

/**
 * Calculate fill color on color scale dependent on min and max values of all data
 * @param {*} value
 * @param {*} bounds
 */
function calcFillColor(value, bounds) {
	const t = 1 - (value - bounds.min) / bounds.span
	return theme().primaryBlend(t)
}

/**
 * Determines whether the current bar label is readible with the calculated background color from
 * calcFillColor function. Readable text (dark background color) can stay inside of the bar but not
 * readble texts (light background color) should be display outside of the bar.
 * The current threshold is just a heuristic
 * @param {*} value
 * @param {*} bounds
 */
function determineTextReadability(value, bounds) {
	const t = 1 - (value - bounds.min) / bounds.span

	/**
	 * the smaller t is, the higher is the value and darker the color filling of its bar. Current
	 * threshold is only of heuristical nature
	 */
	if (t > 0.3) {
		return false
	}
	return true
}

/**
 * Get min, max value and span between for the data of a single factor
 * @param {*} data
 */
function getBoundsOfFactor(data) {
	const min = Math.min(...data.map(x => x.value))
	const max = Math.max(...data.map(x => x.value))
	return { min: min, max: max, span: max - min }
}

function updateGraph(dataContainer) {
	const { data, selectedFactor, selectedCountry } = dataContainer
	const factor = selectedFactor.value
	currentData = filterBarDataForCategory(data, factor)
	const bounds = getBoundsOfFactor(currentData)
	renderBars(currentData, selectedCountry, selectedFactor, bounds)
}

function updateCountry(countryId) {
	// deselect all bars
	const bounds = getBoundsOfFactor(currentData)
	d3.selectAll('.bar').attr('fill', d => calcFillColor(d.value, bounds))
	// set clicked bar as selected
	d3.select(`[data-country=${countryId}]`).attr('fill', theme().selection)
}

function createFactorDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry } = dataContainer
	const factor = selectedFactor.value
	currentData = filterBarDataForCategory(data, factor)
	const bounds = getBoundsOfFactor(currentData)
	renderGraph(currentData, selectedCountry, selectedFactor, bounds)

	//subscribe to  observables
	selectedFactor.subscribe(() => updateGraph(dataContainer))
	selectedCountry.subscribe(() => updateCountry(selectedCountry.value))
}

export { createFactorDetails }
