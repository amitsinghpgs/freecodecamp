var data;
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
d3.json(url, function (json) {
  //code here
  data = json;
  console.log(data.data);
  var svg = d3.select("body").append("svg");
  var yaxisspace = 50;
  var xaxisspace = 50;
  var w = data.data.length * 2 + 2 * yaxisspace;
  var barheight = 500;
  var h = barheight + xaxisspace;
  d3.select("body").append("div").attr("id", "tooltip").attr("style", "position: absolute; opacity: 0;");
  svg.attr("width", w).attr("height", h).style("background-color", "lightblue");
  var yscale = d3
    .scaleLinear()
    .domain([0, d3.max(data.data.map((x) => x[1]))])
    .range([barheight, 0]);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", 20)
    .attr("id", "title")
    .text("US GDP");
  svg
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", 1)
    .attr("height", (d) => barheight - yscale(d[1]))
    .attr("x", (d, i) => yaxisspace + i * 2)
    .attr("y", (d) => yscale(d[1]))
    .attr("data-gdp", (d) => d[1])
    .attr("data-date", (d) => d[0])
    .on("mouseover", function (d) {
      console.log(d);
      d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", "red")
        .text(d[1])
        .attr("data-date", d[0]);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function () {
      d3.select("#tooltip")
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 10 + "px");
    });

  var yaxis = d3.axisLeft(yscale);
  svg
    .append("g")
    .attr("transform", "translate(" + yaxisspace + ",0)")
    .attr("id", "y-axis")
    .call(yaxis);

  var xscale = d3
    .scaleTime()
    .domain(
      d3.extent(data.data, function (d) {
        console.log(d[0]);
        year = parseInt(d[0].slice(0, 4));
        month = parseInt(d[0].slice(5, 7));
        day = parseInt(d[0].slice(9, 11));
        date = new Date(year, month - 1, day);
        return date;
      })
    )
    .range([0, 2 * data.data.length]);

  var xaxis = d3.axisBottom(xscale);
  svg
    .append("g")
    .attr("transform", "translate(" + yaxisspace + ", " + barheight + ")")
    .attr("id", "x-axis")
    .call(xaxis);
});
