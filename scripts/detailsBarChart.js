import { FACTORS } from "./data.js";

let overallData;

// set the dimensions and margins of the graph
let margin = { top: 20, right: 20, bottom: 30, left: 80 },
  width = 380 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

function filterBarDataForCategory(category) {
  const filterData = [];
  Object.values(overallData).forEach((country) => {
    // filter for countries containing the category
    if (country.hasOwnProperty(category)) {
      const countryFullName = country["name"];
      const categoryData = country[category]["value"];
      filterData.push({
        country: countryFullName,
        value: categoryData,
      });
    }
  });
  return filterData;
}

function setupFeatures() {
  const features = Object.values(FACTORS);
  const container = document.querySelector("#health-features");
  features.forEach((feature) => {
    // translation
    let translation;
    switch (feature) {
      case "smoking":
        translation = "Raucher";
        break;
      case "obesity":
        translation = "Übergewicht";
        break;
      case "alcohol":
        translation = "Alkoholkonsum";
        break;
      case "hospitalBeds":
        translation = "Anzahl Krankenhäuserbetten";
        break;
      case "healthSpendings":
        translation = "Ausgaben Gesundheitswesen";
        break;
      default:
        translation = "";
        break;
    }
    // create options in dom
    if (translation) {
      const item = document.createElement("input");
      item.type = "checkbox";
      item.id = `${feature}-feature`;
      item.value = feature;
      container.appendChild(item);
      // item label
      const label = document.createElement("label");
      label.for = item.id;
      label.innerText = translation;
      container.appendChild(label);

      // event listener for selecting features
      item.addEventListener("change", (event) => {
        // deselect all checkboxes
        const allFeatures = container.querySelectorAll("input");
        allFeatures.forEach((checkbox) => {
          checkbox.checked = false;
        });
        // select clicked checkbox
        event.target.checked = true;
        // update graph with new data
        const newCategory = event.target.value;
        const data = filterBarDataForCategory(newCategory);
        updateChart(data);
      });
    }
  });

  // default select first feature
  container.querySelectorAll("input")[0].checked = true;
}

function renderGraph(data) {
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  let svg = d3
    .select("#details-bar-chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  renderBars(svg, data);
}

function renderBars(svg, data) {
  // set the ranges
  let y = d3.scaleBand().range([height, 0]).padding(0.1);
  let x = d3.scaleLinear().range([0, width]);

  // format the data
  data.forEach((d) => {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  x.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    }),
  ]);
  y.domain(
    data.map(function (d) {
      return d.country;
    })
  );

  // append the rectangles for the bar chart
  svg
    .selectAll("g")
    .data(data, (d) => d)
    .join("rect")
    .attr("class", "bar")
    .attr("width", (d) => {
      return x(d.value);
    })
    .attr("y", (d) => {
      return y(d.country);
    })
    .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
}

function updateChart(data) {
  console.log("update graph");
  const svg = d3.select("#details-bar-chart-container");
  renderBars(svg, data);
}

function generateDetailsBarChart(data) {
  overallData = data;
  setupFeatures();
  // get selected feature
  const domFeatures = Array.from(
    document.querySelector("#health-features").querySelectorAll("input")
  );
  const selectedFeature = domFeatures.filter((item) => item.checked);
  const category = selectedFeature.length > 0 ? selectedFeature[0].value : domFeatures[0].value;
  const barData = filterBarDataForCategory(category);
  renderGraph(barData);
}

export { generateDetailsBarChart };
