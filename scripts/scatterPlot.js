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
  const x = d3.scaleLog().domain([1, maxCases]).range([0, width]).clamp(true).nice()

  svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + (height + margin) + ')')
    .call(d3.axisBottom(x).ticks(15, '.0f'))

  //Basically the same for the y axis
  const y = d3.scaleLog().domain([1, maxDeaths]).range([height, 0]).clamp(true).nice()

  svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')')
    .call(d3.axisLeft(y).ticks(15, '.0f'))

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

  //Findes the maximum and minimum factors in the data
  function factorMinMax(data) {
    const min = Math.min(...data.map(x => x.factor))
    const max = Math.max(...data.map(x => x.factor))
    return { min: min, max: max, span: max - min }
  }

  //Computes the fill color for a dot from it's factor value
  function dotFill(value, bounds) {
    //For now we just blend from black to white
    const c = (1 - (value - bounds.min) / bounds.span) * 255
    return `rgb(${c}, ${c}, ${c})`
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
  }

  //Removes all tooltips
  function clearTooltip() {
    container.selectAll('.tooltip').remove()
  }

  //Shows the cleaned data in the plot
  function showScatterPlot(data, bounds) {
    const update = container.selectAll('circle').data(data, x => x.country)

    update
      .transition(d3.easeBackInOut)
      .duration(moveDuration)
      .attr('cx', d => x(d.cases))
      .attr('cy', d => y(d.deaths))

    const enter = update
      .enter()
      .append('circle')
      .attr('cx', d => x(d.cases))
      .attr('cy', d => y(d.deaths))
      .on('mouseenter', showTooltip)
      .on('mouseleave', clearTooltip)
      .transition(d3.easeBackOut)
      .duration(scaleDuration)
      .attrTween('r', d => d3.interpolate(0, r((d.factor - bounds.min) / bounds.span)))

    update.exit().transition(d3.easeBackIn).duration(scaleDuration).attr('r', 0).remove()

    container
      .selectAll('circle')
      .sort(compareCountries)
      .style('fill', d =>
        d.country == selectedCountry.value ? '#0055ff' : dotFill(d.factor, bounds)
      )
      .on('click', (e, d) => selectedCountry.update(d.country))
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
