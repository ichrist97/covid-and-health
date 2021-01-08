/// <reference path='d3.js' />

import { theme, styleAxis } from './theme.js'

function createTimeline(dataContainer) {
	// destructure data container
	const { data, selectedWeek } = dataContainer

	//Find the start and end week of the data
	const startWeek = Math.min(
		...Object.values(data).map(x => {
			return Math.min(...Object.keys(x.covid))
		})
	)

	//Instead of the actual end week, let's just display all weeks of 2020
	const endWeek = 53

	/*
  const endWeek = Math.max(
    ...Object.values(data).map(x => {
      return Math.max(...Object.keys(x.covid))
    })
  )
  */

	const weekDelta = endWeek - startWeek

	//Grab the svg element and store some properties for convenience
	const svg = d3.select('#timeline').select('.plot')
	const width = parseFloat(svg.style('width')) - 2 * theme().margin
	const height = parseFloat(svg.style('height'))

	//Create an axis for displaying the timeline
	const x = d3.scaleLinear().domain([startWeek, endWeek]).range([0, width])

	const axis = svg
		.append('g')
		.attr('transform', 'translate(' + theme().margin + ',' + height / 2 + ')')
		.call(
			d3
				.axisTop(x)
				.tickSize(7)
				.tickValues(d3.range(weekDelta / 2 + 1).map(x => startWeek + x * 2))
		)

	axis.selectAll('text').attr('y', -15)
	styleAxis(axis)

	//const moths = d3.scaleBand().domain(['January', 'February', 'March', 'April', 'May']).range([0, width])
	const months = d3
		.scaleTime()
		.domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
		.range([0, width])

	const monthsAxis = svg
		.append('g')
		.attr('transform', 'translate(' + theme().margin + ',' + height / 2 + ')')
		.call(d3.axisBottom(months).tickSize(0).ticks(12, '%B'))

	styleAxis(monthsAxis)

	//Adjust month label positions
	monthsAxis
		.selectAll('text')
		.attr('x', width / 12 / 2)
		.attr('y', 23)

	monthsAxis.select('.domain').remove()

	svg
		.append('text')
		.attr('x', width + theme().margin)
		.attr('y', height / 2 + 5)
		.attr('text-anchor', 'end')
		.attr('dominant-baseline', 'hanging')
		.attr('fill', theme().font)
		.style('font-size', theme().fontSizeAxis)
		.text('weeks of the year 2020')

	//Create an indicator for the currently selected week with a fake shadow
	const idc = svg.append('g')
	idc.append('circle').attr('r', theme().timelineIndicator).attr('fill', '#00000055').attr('cy', 2)
	idc.append('circle').attr('r', theme().timelineIndicator).attr('fill', theme().axis)

	//Tracks whether the indicator was clicked
	var isIdcDragged = false
	idc.on('mousedown', () => (isIdcDragged = true))

	//Updates the scatter plot
	function updateTimeline() {
		const progress = (selectedWeek.value - startWeek) / weekDelta
		//idc.attr('cy', height / 2).attr('cx', Theme().margin + width * progress)
		idc.attr('transform', 'translate(' + (theme().margin + width * progress) + ',' + height / 2 + ')')
	}

	//Sets the week depending on the mouse position over the timeline
	function setWeekFromMouseX(x) {
		const rect = svg.node().getBoundingClientRect()
		x = x - rect.left

		const width = rect.width - theme().margin * 2
		const dist = (x - theme().margin) / width

		const weekPoint = Math.round(dist * weekDelta + startWeek)
		const week = Math.max(Math.min(weekPoint, endWeek), startWeek)
		selectedWeek.update(week)
	}

	//Listen to clicks on the timeline
	d3.select('#timeline').on('click', e => {
		setWeekFromMouseX(e.clientX)
	})

	d3.select('#timeline').on('mousemove', e => {
		if (e.buttons == 0) isIdcDragged = false
		if (isIdcDragged) setWeekFromMouseX(e.clientX)
	})

	//Subscribe the update to global events
	selectedWeek.subscribe(updateTimeline)

	updateTimeline()
}

export { createTimeline }
