import {
  insertCovidData,
  insertSmokingData,
  insertAlcoholData,
  insertHealthSpendingsData,
  insertHospitalBedData,
  insertObesityData,
  removeIncompleteEntries,
} from "./dataCleaning.js";
import { ObservableData } from "./observer.js";
import { DATA_OBESITY_RAW } from "../data/global-obesity-data.csv.js";
import { DATA_COVID_RAW } from "../data/global-covid-data.csv.js";
import { DATA_ALCOHOL_RAW } from "../data/global-alcohol-data.csv.js";
import { DATA_SMOKING_RAW } from "../data/global-smoking-data.csv.js";
import { DATA_HEALTHSPENDINGS_RAW } from "../data/global-healthspendings-data.csv.js";
import { DATA_HOSPITALBEDS_RAW } from "../data/global-hospitalbeds-data.csv.js";

//Global varaibles to be used by charts and other visualization components
//Changing these might break other code, so be careful

function loadData() {
  //Load the core data wrapped as string
  const DATA_COVID = d3.csvParse(DATA_COVID_RAW());
  const DATA_SMOKING = d3.csvParse(DATA_SMOKING_RAW());
  const DATA_ALCOHOL = d3.csvParse(DATA_ALCOHOL_RAW());
  const DATA_HEALTHSPENDINGS = d3.csvParse(DATA_HEALTHSPENDINGS_RAW());
  const DATA_HOSPITALBEDS = d3.csvParse(DATA_HOSPITALBEDS_RAW());
  const DATA_OBESITY = d3.csvParse(DATA_OBESITY_RAW());

  //The main data object containing all available data
  //Check dataCleaning.js for the data structure
  var DATA = {};

  //Use functions from dataCleaning.js to fill the main data structure with raw data from csv files
  insertCovidData(DATA, DATA_COVID);
  insertSmokingData(DATA, DATA_SMOKING);
  insertAlcoholData(DATA, DATA_ALCOHOL);
  insertHealthSpendingsData(DATA, DATA_HEALTHSPENDINGS);
  insertHospitalBedData(DATA, DATA_HOSPITALBEDS);
  insertObesityData(DATA, DATA_OBESITY);

  removeIncompleteEntries(DATA, []);
  console.log(`data of ${Object.keys(DATA).length} countries and regions found`);
  console.log(DATA);

  //Variables for the current state of the visualization
  //These change as the user interacts with the page
  //Each variable is of type observable data allowing other to subscribe to the variable
  //To be informed on changes to its value

  //The country selected for highlighting and additional info
  var selectedCountry = new ObservableData("DEU");

  //The factor selected driving the sphere sizes on the main chart and other charts
  const FACTORS = { SMOKING: "smoking" };
  var selectedFactor = new ObservableData(FACTORS.SMOKING);

  //The time selected on the timeline
  var selectedDate = new ObservableData(new Date("June 20, 2020"));

  //The information selected for display on the overview line chart
  const OVERVIEWS = { INFECTIONS: "infections", DEATHS: "deaths" };
  var selectedOverview = new ObservableData(OVERVIEWS.INFECTIONS);

  //The countries selected for display
  const FILTERS = { ALL: "all" };
  var selectedFilter = new ObservableData(FILTERS.ALL);

  const dataContainer = {
    data: DATA,
    selectedFactor: selectedFactor,
    selectedDate: selectedDate,
    selectedOverview: selectedOverview,
    selectedFilter: selectedFilter,
  };
  return dataContainer;
}

export { loadData };
