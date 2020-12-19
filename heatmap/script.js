var data;
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
d3.json(url, function (json) {
  data = json;

  var month_name = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  data.monthlyVariance = data.monthlyVariance.map((d) => {
    d["month_name"] = month_name[d.month - 1];
    return d;
  });
  console.log(data);
  var svg = d3.select("body").append("svg");
  var w = 5000;
  var h = 300;
  var years = data.monthlyVariance.map((d) => d.year);
  var temps = data.monthlyVariance.map((d) => d.variance);
  var min_year = Math.min(...years);
  var max_year = Math.max(...years);
  console.log(min_year);
  var rec_w = 10;
  var rec_h = 10;
  var plotstart_x = 100;
  var plotstart_y = 100;
  d3.select("body").append("div").attr("id", "tooltip").attr("style", "position: absolute; opacity: 0;");
  svg.attr("height", h).attr("width", w);
  var legend_fill = { 1: "red", 2: "orange", 3: "blue", 4: "lightblue" };
  var legend = d3.select("body").append("svg").attr("id", "legend").attr("height", h).attr("width", w).attr("y", h);
  legend
    .selectAll("rect")
    .data([1, 2, 3, 4])
    .enter()
    .append("rect")
    .attr("x", (d, i) => 10 + rec_w * i)
    .attr("y", 0)
    .attr("height", rec_h)
    .attr("width", rec_w)
    .style("fill", (d) => legend_fill[d]);

  svg
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", (d) => plotstart_x + (d.year - min_year) * rec_w)
    .attr("y", (d) => plotstart_y + (d.month - 1) * rec_h)
    .attr("height", rec_h)
    .attr("width", rec_w)
    .style("fill", (d) => {
      var variance = d.variance;
      if (variance > d3.quantile(temps, 0.75)) {
        return "red";
      } else if (variance > d3.quantile(temps, 0.5)) {
        return "orange";
      } else if (variance > d3.quantile(temps, 0.25)) {
        return "blue";
      } else {
        return "lightblue";
      }
    })
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .on("mouseover", function (d) {
      d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", "black")
        .style("background-color", "white")
        .text(d.year + "," + d.month_name)
        .attr("data-year", d.year);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function () {
      d3.select("#tooltip")
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 10 + "px");
    });
  var xaxislength = rec_w * (max_year - min_year);
  var unique_years = [...new Set(years)].sort();
  var xscale = d3
    .scaleOrdinal()
    .domain(unique_years)
    .range(Array.from(new Array(unique_years.length), (x, i) => i * (xaxislength / (max_year - min_year))));

  var xaxis = d3.axisBottom(xscale).tickValues(unique_years.filter((x) => x % 10 == 0));
  svg
    .append("g")
    .attr("transform", "translate(" + (plotstart_x + rec_w / 2) + "," + (plotstart_y + rec_h * 12) + ")")
    .attr("id", "x-axis")
    .call(xaxis);

  var yaxislength = 11 * rec_h;
  var yscale = d3
    .scaleOrdinal()
    .domain(month_name)
    .range(Array.from(new Array(12), (x, i) => i * (yaxislength / 11)));

  var yaxis = d3.axisLeft(yscale);
  svg
    .append("g")
    .attr("transform", "translate(" + plotstart_x + "," + (plotstart_y + rec_h / 2) + ")")
    .attr("id", "y-axis")
    .call(yaxis);

  svg
    .append("text")
    .attr("x", 100)
    .attr("y", 20)
    .attr("id", "title")
    .text("Heat Map")
    .style("font-size", "16px")
    .style("text-decoration", "underline");

  svg
    .append("text")
    .attr("x", 100)
    .attr("y", 20 + 20)
    .attr("id", "description")
    .text("Annual Temperatures")
    .style("font-size", "16px")
    .style("text-decoration", "underline");
});
