function createScatterPlot(dataContainer) {
  // destructure data container
  const { data, selectedFactor, selectedFilter, selectedWeek, selectedCountry } = dataContainer;

  //Define some properties for the layout of the plot
  const scatterPlot = {};

  scatterPlot.margin = 40;

  scatterPlot.minScale = 8;
  scatterPlot.maxScale = 35;

  scatterPlot.scaleDuration = 800;
  scatterPlot.moveDuration = 800;

  //Find the maximum infections and deaths
  scatterPlot.maxCases = Math.max(
    ...Object.values(data).map((x) => {
      return Math.max(...Object.values(x.covid).map((y) => y.cases));
    })
  );

  scatterPlot.maxDeaths = Math.max(
    ...Object.values(data).map((x) => {
      return Math.max(...Object.values(x.covid).map((y) => y.deaths));
    })
  );

  //Grab the svg element and store some properties for convenience
  scatterPlot.svg = d3.select("#scatterPlot").select(".plot");
  scatterPlot.width = parseFloat(scatterPlot.svg.style("width")) - 2 * scatterPlot.margin;
  scatterPlot.height = parseFloat(scatterPlot.svg.style("height")) - 2 * scatterPlot.margin;

  //Help ourselves to some x axis
  scatterPlot.x = d3.scaleLinear().domain([0, scatterPlot.maxCases]).range([0, scatterPlot.width]);
  scatterPlot.svg
    .append("g")
    .attr(
      "transform",
      "translate(" + scatterPlot.margin + "," + (scatterPlot.height + scatterPlot.margin) + ")"
    )
    .call(d3.axisBottom(scatterPlot.x));

  //Basically the same for the y axis
  scatterPlot.y = d3
    .scaleLinear()
    .domain([0, scatterPlot.maxDeaths])
    .range([scatterPlot.height, 0]);
  scatterPlot.svg
    .append("g")
    .attr("transform", "translate(" + scatterPlot.margin + "," + scatterPlot.margin + ")")
    .call(d3.axisLeft(scatterPlot.y));

  //And a scale axis for convenience
  scatterPlot.r = d3
    .scaleLinear()
    .domain([0, 1])
    .range([scatterPlot.minScale, scatterPlot.maxScale]);

  //Preapare the container hosting the data spheres
  scatterPlot.container = scatterPlot.svg
    .append("g")
    .attr("transform", "translate(" + scatterPlot.margin + "," + scatterPlot.margin + ")");

  //Cleans the data for usage in the scatter plot
  scatterPlot.scatterPlotData = () => {
    const data = [];
    const week = selectedWeek.value;

    Object.keys(data).forEach((x) => {
      const value = data[x];

      if (!(selectedFactor.value in value)) return;
      const factor = value[selectedFactor.value];

      if (!(week in value.covid)) return;
      const covid = value.covid[week];

      data.push({ country: x, cases: covid.cases, deaths: covid.deaths, factor: factor.value });
    });

    return data;
  };

  //Findes the maximum and minimum factors in the data
  scatterPlot.factorMinMax = (data) => {
    const min = Math.min(...data.map((x) => x.factor));
    const max = Math.max(...data.map((x) => x.factor));
    return { min: min, max: max, span: max - min };
  };

  //Shows the cleaned data in the plot
  scatterPlot.showScatterPlot = (data, bounds) => {
    const update = scatterPlot.container.selectAll("circle").data(data, (x) => x.country);

    update
      .transition(d3.easeBackInOut)
      .duration(scatterPlot.moveDuration)
      .attr("cx", (d) => scatterPlot.x(d.cases))
      .attr("cy", (d) => scatterPlot.y(d.deaths))
      .each((d) => {
        if (d.deaths < 0) console.log(d.country);
      });

    update
      .enter()
      .append("circle")
      .attr("cx", (d) => scatterPlot.x(d.cases))
      .attr("cy", (d) => scatterPlot.y(d.deaths))
      .style("fill", (d) => (d.country == "DEU" ? "#ff00ff" : "#ffffff"))
      .transition(d3.easeBackOut)
      .duration(scatterPlot.scaleDuration)
      .attrTween("r", (d) =>
        d3.interpolate(0, scatterPlot.r((d.factor - bounds.min) / bounds.span))
      );

    update
      .exit()
      .transition(d3.easeBackIn)
      .duration(scatterPlot.scaleDuration)
      .attr("r", 0)
      .remove();
  };

  //Updates the scatter plot
  scatterPlot.updateScatterPlot = () => {
    const data = scatterPlot.scatterPlotData();
    const bounds = scatterPlot.factorMinMax(data);
    scatterPlot.showScatterPlot(data, bounds);
  };

  //Subscribe the update to global events
  selectedCountry.subscribe(scatterPlot.updateScatterPlot);
  selectedWeek.subscribe(scatterPlot.updateScatterPlot);
  selectedFilter.subscribe(scatterPlot.updateScatterPlot);

  //Perform the initial update on window load
  window.addEventListener("load", scatterPlot.updateScatterPlot);

  //TODO remove
  window.addEventListener("click", (e) => selectedWeek.update(selectedWeek.value + 1));
}

export { createScatterPlot };
