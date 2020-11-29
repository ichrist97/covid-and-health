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

//Adds data from the OECD csv format to the main data object
function insertOECDData(data, oecdData, name) {
    oecdData.forEach(x => {
        let country = x.LOCATION

        if (country in data) {
            let info = { 'value': x.Value, 'year': x.TIME }

            if (!(name in data[country]) || data[country][name].year < info.year) {
                data[country][name] = info
            }

        } else {
            console.log(`cannot insert ${name} data for ${country}. country not found.`)
        }
    })
}

//Adds smoking data to the main data object
function insertSmokingData(data, dataSmoking) {
    insertOECDData(data, dataSmoking, 'smoking')
}

//Adds obesity data to the main data object
function insertObesityData(data, dataObesity) {
    insertOECDData(data, dataObesity, 'obesity')
}

//Adds hospital bed data to the main data object
function insertHospitalBedData(data, dataHospitalBeds) {
    insertOECDData(data, dataHospitalBeds, 'hospitalBeds')
}

//Adds health spending data to the main data object
function insertHealthSpendingsData(data, dataHealthSpendings) {
    insertOECDData(data, dataHealthSpendings, 'healthSpending')
}

//Adds alcohol consumption data to the main data object
function insertAlcoholData(data, dataAlcohol) {
    insertOECDData(data, dataAlcohol, 'alcohol')
}

//Removes any countries that have data missing
function removeIncompleteEntries(data, args) {
    Object.keys(data).filter(x => {
        let value = data[x]
        if (x == "") return true

        let result = null
        args.forEach(a => {
            if (!(a in value)) result = a
        })

        if (result) {
            console.log(`removed ${value.name}. missing data ${result}`)
            return true
        }

        return false

    }).forEach(x => delete data[x])
}