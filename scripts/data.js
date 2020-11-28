//Reference the d3 framework for intellisense in vs code
//REference other scripts with utility functions
/// <reference path="d3.js" />
/// <reference path="observer.js" />

//Global varaibles to be used by charts and other visualization components
//Changing these might break other code, so be careful

//Load the core data wrapped as string
const DATA_COVID = d3.csvParse(DATA_COVID_RAW)
const DATA_SMOKING = d3.csvParse(DATA_SMOKING_RAW)

//TODO data cleaning can be done here or in each data file
//Cleaning here is more flexible but might slow down the page startup

//Variables for the current state of the visualization
//These change as the user interacts with the page
//Each variable is of type observable data allowing other to subscribe to the variable
//To be informed on changes to its value

//The country selected for highlighting and additional info
var selectedCountry = new ObservableData("DEU")

//The factor selected driving the sphere sizes on the main chart and other charts
const FACTORS = { SMOKING: "smoking" }
var selectedFactor = new ObservableData(FACTORS.SMOKING)

//The time selected on the timeline
var selectedDate = new ObservableData(new Date('June 20, 2020'))

//The information selected for display on the overview line chart
const OVERVIEWS = { INFECTIONS: "infections", DEATHS: "deaths" }
var selectedOverview = new ObservableData(OVERVIEWS.INFECTIONS)

//The countries selected for display
const FILTERS = { ALL: "all" }
var selectedFilter = new ObservableData(FILTERS.ALL)