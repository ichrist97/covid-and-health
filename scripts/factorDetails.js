let svg
let barsContainer

// set the dimensions and margins of the graph

const container = document.querySelector('#factor-details')
const offsetWidth = container.offsetWidth
const offsetHeight = container.offsetHeight
const margin = { top: 40, right: 40, bottom: 40, left: 100 },
  width = offsetWidth - margin.left - margin.right,
  height = offsetHeight - margin.top - margin.bottom

// animations
const scaleDuration = 800
const moveDuration = 800

function filterBarDataForCategory(data, category) {
  const filterData = []
  Object.values(data).forEach(country => {
    // filter for countries containing the category
    if (country.hasOwnProperty(category)) {
      const countryFullName = country['name']
      const categoryData = country[category]['value']
      filterData.push({
        country: countryFullName,
        value: categoryData,
      })
    }
  })
  return filterData
}

function renderGraph(data, selectedFactor) {
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg = d3
    .select('#factor-details')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  barsContainer = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  renderBars(data)
}

function renderBars(data) {
  // set the ranges
  let y = d3.scaleBand().range([height, 0]).padding(0.1)
  let x = d3.scaleLinear().range([0, width])

  // format the data
  data.forEach(d => {
    d.value = +d.value
  })

  // Scale the range of the data in the domains
  x.domain([
    0,
    d3.max(data, function (d) {
      return d.value
    }),
  ])
  y.domain(
    data.map(function (d) {
      return d.country
    })
  )

  // append the rectangles for the bar chart
  barsContainer
    .selectAll('rect')
    .data(data, d => d)
    .join('rect')
    .attr('class', 'bar')
    // no bars before animation
    .attr('width', d => {
      return x(0)
    })
    .attr('y', d => {
      return y(d.country)
    })
    .attr('height', y.bandwidth())

  // add the x Axis
  barsContainer.selectAll('g').remove()
  barsContainer.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

  // add the y Axis
  barsContainer.append('g').call(d3.axisLeft(y))

  // animation
  const t = d3.transition().duration(scaleDuration).ease(d3.easeBackInOut)
  barsContainer
    .selectAll('rect')
    .transition(t)
    .attr('width', d => x(d.value))
}

function updateGraph(dataContainer) {
  const { data, selectedFactor } = dataContainer
  const factor = selectedFactor.value
  const filteredData = filterBarDataForCategory(data, factor)
  renderBars(filteredData)
}

function generateDetailsBarChart(dataContainer) {
  const { data, selectedFactor } = dataContainer
  const factor = selectedFactor.value
  const filteredData = filterBarDataForCategory(data, factor)
  renderGraph(filteredData)
  //subscribe to factor observable
  selectedFactor.subscribe(() => updateGraph(dataContainer))
}

export { generateDetailsBarChart }
