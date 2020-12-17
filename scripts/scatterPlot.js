/// <reference path='d3.js' />

import { Theme } from './theme.js'

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
	const width = parseFloat(svg.style('width')) - 2 * Theme().marginLarge
	const height = parseFloat(svg.style('height')) - 2 * Theme().marginLarge

	//And a scale axis for convenience
	const r = d3.scaleLinear().domain([0, 1]).range([Theme().minScatterPoint, Theme().maxScatterPoint])

	//Preapare the container hosting the data spheres
	const container = svg.append('g').attr('transform', 'translate(' + Theme().marginLarge + ',' + Theme().marginLarge + ')')

	//Help ourselves to some x axis
	const x = d3.scaleLog().domain([1, maxCases]).range([0, width]).clamp(true).nice()

	const xAxis = svg
		.append('g')
		.attr('transform', 'translate(' + Theme().marginLarge + ',' + (height + Theme().marginLarge + Theme().maxScatterPoint) + ')')
		.call(d3.axisBottom(x).ticks(15, '.0f'))

	xAxis.selectAll('line').style('stroke', Theme().axis)
	xAxis.selectAll('path').style('stroke', Theme().axis)
	xAxis.selectAll('text').style('fill', Theme().axis)

	//Basically the same for the y axis
	const y = d3.scaleLog().domain([1, maxDeaths]).range([height, 0]).clamp(true).nice()

	const yAxis = svg
		.append('g')
		.attr('transform', 'translate(' + (Theme().marginLarge - Theme().maxScatterPoint) + ',' + Theme().marginLarge + ')')
		.call(d3.axisLeft(y).ticks(15, '.0f'))

	yAxis.selectAll('line').style('stroke', Theme().axis)
	yAxis.selectAll('path').style('stroke', Theme().axis)
	yAxis.selectAll('text').style('fill', Theme().axis)

	//Builds the legend for the scatter plot
	function buildLegend(bounds) {
		//First remove the old legend
		svg.select('.legend').remove()

		//Let's put everythin in a group for easy placement
		const legend = svg
			.append('g')
			.attr('transform', 'translate(' + (width + 2 * Theme().marginLarge - Theme().margin) + ',' + Theme().margin + ')')
			.classed('legend', true)

		const count = Theme().scatterLegendCount
		const size = Theme().scatterLegendSize

		//Now add elements for each legend entrie
		const elems = legend
			.selectAll(null)
			.data(d3.range(count))
			.enter()
			.append('g')
			.attr('transform', d => 'translate(0,' + d * size * 3 + ')')

		elems
			.append('rect')
			.attr('x', -size / 2)
			.attr('y', -size / 2)
			.attr('width', size)
			.attr('height', size)
			.attr('fill', d => Theme().primaryBlend(d / (count - 1)))

		elems
			.append('text')
			.attr('dominant-baseline', 'middle')
			.attr('text-anchor', 'end')
			.attr('x', -size)
			.attr('dy', 1)
			.attr('fill', Theme().font)
			.style('font-size', Theme().fontSizeSmall)
			.text(d => Math.round(bounds.min + bounds.span * (d / (count - 1))))
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
			return Theme().selection
		}

		const t = 1 - (value - bounds.min) / bounds.span
		return Theme().primaryBlend(t)
	}

	//Compues the sort order for two countries
	function compareCountries(a, b) {
		if (a.country == selectedCountry.value) return 1
		if (b.country == selectedCountry.value) return -1
		return b.factor - a.factor
	}

	//Shows a tooltip for the given country
	function showTooltip(e, d) {
		container
			.append('text')
			.classed('tooltip', true)
			.text(d.name)
			.attr('x', x(d.cases))
			.attr('y', y(d.deaths))
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'central')
			.attr('fill', Theme().font)
	}

	//Removes all tooltips
	function clearTooltip() {
		container.selectAll('.tooltip').remove()
	}

	//Shows the cleaned data in the plot
	function showScatterPlot(data, bounds) {
		const update = container.selectAll('circle').data(data, x => x.country)

		update.filter(d => d.country == selectedCountry.value).style('fill', Theme().selection)

		update
			.transition(d3.easeBackInOut)
			.duration(Theme().transitionDuration)
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

		enter
			.transition()
			.duration(Theme().transitionDuration)
			.attrTween('r', d => d3.interpolate(0, r((d.factor - bounds.min) / bounds.span)))

		update.exit().transition(d3.easeBackIn).duration(Theme().transitionDuration).attr('r', 0).remove()

		update
			.merge(enter)
			.sort(compareCountries)
			.on('click', (e, d) => selectedCountry.update(d.country))
			.on('mouseenter', (e, d) => {
				showTooltip(e, d)
				d3.select(e.currentTarget).style('fill', Theme().hover)
			})
			.on('mouseleave', (e, d) => {
				clearTooltip(e, d)
				d3.select(e.currentTarget).style('fill', dotFill(d.factor, bounds, d.country))
			})
	}

	//Updates the scatter plot
	function updateScatterPlot() {
		const data = scatterPlotData()
		const bounds = factorMinMax(data)
		showScatterPlot(data, bounds)
		buildLegend(bounds)
	}

	//Subscribe the update to global events
	selectedCountry.subscribe(updateScatterPlot)
	selectedWeek.subscribe(updateScatterPlot)
	selectedFactor.subscribe(updateScatterPlot)

	updateScatterPlot()
}

export { createScatterPlot }
