/// <reference path='d3.js' />

import { theme, styleAxis } from './theme.js'
import { factorExplanation, factorUnit } from './data.js'

function createScatterPlot(dataContainer) {
	// destructure data container
	const { data, selectedFactor, selectedFilter, selectedWeek, selectedCountry } = dataContainer

	//Find the maximum infections and deaths
	const maxCases = Math.max(
		...Object.values(data).map(x => {
			return Math.max(...Object.values(x.covid).map(y => y.cases))
		})
	)

	const maxDeaths = Math.max(
		...Object.values(data).map(x => {
			return Math.max(...Object.values(x.covid).map(y => y.deaths))
		})
	)

	//Grab the svg element and store some properties for convenience
	const svg = d3.select('#scatterPlot').select('.plot')
	const width = parseFloat(svg.style('width')) - theme().marginLarge - theme().margin
	const height = parseFloat(svg.style('height')) - theme().marginLarge - theme().margin

	//And a scale axis for convenience
	const r = d3.scaleLinear().domain([0, 1]).range([theme().minScatterPoint, theme().maxScatterPoint])

	//Help ourselves to some x axis
	const x = d3.scaleLog().domain([1, maxCases]).range([0, width]).clamp(true).nice()

	const xAxis = svg
		.append('g')
		.attr(
			'transform',
			'translate(' + theme().marginLarge + ',' + (height + theme().margin + theme().maxScatterPoint) + ')'
		)
		.call(d3.axisBottom(x).ticks(12, '.0f'))

	styleAxis(xAxis)

	//Basically the same for the y axis
	const y = d3.scaleLog().domain([1, maxDeaths]).range([height, 0]).clamp(true).nice()

	const yAxis = svg
		.append('g')
		.attr('transform', 'translate(' + (theme().marginLarge - theme().maxScatterPoint) + ',' + theme().margin + ')')
		.call(d3.axisLeft(y).ticks(12, '.0f'))

	styleAxis(yAxis)

	//Preapare the container hosting the data spheres
	const container = svg.append('g').attr('transform', 'translate(' + theme().marginLarge + ',' + theme().margin + ')')

	//Builds the axis lables for the scatter plot
	function buildAxisLabels() {
		//Remove old labels
		svg.selectAll('.axisLabel').remove()

		//Build the x axis label
		const xLabel = svg
			.append('g')
			.classed('axisLabel', true)
			//.attr('transform', 'translate(' + (theme().marginLarge + width / 2) + ',' + (height + 2 * theme().marginLarge - 12) + ')')
			.attr(
				'transform',
				'translate(' +
					(theme().marginLarge + width) +
					',' +
					(height + theme().margin + theme().maxScatterPoint - 15) +
					')'
			)
			.append('text')
			.attr('fill', theme().font)
			.attr('dominant-baseline', 'hanging')
			.attr('text-anchor', 'end')
			.attr('fill', theme().axis)
			.style('font-size', theme().fontSizeAxis)
			.text('covid-19 infections per 100.000 capita')

		//Build the y axis label
		const yLabel = svg
			.append('g')
			.classed('axisLabel', true)
			.attr(
				'transform',
				'translate(' + (theme().marginLarge - theme().maxScatterPoint + 10) + ',' + theme().margin + ')'
			)
			.append('text')
			.attr('fill', theme().font)
			.attr('dominant-baseline', 'hanging')
			.attr('text-anchor', 'start')
			.attr('fill', theme().axis)
			.style('font-size', theme().fontSizeAxis)

		yLabel.append('tspan').text('covid-19 deaths')
		yLabel
			.append('tspan')
			.attr('x', 0)
			.attr('dy', theme().fontSizeAxis + 3)
			.text('per 100.000 capita')
	}

	//Builds the legend for the scatter plot
	function buildLegend(bounds) {
		//First remove the old legend
		svg.select('.legend').remove()

		//Let's put everything in a group for easy placement
		const legend = svg
			.append('g')
			.attr('transform', 'translate(' + (width + theme().marginLarge) + ',' + theme().margin + ')')
			.classed('legend', true)

		const count = theme().scatterLegendCount
		const maxSize = theme().maxScatterPoint
		const minSize = theme().minScatterPoint
		const size = d => maxSize + (minSize - maxSize) * (d / (count - 1))

		//Now add elements for each legend entry
		const elems = legend
			.selectAll(null)
			.data(d3.range(count))
			.enter()
			.append('g')
			.attr('transform', d => 'translate(' + -maxSize + ',' + (maxSize * 2 - size(d)) + ')')

		elems
			.append('circle')
			.attr('r', size)
			.attr('fill', d => theme().primaryBlend(d / (count - 1)))

		elems
			.append('text')
			.attr('dominant-baseline', 'central')
			.attr('text-anchor', 'end')
			.attr('dx', -maxSize - 15)
			.attr('dy', d => -size(d) + size(count - 1))
			.attr('fill', theme().font)
			.style('font-size', theme().fontSizeAxis)
			.text(
				d => Math.round(bounds.min + bounds.span * ((count - d - 1) / (count - 1))) + factorUnit[selectedFactor.value]
			)

		elems
			.append('line')
			.attr('x1', 0)
			.attr('y1', d => -size(d) + size(count - 1))
			.attr('x2', -maxSize - 12)
			.attr('y2', d => -size(d) + size(count - 1))
			.attr('stroke', theme().font)

		const label = legend
			.append('text')
			.attr('dominant-baseline', 'hanging')
			.attr('text-anchor', 'end')
			.attr('dy', maxSize * 2 + 15)
			.attr('fill', theme().font)
			.style('font-size', theme().fontSizeAxis)

		const labelWords = factorExplanation[selectedFactor.value].split(' ')

		label.append('tspan').text(labelWords.slice(0, Math.ceil(labelWords.length / 2)).join(' '))
		label
			.append('tspan')
			.attr('x', 0)
			.attr('dy', theme().fontSizeAxis + 3)
			.text(labelWords.slice(Math.ceil(labelWords.length / 2)).join(' '))
	}

	//Cleans the data for usage in the scatter plot
	function scatterPlotData() {
		const out = []
		const week = selectedWeek.value

		Object.keys(data).forEach(x => {
			const value = data[x]

			if (!(selectedFactor.value in value)) return
			const factor = value[selectedFactor.value]

			if (!(week in value.covid)) return
			const covid = value.covid[week]

			out.push({
				country: x,
				name: value.name,
				cases: covid.cases,
				deaths: covid.deaths,
				factor: factor.value,
			})
		})

		return out
	}

	//Finds the maximum and minimum factors in the data
	function factorMinMax(data) {
		const min = Math.min(...data.map(x => x.factor))
		const max = Math.max(...data.map(x => x.factor))
		return { min: min, max: max, span: max - min }
	}

	//Computes the fill color for a dot from it's factor value
	function dotFill(value, bounds, country = null) {
		if (country == selectedCountry.value) {
			return theme().selection
		}

		const t = 1 - (value - bounds.min) / bounds.span
		return theme().primaryBlend(t)
	}

	//Computes the sort order for two countries
	function compareCountries(a, b) {
		if (a.country == selectedCountry.value) return 1
		if (b.country == selectedCountry.value) return -1
		return b.factor - a.factor
	}

	//Shows a tooltip for the given country
	function showTooltip(e, d) {
		const text = container
			.append('text')
			.classed('tooltip', true)
			.text(d.name)
			.attr('x', x(d.cases))
			.attr('y', y(d.deaths))
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'central')
			.attr('fill', theme().font)
			.style('font-size', theme().fontSizeDefault)

		const box = text.node().getBBox()

		container
			.append('rect')
			.classed('tooltip', true)
			.attr('fill', theme().hover)
			.attr('x', box.x - 2)
			.attr('y', box.y - 2)
			.attr('width', box.width + 4)
			.attr('height', box.height + 4)

		text.raise()
	}

	//Removes all tooltips
	function clearTooltip() {
		container.selectAll('.tooltip').remove()
	}

	//Shows the cleaned data in the plot
	function showScatterPlot(data, bounds) {
		const update = container.selectAll('circle').data(data, x => x.country)

		update.filter(d => d.country == selectedCountry.value).style('fill', theme().selection)

		update
			.transition(d3.easeBackInOut)
			.duration(theme().transitionDuration)
			.attr('r', d => r((d.factor - bounds.min) / bounds.span))
			.attr('cx', d => x(d.cases))
			.attr('cy', d => y(d.deaths))
			.style('fill', d => dotFill(d.factor, bounds, d.country))

		const enter = update
			.enter()
			.append('circle')
			.attr('cx', d => x(d.cases))
			.attr('cy', d => y(d.deaths))
			.style('fill', d => dotFill(d.factor, bounds, d.country))
			.style('stroke', theme().primaryOutline)
			.style('stroke-width', '1')

		enter
			.transition()
			.duration(theme().transitionDuration)
			.attrTween('r', d => d3.interpolate(0, r((d.factor - bounds.min) / bounds.span)))

		update.exit().transition(d3.easeBackIn).duration(theme().transitionDuration).attr('r', 0).remove()

		//Sort elements and apply event callbacks
		const set = update.merge(enter)

		set
			.sort(compareCountries)
			.on('click', (e, d) => selectedCountry.update(d.country))
			.on('mouseenter', (e, d) => {
				d3.select(e.currentTarget).style('fill', theme().hover).raise()
				showTooltip(e, d)
			})
			.on('mouseleave', (e, d) => {
				clearTooltip(e, d)
				d3.select(e.currentTarget).style('fill', dotFill(d.factor, bounds, d.country))
				set.sort(compareCountries)
			})

		//Update tooltip coloring
		//Only applied when selecting a country on the scatter plot
		container.selectAll('.tooltip').select('rect').attr('fill', 'blue')
	}

	//Updates the scatter plot
	function updateScatterPlot() {
		const data = scatterPlotData()
		const bounds = factorMinMax(data)

		showScatterPlot(data, bounds)
		buildLegend(bounds)
		buildAxisLabels()
	}

	//Subscribe the update to global events
	selectedCountry.subscribe(updateScatterPlot)
	selectedWeek.subscribe(updateScatterPlot)
	selectedFactor.subscribe(updateScatterPlot)

	updateScatterPlot()
}

export { createScatterPlot }
