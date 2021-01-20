import { theme, styleAxis } from './theme.js'

function createLineChart(dataContainer) {
	//destructure data container
	const { data, selectedCountry } = dataContainer

	console.log(selectedCountry.value)

	//find the start week of the data
	const firstWeek = Math.min(
		...Object.values(data).map(x => {
			//console.log(Object.keys(x.covid))
			return Math.min(...Object.keys(x.covid))
		})
	)

	const finalWeek = 53

	const weekDiff = finalWeek - firstWeek

	//filter out data for line chart
	function filterData() {
		const allCountriesData = []

		for (let countryKey in data) {
			const countryData = data[countryKey]
			const countryLineData = []

			for (let week = 1; week <= 53; week++) {
				if (week in countryData.covid) {
					countryLineData.push({
						cases: countryData.covid[week].cases,
						week: week,
					})
				}
			}

			allCountriesData.push({
				country: countryKey,
				name: countryData.name,
				data: countryLineData,
			})
		}

		return allCountriesData
	}

	function reduceData(data, country) {
		const returnData = []
		const dataWorldwide = []
		const casesWorldwide = []
		var sum = 0

		//extract data for selected country
		for (let index = 0; index < data.length; index++) {
			if (data[index].country == country) {
				returnData.push(data[index])
			}
		}

		return returnData
	}

	//maximum infections
	const maxInfections = Math.max(
		...Object.values(data).map(x => {
			return Math.max(...Object.values(x.covid).map(y => y.cases))
		})
	)

	function findMax(data) {
		let max = 0
		for (let i = 0; i < data.data.length; i++) {
			if (data.data[i].cases > max) {
				max = data.data[i].cases
			}
			console.log(data.data[i])
		}
		console.log(max)
		return max
	}

	console.log(maxInfections)

	const filteredData = filterData()
	console.log(filteredData)

	const lineChartData = reduceData(filteredData, selectedCountry.value)
	console.log(lineChartData)

	//const height = parseFloat(svg.style('height'))
	//const width = parseFloat(svg.style('width')) - 2 * theme().margin

	// set the dimensions and margins of the graph
	const graph = document.querySelector('#lineChart')
	const offsetWidth = graph.offsetWidth
	const offsetHeight = graph.offsetHeight
	const margin = { top: 10, right: 10, bottom: 10, left: 10 },
		width = offsetWidth - margin.left - margin.right,
		height = offsetHeight - margin.top - margin.bottom

	const svg = d3
		.select('#lineChart')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)

	const container = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	function plotLineChart(data) {
		//set up the x axis
		const xValue = d3.scaleLinear().domain([firstWeek, finalWeek]).range([0, width])

		var xA = svg
			.append('g')
			.attr('transform', 'translate(' + theme().margin + ',' + offsetHeight + ')')
			.call(
				d3
					.axisBottom(xValue)
					.tickSize(7)
					.tickValues(d3.range(weekDiff / 2 + 1).map(x => firstWeek + x * 2))
			)

		styleAxis(xA)

		//set up the y axis
		const yValue = d3
			.scaleLinear()
			.domain([
				1,
				d3.max(data[0].data, d => {
					return d.cases
				}),
			])
			.range([offsetHeight, 0])
			.clamp(true)
			.nice()

		svg.selectAll('.yAxis').remove()

		var yA = svg
			.append('g')
			.attr('class', 'yAxis')
			.attr('transform', 'translate(' + theme().margin + ',' + 0 + ')')
			.call(d3.axisLeft(yValue).ticks(12, '.0f'))

		styleAxis(yA)

		//---lines---//
		const line = d3
			.line()
			.x(function (d) {
				return xValue(d.week)
			})
			.y(function (d) {
				return yValue(d.cases)
			})

		//---drawing---//
		container.selectAll('.line').remove()
		const lines = container
			.selectAll('lines')
			.data(data, d => d)
			.join('g')
			.attr('class', 'line')
		lines
			.append('path')
			.attr('stroke', 'black')
			.attr('fill', 'none')
			//.attr('stroke-width', 0.5)
			.attr('d', function (d) {
				return line(d.data)
			})
	}

	plotLineChart(lineChartData)

	function updateGraph(dataContainer) {
		const { data, selectedCountry } = dataContainer
		const country = selectedCountry.value
		const lineChartData = reduceData(filteredData, country)
		plotLineChart(lineChartData)
	}

	// subscribe to observable
	selectedCountry.subscribe(() => updateGraph(dataContainer))
}

export { createLineChart }
