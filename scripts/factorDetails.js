import { theme } from './theme.js'
import { factorExplanation } from './data.js'

let svg
let barsContainer
let sortOrder = 'ascending' // default

// set the dimensions and margins of the graph
const container = document.querySelector('#factor-details')
const offsetWidth = container.offsetWidth
const offsetHeight = container.offsetHeight
const margin = { top: 40, right: 40, bottom: 60, left: 100 },
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

	barsContainer = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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

	// append the rectangles for the bar chart
	barsContainer
		.selectAll('rect')
		.data(data)
		.join('rect')
		// no bars before animation
		.attr('width', d => {
			return xScale(0)
		})
		.attr('y', d => {
			return yScale(d.country)
		})
		.attr('height', yScale.bandwidth())
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
			d3.selectAll('rect').attr('fill', d => calcFillColor(d.value, bounds))
			// set clicked bar as selected
			d3.select(event.target).attr('fill', theme().selection)
			// update observable
			const country = event.target.getAttribute('data-country')
			selectedCountry.update(country)
		})

	// add the xAxis
	barsContainer.selectAll('g').remove()
	const xAxisGenerator = d3.axisBottom(xScale).ticks(3)
	barsContainer.append('g').attr('transform', `translate(0,${height})`).call(xAxisGenerator)

	// xAxis label
	const label = factorExplanation[selectedFactor.value]
	// remove old label
	svg.selectAll('[is-label]').remove()
	// new label
	svg
		.append('text')
		.attr('is-label', true)
		.attr('transform', `translate(${width * 1.6},${height + margin.top + 40})`)
		.style('text-anchor', 'middle')
		.style('fill', 'white')
		.style('font-size', theme().fontSizeAxis)
		.text(label)

	// add the yAxis
	barsContainer.append('g').call(d3.axisLeft(yScale))

	// animation
	const t = barsContainer.transition().duration(theme().transitionDuration).ease(d3.easePolyOut)
	barsContainer
		.selectAll('rect')
		.transition(t)
		.attr('width', d => xScale(d.value))
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
	const filteredData = filterBarDataForCategory(data, factor)
	const bounds = getBoundsOfFactor(filteredData)
	renderBars(filteredData, selectedCountry, selectedFactor, bounds)
}

function updateCountry(countryId, bounds) {
	// deselect all bars
	d3.selectAll('rect').attr('fill', d => calcFillColor(d.value, bounds))
	// set clicked bar as selected
	d3.select(`[data-country=${countryId}]`).attr('fill', theme().selection)
}

function createFactorDetails(dataContainer) {
	const { data, selectedFactor, selectedCountry } = dataContainer
	const factor = selectedFactor.value
	const filteredData = filterBarDataForCategory(data, factor)
	const bounds = getBoundsOfFactor(filteredData)
	renderGraph(filteredData, selectedCountry, selectedFactor, bounds)

	//subscribe to  observables
	selectedFactor.subscribe(() => updateGraph(dataContainer))
	selectedCountry.subscribe(() => updateCountry(selectedCountry.value, bounds))
}

export { createFactorDetails }
