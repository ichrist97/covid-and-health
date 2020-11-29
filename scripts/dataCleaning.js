//Utilities for cleaning and proprocessing raw data for display
//Functions are used in data.js for provided data to charts

//Data format: {country (Abbrev): {name, population, covid: {date: {cases, deaths}}, smokers: {value, year}}}

//Builds the base data structure from covid case data
function insertCovidData(data, dataCovid) {
    dataCovid.forEach(x => {
        let country = x.countryterritoryCode

        if (!(country in data)) {
            let values = { 'name': x.countriesAndTerritories, 'population': x.popData2019, 'covid': {} }
            data[country] = values
        }

        let date = x.dateRep
        let info = { 'cases': x.cases, 'deaths': x.deaths }
        data[country].covid[date] = info
    })
}

//Adds smoking data to the main data object
function insertSmokingData(data, dataSmoking) {
    dataSmoking.forEach(x => {
        let country = x.location

        if (country in data) {
            let info = { 'value': x.value, 'year': x.time }

            if (!('smokers' in data[country]) || data[country].smokers.year < info.year) {
                data[country].smokers = info
            }

        } else {
            console.log(`cannot insert smoking data for ${country}. country not found.`)
        }
    })
}

//Removes any countries that have data missing
function removeIncompleteEntries(data) {
    Object.keys(data).filter(x => {
        let value = data[x]
        if (!('smokers' in value)) return true
        return false

    }).forEach(x => delete data[x])
}