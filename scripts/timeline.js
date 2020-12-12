function createTimeline(dataContainer) {
  // destructure data container
  const { data, selectedWeek } = dataContainer;

  //Define some properties for the layout of the timeline
  const timeline = {};

  timeline.margin = 40;
  timeline.tickHeight = 30;
  timeline.moveDuration = 800;

  //Find the start and end week of the data
  timeline.startWeek = Math.min(
    ...Object.values(data).map((x) => {
      return Math.min(...Object.keys(x.covid));
    })
  );

  timeline.endWeek = Math.max(
    ...Object.values(data).map((x) => {
      return Math.max(...Object.keys(x.covid));
    })
  );

  //Grab the svg element and store some properties for convenience
  timeline.svg = d3.select("#timeline").select(".plot");
  timeline.width = parseFloat(timeline.svg.style("width")) - 2 * timeline.margin;
  timeline.height = parseFloat(timeline.svg.style("height")) - 2 * timeline.margin;

  //Create an axis for displaying the timeline
  timeline.x = d3
    .scaleLinear()
    .domain([timeline.startWeek, timeline.endWeek])
    .range([0, timeline.width]);

  timeline.svg
    .append("g")
    .attr(
      "transform",
      "translate(" + timeline.margin + "," + (timeline.height + timeline.margin) + ")"
    )
    .call(d3.axisTop(timeline.x).tickSize(timeline.tickHeight));

  //Updates the scatter plot
  timeline.updateTimeline = () => {};

  //Subscribe the update to global events
  selectedWeek.subscribe(timeline.updateTimeline);

  //Perform the initial update on window load
  window.addEventListener("load", timeline.updateTimeline);
}

export { createTimeline };
