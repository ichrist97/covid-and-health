# Covid19 and Health [Group 20]

[![Netlify Status](https://api.netlify.com/api/v1/badges/f8a4f57a-a817-48f3-98de-1df9d03af9cb/deploy-status)](https://app.netlify.com/sites/covid-and-health/deploys)

![alt](/assets/icon-coronavirus.png)

## How to use the application

### Online (Recommended)

You can access the application in the web by this [link](https://covid-and-health.netlify.app/).

### Run it locally on your PC

To run the application correctly it must be served via a local HTTP server.

Software requirements:

- Node.js & NPM ([Download](https://nodejs.org/en/download/))

After installation run the following commands in a terminal:

```
$ npm install -g http-server

$ cd <path-to-repository>

$ http-server
```

Then you can access the application in a browser under `http://localhost:8080` or `http://127.0.0.1:8080`

### Supported browsers

- Google Chrome
- Firefox
- Safari

Other browsers might but are not guaranteed to work.

---

## Project description - masters course on information visualization at LMU Munich WS 20/12

### Components

The main components of the visualization is a **scatter plot** that displays infections and deaths per country on it's axis and matches this information with additional data to health and lifestyle through point size and color. The scatter plot allows for selection a country for further inspection.

The main plot is paired with a **timeline** that allows the selection of a week of the year 2020 to inspect the data for. Selecting a week transitions the main plot to this point in time.

The additional feature to compare the covid data to can be selected from a **health factor selection box**.

The additional feature **Health factor details** is displayed in a **bar chart** that sorts the countries based on this feature and makes the additional feature more accessible.

The exact data values for the selected country can be viewed in the **country details view**.

An **overview line plot** shows the infection or death rates for all countries over the course of the year 2020 and allows for a more informed selection on the timeline.

---

## Feature list

- **Death rate depiction**\
  Scatter plot which depicts the ratio between deaths and infections dependent on selected health factor.

- **Timeline in calender weeks**\
  Select Covid19 data for different calender week of year 2020. Each calender week changes the death rate depiction.

- **Health factor selection**\
  Select a health factor and lookup effect on death rate.

- **Health factor details**\
  Bar chart which shows the "healthiness" regaring the selected factor among the countries.

- **Selected country details**\
  Overview of details and important metrics for a single selected country.

- **Help information**\
  Toogle a pop-up which provides further descriptions about the project and explanations about the given health factors.

- **Progress of infections and deaths througout the year 2020**\
  A line chart which shows the development of infections or deaths for each country based on the user's selection.

## Documentation

Further documentation about the design specifications, underlying usage principles, project management and progress of development can be found in an external documentation.
