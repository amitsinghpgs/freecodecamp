var data;
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(url, function (json) {
  //code here
  data = json;
  data = data.map((d) => {
    date = new Date();
    date.setMinutes(parseInt(d.Seconds / 60));
    date.setSeconds(d.Seconds % 60);
    d["time_date"] = date;
    return d;
  });
  var svg = d3.select("body").append("svg");
  d3.select("body").append("div").attr("id", "tooltip").attr("style", "position: absolute; opacity: 0;");
  var yaxisspace = 50;
  var xaxisspace = 50;
  var xaxislength = 600;
  var yaxislength = 500;
  var w = xaxislength + 2 * yaxisspace;
  var h = yaxislength + 2 * xaxisspace;
  svg.attr("width", w).attr("height", h);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", 20)
    .attr("id", "title")
    .text("Scatter plot");

  var xscale = d3
    .scaleLinear()
    .domain([d3.min(data.map((x) => x.Year)), d3.max(data.map((x) => x.Year))])
    .range([0, xaxislength]);

  var xaxis = d3.axisBottom(xscale).tickFormat((d, i) => d.toString());
  svg
    .append("g")
    .attr("transform", "translate(" + yaxisspace + "," + (h - xaxisspace) + ")")
    .attr("id", "x-axis")
    .call(xaxis);

  var yscale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.time_date))
    .range([yaxislength, 0]);

  var yaxis = d3
    .axisLeft(yscale)
    .tickFormat((d, i) => d.getMinutes() + ":" + d.getSeconds().toString().padStart(2, "0"));
  svg
    .append("g")
    .attr("transform", "translate(" + yaxisspace + "," + (h - yaxislength - xaxisspace) + ")")
    .attr("id", "y-axis")
    .call(yaxis);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.time_date)
    .attr("secs", (d) => d.Seconds)
    .attr("r", 6)
    .style("fill", "#69b3a2")
    .attr("cx", (d) => xscale(d.Year) + yaxisspace)
    .attr("cy", (d) => xaxisspace + yscale(d.time_date))
    .on("mouseover", function (d) {
      console.log(d);
      d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", "red")
        .text(d[1])
        .attr("data-year", d.Year);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function () {
      d3.select("#tooltip")
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 10 + "px");
    });

  svg.append("rect").attr("x", 600).attr("y", 450).attr("height", 10).attr("width", 10).style("fill", "#69b3a2");
  svg
    .append("text")
    .attr("id", "legend")
    .attr("x", 620)
    .attr("y", 455)
    .text("time vs year")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
});
