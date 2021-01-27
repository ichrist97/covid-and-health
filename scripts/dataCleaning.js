//Utilities for cleaning and proprocessing raw data for display
//Functions are used in data.js for provided data to charts

//Data format:
//{country (Abbrev): {
//      name,
//      population,
//      covid: {date: {cases, deaths}},
//      smoking: {value, year}
//      obesity: {value, year}}}
//      hospitalBeds: {value, year}}}
//      healthSpendings: {value, year}}}
//      alcohol: {value, year}}}

//Builds the base data structure from covid case data
function insertCovidData(data, dataCovid) {
	dataCovid.forEach(x => {
		const country = x.countryterritoryCode
		if (!country) return

		if (!(country in data)) {
			const name = x.countriesAndTerritories.replaceAll('_', ' ')
			const values = { name: name, population: x.popData2019, covid: {} }
			data[country] = values
		}

		//Only consider the year 2020
		if (!x.year_week.includes('2020')) return

		//Get the matching week for the data point and insert the value
		const scaler = data[country].population / 100000
		const week = parseInt(x.year_week.replaceAll('2020-', ''))
		data[country].covid[week] = { cases: parseInt(x.cases_weekly) / scaler, deaths: parseInt(x.deaths_weekly) / scaler }
	})
}

/*
Deprecated. This was the function used for the initial csv structure
Since the csv structure was changed the new version of this function is used

function insertCovidData(data, dataCovid) {
  dataCovid.forEach(x => {
    const country = x.countryterritoryCode
    if (!country) return

    if (!(country in data)) {
      const name = x.countriesAndTerritories.replaceAll('_', ' ')
      const values = { name: name, population: x.popData2019, covid: {} }
      data[country] = values
    }

    const dateString = x.dateRep
    const info = { cases: x.cases, deaths: x.deaths }

    //Get the matching week for the data point and insert the value
    if (x.year != '2020') return
    const date = new Date(x.year, x.month - 1, x.day)
    const week = date.getWeek()

    if (!(week in data[country].covid)) {
      const defaultWeek = { cases: 0, deaths: 0 }
      data[country].covid[week] = defaultWeek
    }

    const scaler = data[country].population / 100000

    data[country].covid[week].cases += parseInt(x.cases) / scaler
    data[country].covid[week].deaths += parseInt(x.deaths) / scaler
  })
}
*/

//Adds data from the OECD csv format to the main data object
function insertOECDData(data, oecdData, name) {
	oecdData.forEach(x => {
		const country = x.LOCATION

		// only insert oecd data if country found in data
		if (country in data) {
			const info = { value: x.Value, year: x.TIME }

			if (!(name in data[country]) || data[country][name].year < info.year) {
				data[country][name] = info
			}
		}
	})
}

//Removes any countries that have data missing
function removeIncompconsteEntries(data, args) {
	Object.keys(data)
		.filter(x => {
			const value = data[x]
			if (x == '') return true

			const result = null
			args.forEach(a => {
				if (!(a in value)) result = a
			})

			// removed missing value
			if (result) {
				return true
			}

			return false
		})
		.forEach(x => delete data[x])
}

//I did not feel like conding date stuff myself (maybe the words kind of coding)
//So this is a solution from stack overflow with only slight modifications
//https://stackoverflow.com/questions/9045868/javascript-date-getweek/28365677
Date.prototype.getWeek = function (dowOffset = 1) {
	var newYear = new Date(this.getFullYear(), 0, 1)
	var day = newYear.getDay() - dowOffset //the day of week the year begins on
	day = day >= 0 ? day : day + 7

	var daynum =
		Math.floor(
			(this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000
		) + 1

	var weeknum

	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum + day - 1) / 7) + 1

		if (weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1, 0, 1)
			nday = nYear.getDay() - dowOffset
			nday = nday >= 0 ? nday : nday + 7

			/*if the next year starts before the middle of
              the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53
		}
	} else {
		weeknum = Math.floor((daynum + day - 1) / 7)
	}

	return weeknum
}

//Converts a date object to the date format used in covid data
//The applied format is mm/dd/yyyy
Date.prototype.formated = function formatedDate() {
	const month = String(this.getMonth() + 1).padStart(2, '0')
	const year = String(this.getFullYear())
	const day = String(this.getDate()).padStart(2, '0')
	return `${day}/${month}/${year}`
}

export { insertOECDData, insertCovidData }
