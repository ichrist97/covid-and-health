[![Netlify Status](https://api.netlify.com/api/v1/badges/f8a4f57a-a817-48f3-98de-1df9d03af9cb/deploy-status)](https://app.netlify.com/sites/covid-and-health/deploys)

# Covid and Health [Group 20]

### Project for the masters course on information visualization at LMU Munich WS 20/12

### Components

The main components of the visualization is a **scatter plot** that displays infections and deaths per country on it's axis and matches this information with additional data to health and lifestyle through point size and color. The scatter plot allows for selection a country for further inspection.

The main plot is paired with a **timeline** that allows the selection of a week of the year 2020 to inspect the data for. Selecting a week transitions the main plot to this point in time.

The additional feature to compare the covid data to can be selected from a **health factor selection box**.

The additional feature **Health factor details** is displayed in a **bar chart** that sorts the countries based on this feature and makes the additional feature more accessible.

The exact data values for the selected country can be viewed in the **country details view**.

An **overview line plot** shows the infection or death rates for all countries over the course of the year 2020 and allows for a more informed selection on the timeline.

---

### Completed

- **Death rate**

  Scatter plot which depicts the ratio between deaths and infections dependent on selected health factor

- **Timeline**

  Select Covid19 data for different calender week of year 2020

- **Health factor selection**

  Select a health factor and lookup effect on death rate

- **Health factor details**

  Bar chart which shows the 'healthiness' regaring the selected factor among the countries

- **Selected country details**

  Overview of details and important metrics for a single selected country

### Work in Progress

- Linechart which shows overview of overall covid19 development

### Backlog

- Interaction & Brushing by filtering countries
