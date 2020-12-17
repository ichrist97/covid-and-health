/// <reference path='d3.js' />

import { Theme } from './theme.js'

function createTimeline(dataContainer) {
	// destructure data container
	const { data, selectedWeek } = dataContainer

	//Define some properties for the layout of the timeline
	const margin = 40
	const tickHeight = 20
	const indicatorRadius = 12

	const moveDuration = 800

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
	const width = parseFloat(svg.style('width')) - 2 * margin
	const height = parseFloat(svg.style('height')) - 2 * margin

	//Create an axis for displaying the timeline
	const x = d3.scaleLinear().domain([startWeek, endWeek]).range([0, width])

	const axis = svg
		.append('g')
		.attr('transform', 'translate(' + margin + ',' + (height + margin) + ')')
		.call(
			d3
				.axisTop(x)
				.tickSize(tickHeight)
				.ticks(endWeek - startWeek)
		)

	axis.selectAll('line').style('stroke', Theme().axis)
	axis.selectAll('path').style('stroke', Theme().axis)
	axis.selectAll('text').style('fill', Theme().axis)

	//Create an indicator for the currently selected week
	const idc = svg.append('circle').attr('r', indicatorRadius).attr('fill', Theme().buttonActive)

	//Tracks whether the indicator was clicked
	var isIdcDragged = false
	idc.on('mousedown', () => (isIdcDragged = true))

	//Updates the scatter plot
	function updateTimeline() {
		const progress = (selectedWeek.value - startWeek) / weekDelta
		idc.attr('cy', height + margin).attr('cx', margin + width * progress)
	}

	//Sets the week depending on the mouse position over the timeline
	function setWeekFromMouseX(x) {
		const rect = svg.node().getBoundingClientRect()
		x = x - rect.left

		const width = rect.width - margin * 2
		const dist = (x - margin) / width

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
