// TODO define colors as constants

let svg
let barsContainer
let sortOrder = 'ascending'

// set the dimensions and margins of the graph

const container = document.querySelector('#factor-details')
const offsetWidth = container.offsetWidth
const offsetHeight = container.offsetHeight
const margin = { top: 40, right: 40, bottom: 40, left: 100 },
  width = offsetWidth - margin.left - margin.right,
  height = offsetHeight - margin.top - margin.bottom

// animations
const scaleDuration = 800

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

function renderGraph(data, selectedCountry) {
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

  renderBars(data, selectedCountry)
}

function renderBars(data, selectedCountry) {
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
    // no bars before animation
    .attr('width', d => {
      return x(0)
    })
    .attr('y', d => {
      return y(d.country)
    })
    .attr('height', y.bandwidth())
    // set country on bar for selecting
    .attr('data-country', d => d.id)
    // highlight selected country
    .attr('fill', d => {
      return d.id === selectedCountry.value ? '#ff0000' : '#5a9af4'
    })
    // user hovers over bar
    .on('mouseenter', event => {
      d3.select(event.target)
        .attr('fill', d => {
          // only change when bar is not selected
          const country = event.target.getAttribute('data-country')
          return country !== selectedCountry.value ? '#5ae0f4' : '#ff0000'
        })
        .style('cursor', 'pointer')
    })
    // user leaves bar
    .on('mouseleave', event => {
      d3.select(event.target)
        .attr('fill', d => {
          // only change when bar is not selected
          const country = event.target.getAttribute('data-country')
          return country !== selectedCountry.value ? '#5a9af4' : '#ff0000'
        })
        .style('cursor', 'default')
    })
    // user clicks bar
    .on('click', event => {
      // deselect all bars
      d3.selectAll('rect').attr('fill', '#5a9af4')
      // set clicked bar as selected
      d3.select(event.target).attr('fill', '#ff0000')
      // update observable
      const country = event.target.getAttribute('data-country')
      selectedCountry.update(country)
    })

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
  const { data, selectedFactor, selectedCountry } = dataContainer
  const factor = selectedFactor.value
  const filteredData = filterBarDataForCategory(data, factor)
  renderBars(filteredData, selectedCountry)
}

function generateDetailsBarChart(dataContainer) {
  const { data, selectedFactor, selectedCountry } = dataContainer
  const factor = selectedFactor.value
  const filteredData = filterBarDataForCategory(data, factor)
  renderGraph(filteredData, selectedCountry)
  //subscribe to factor observable
  selectedFactor.subscribe(() => updateGraph(dataContainer))
}

export { generateDetailsBarChart }
