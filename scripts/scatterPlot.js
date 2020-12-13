/// <reference path='d3.js' />

function createScatterPlot(dataContainer) {
  // destructure data container
  const { data, selectedFactor, selectedFilter, selectedWeek, selectedCountry } = dataContainer

  //Define some properties for the layout of the plot
  const margin = 40

  const minScale = 8
  const maxScale = 35

  const scaleDuration = 800
  const moveDuration = 800

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
  const width = parseFloat(svg.style('width')) - 2 * margin
  const height = parseFloat(svg.style('height')) - 2 * margin

  //Help ourselves to some x axis
  const x = d3.scaleLinear().domain([0, maxCases]).range([0, width])

  svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + (height + margin) + ')')
    .call(d3.axisBottom(x))

  //Basically the same for the y axis
  const y = d3.scaleLinear().domain([0, maxDeaths]).range([height, 0])

  svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')')
    .call(d3.axisLeft(y))

  //And a scale axis for convenience
  const r = d3.scaleLinear().domain([0, 1]).range([minScale, maxScale])

  //Preapare the container hosting the data spheres
  const container = svg.append('g').attr('transform', 'translate(' + margin + ',' + margin + ')')

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

      out.push({ country: x, cases: covid.cases, deaths: covid.deaths, factor: factor.value })
    })

    return out
  }

  //Findes the maximum and minimum factors in the data
  function factorMinMax(data) {
    const min = Math.min(...data.map(x => x.factor))
    const max = Math.max(...data.map(x => x.factor))
    return { min: min, max: max, span: max - min }
  }

  //Shows the cleaned data in the plot
  function showScatterPlot(data, bounds) {
    const update = container.selectAll('circle').data(data, x => x.country)

    update
      .transition(d3.easeBackInOut)
      .duration(moveDuration)
      .attr('cx', d => x(d.cases))
      .attr('cy', d => y(d.deaths))

    update
      .enter()
      .append('circle')
      .attr('cx', d => x(d.cases))
      .attr('cy', d => y(d.deaths))
      .style('fill', d => (d.country == 'DEU' ? '#ff00ff' : '#ffffff'))
      .transition(d3.easeBackOut)
      .duration(scaleDuration)
      .attrTween('r', d => d3.interpolate(0, r((d.factor - bounds.min) / bounds.span)))

    update.exit().transition(d3.easeBackIn).duration(scaleDuration).attr('r', 0).remove()
  }

  //Updates the scatter plot
  function updateScatterPlot() {
    const data = scatterPlotData()
    const bounds = factorMinMax(data)
    showScatterPlot(data, bounds)
  }

  //Subscribe the update to global events
  selectedCountry.subscribe(updateScatterPlot)
  selectedWeek.subscribe(updateScatterPlot)
  selectedFilter.subscribe(updateScatterPlot)

  updateScatterPlot()
}

export { createScatterPlot }
