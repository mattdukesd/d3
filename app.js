
// Step 0: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div");

// Retrieve data from the CSV file and execute everything below
d3.csv("sample_data.csv", function(err, sample_data) {
  if (err) throw err;

  sample_data.forEach(function(data) {
    data.Locationdesc = String(data.Locationdesc);
    data.Locationabbr = String(data.Locationabbr);
    data.noHealthcareCoverage = +data.noHealthcareCoverage;
    data.noDrVisitLast12Months = +data.noDrVisitLast12Months;
  });

 // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

 // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMax;

  // This function identifies the minimum and maximum values in a column in hairData.csv
  // and assign them to xMin and xMax variables, which will define the axis domain
  function findMinAndMax(dataColumnX) {
    xMin = d3.min(sample_data, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(sample_data, function(data) {
      return +data[dataColumnX] * 1.1;
    });

    yMax = d3.max(sample_data, function(data) {
      return +data.noDrVisitLast12Months * 1.1;
    });
  }

  var currentAxisLabelX = "noHealthcareCoverage";

  // Call findMinAndMax() with 'noHealthcareCoverage' as default
  findMinAndMax(currentAxisLabelX);

// Set the domain of an axis to extend from the min to the max value of the data column
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);


 chart
    .selectAll("circle")
    .data(sample_data)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.noDrVisitLast12Months);
    })
    .attr("r", "8")
    .attr("fill", "#ADD8E6");

// Include state abbreviations in the circles.
  chart.selectAll("text")
    .data(sample_data)
    .enter()
    .append("text")
    .style("font-size", 8)
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .attr("dx", function(data, index) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("dy", function(data, index) {
      return yLinearScale(data.noDrVisitLast12Months);
    })
    .text(function (data, index){
    return data.Locationabbr;
    });

// Create and situate your axes and labels to the left and bottom of the chart.

  // Append an SVG group for the x-axis, then display the x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);


  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "noDrVisitLast12Months")
    .text("No dr. visit for last 12 months");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    // This axis label is active by default
    .attr("class", "axis-text active")
    .attr("data-axis-name", "noHealthcareCoverage")
    .text("No healthcare coverage");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
 
});
