/// <reference path='d3.js' />

import { insertCovidData, insertOECDData } from './dataCleaning.js'
import { ObservableData } from './observer.js'

async function loadData() {
  //Variables for the current state of the visualization
  //These change as the user interacts with the page
  //Each variable is of type observable data allowing other to subscribe to the variable
  //To be informed on changes to its value

  //The country selected for highlighting and additional info
  let selectedCountry = new ObservableData('DEU')

  //The factor selected driving the sphere sizes on the main chart and other charts
  const FACTORS = {
    SMOKING: 'smoking',
    OBESITY: 'obesity',
    ALCOHOL: 'alcohol',
    HOSPITALBEDS: 'hospitalBeds',
    HEALTHSPENDINGS: 'healthSpendings',
  }

  let selectedFactor = new ObservableData(FACTORS.SMOKING)

  //The week of the year selected on the timeline
  let selectedWeek = new ObservableData(44)

  //The information selected for display on the overview line chart
  const OVERVIEWS = { INFECTIONS: 'infections', DEATHS: 'deaths' }
  let selectedOverview = new ObservableData(OVERVIEWS.INFECTIONS)

  //The countries selected for display
  const FILTERS = { ALL: 'all' }
  let selectedFilter = new ObservableData(FILTERS.ALL)

  //Global varaibles to be used by charts and other visualization components
  //Changing these might break other code, so be careful

  //Load the core data wrapped as string
  const DATA_COVID = await d3.csv('../data/global-covid-data.csv')
  const DATA_SMOKING = await d3.csv('../data/global-smoking-data.csv')
  const DATA_ALCOHOL = await d3.csv('../data/global-alcohol-data.csv')
  const DATA_HEALTHSPENDINGS = await d3.csv('../data/global-healthspendings-data.csv')
  const DATA_HOSPITALBEDS = await d3.csv('../data/global-hospitalbeds-data.csv')
  const DATA_OBESITY = await d3.csv('../data/global-obesity-data.csv')

  //The main data object containing all available data
  //Check dataCleaning.js for the data structure
  let DATA = {}

  //Use functions from dataCleaning.js to fill the main data structure with raw data from csv files
  insertCovidData(DATA, DATA_COVID)
  insertOECDData(DATA, DATA_SMOKING, FACTORS.SMOKING)
  insertOECDData(DATA, DATA_ALCOHOL, FACTORS.ALCOHOL)
  insertOECDData(DATA, DATA_HEALTHSPENDINGS, FACTORS.HEALTHSPENDINGS)
  insertOECDData(DATA, DATA_HOSPITALBEDS, FACTORS.HOSPITALBEDS)
  insertOECDData(DATA, DATA_OBESITY, FACTORS.OBESITY)

  console.log(`data of ${Object.keys(DATA).length} countries and regions found`)
  console.log(DATA)

  return {
    data: DATA,
    selectedFactor: selectedFactor,
    selectedOverview: selectedOverview,
    selectedFilter: selectedFilter,
    selectedWeek: selectedWeek,
    selectedCountry: selectedCountry,
  }
}

export { loadData }
