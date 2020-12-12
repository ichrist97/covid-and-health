/// <reference path='d3.js' />

function createTimeline(dataContainer) {
  // destructure data container
  const { data, selectedWeek } = dataContainer

  //Define some properties for the layout of the timeline
  const margin = 40
  const tickHeight = 30
  const moveDuration = 800

  //Find the start and end week of the data
  const startWeek = Math.min(
    ...Object.values(data).map(x => {
      return Math.min(...Object.keys(x.covid))
    })
  )

  const endWeek = Math.max(
    ...Object.values(data).map(x => {
      return Math.max(...Object.keys(x.covid))
    })
  )

  //Grab the svg element and store some properties for convenience
  const svg = d3.select('#timeline').select('.plot')
  const width = parseFloat(svg.style('width')) - 2 * margin
  const height = parseFloat(svg.style('height')) - 2 * margin

  //Create an axis for displaying the timeline
  const x = d3.scaleLinear().domain([startWeek, endWeek]).range([0, width])

  svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + (height + margin) + ')')
    .call(d3.axisTop(x).tickSize(tickHeight))

  //Updates the scatter plot
  function updateTimeline() {}

  //Listen to clicks on the timeline
  d3.select('#timeline').on('click', e => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x > margin && x < rect.width - margin) {
      const width = rect.width - margin * 2
      const dist = (x - margin) / width
      const week = Math.floor(dist * (endWeek - startWeek) + startWeek)
      selectedWeek.update(week)
    }
  })

  //Subscribe the update to global events
  selectedWeek.subscribe(updateTimeline)

  updateTimeline()
}

export { createTimeline }
