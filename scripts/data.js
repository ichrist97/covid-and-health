/// <reference path='d3.js' />

import { insertCovidData, insertOECDData } from './dataCleaning.js'
import { ObservableData } from './observer.js'

//Define enumerations for properties
let FACTORS, OVERVIEWS, FILTERS

const factorExplanation = {
	smoking: 'share of population considered daily smokers',
	obesity: 'share of population considered overweight',
	alcohol: 'annual sales of alcohol in litre/capita',
	hospitalBeds: 'number of beds per 1000 inhabitants',
	healthSpendings: 'share of GDP spent for health care',
}

const factorDetailExplanation = {
	smoking:
		'Daily smokers are defined as the population aged 15 years and over who are reporting to smoke every day. Smoking is a major risk factor for at least two of the leading causes of premature mortality - circulatory disease and cancer, increasing the risk of heart attack, stroke, lung cancer, and cancers of the larynx and mouth. In addition, smoking is an important contributing factor for respiratory diseases. This indicator is presented as a total and per gender and is measured as a percentage of the population considered (total, men or women) aged 15 years and over.',
	obesity:
		'The overweight or obese population is defined as the inhabitants with excessive weight presenting health risks because of the high proportion of body fat. The most frequently used measure is based on the body mass index (BMI), which is a single number that evaluates an individual\'s weight in relation to height (weight/height², with weight in kilograms and height in metres). Based on the WHO classification, adults with a BMI from 25 to 30 are defined as overweight, and those with a BMI of 30 or over as obese. This indicator is presented both for "self-reported" data (estimates of height and weight from population-based health interview surveys) and "measured" data (precise estimates of height and weight from health examinations) and is measured as a percentage of the population aged 15 years and older.',
	alcohol: `Alcohol consumption is defined as annual sales of pure alcohol in litres per person aged 15 years and older. Alcohol use is associated with numerous harmful health and social consequences, including an increased risk of a range of cancers, stroke and liver cirrhosis. Alcohol also contributes to death and disability through accidents and injuries, assault, violence, homicide and suicide. This indicator is measured in litres per capita (people aged 15 years and older).`,
	hospitalBeds:
		'This indicator provides a measure of the resources available for delivering services to inpatients in hospitals in terms of number of beds that are maintained, staffed and immediately available for use. Total hospital beds include curative (or acute) care beds, rehabilitative care beds, long-term care beds and other beds in hospitals. The indicator is presented as a total and for curative care and psychiatric care. It is measured in number of beds per 1 000 inhabitants.',
	healthSpendings:
		'Health spending measures the final consumption of health care goods and services (i.e. current health expenditure) including personal health care (curative care, rehabilitative care, long-term care, ancillary services and medical goods) and collective services (prevention and public health services as well as health administration), but excluding spending on investments. Health care is financed through a mix of financing arrangements including government spending and compulsory health insurance (“Government/compulsory”) as well as voluntary health insurance and private funds such as households’ out-of-pocket payments, NGOs and private corporations (“Voluntary”). This indicator is presented as a total and by type of financing (“Government/compulsory”, “Voluntary”, “Out-of-pocket”) and is measured as a share of GDP, as a share of total health spending and in USD per capita (using economy-wide PPPs).',
}

async function loadData() {
	//Variables for the current state of the visualization
	//These change as the user interacts with the page
	//Each variable is of type observable data allowing other to subscribe to the variable
	//To be informed on changes to its value

	//The country selected for highlighting and additional info
	let selectedCountry = new ObservableData('DEU')

	//The factor selected driving the sphere sizes on the main chart and other charts
	FACTORS = {
		SMOKING: 'smoking',
		OBESITY: 'obesity',
		ALCOHOL: 'alcohol',
		HOSPITALBEDS: 'hospitalBeds',
		HEALTHSPENDINGS: 'healthSpendings',
	}

	let selectedFactor = new ObservableData(FACTORS.OBESITY)

	//The week of the year selected on the timeline
	let selectedWeek = new ObservableData(45)

	//The information selected for display on the overview line chart
	OVERVIEWS = { INFECTIONS: 'infections', DEATHS: 'deaths' }
	let selectedOverview = new ObservableData(OVERVIEWS.SMOKING)

	//The countries selected for display
	FILTERS = { ALL: 'all' }
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

export { loadData, FACTORS, OVERVIEWS, FILTERS, factorExplanation, factorDetailExplanation }
