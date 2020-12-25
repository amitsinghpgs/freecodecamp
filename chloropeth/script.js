const { queue } = require("d3-queue");
const d3 = require("d3");
var topojson = require("topojson");
var url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
var geourl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

d3.json(url).then(function (data) {
  var fips_obj = {};
  for (var i = 0; i < data.length; i++) {
    fips_obj[data[i]["fips"]] = data[i];
  }
  var width = 960,
    height = 1000;
  var myColor = d3.scaleLinear().domain([1, 5]).range(["white", "blue"]);

  var colorfunc = (d, i) => {
    if (fips_obj[d["id"]]["bachelorsOrHigher"] > 60) {
      return myColor(5);
    } else if (fips_obj[d["id"]]["bachelorsOrHigher"] > 40) {
      return myColor(4);
    } else if (fips_obj[d["id"]]["bachelorsOrHigher"] > 20) {
      return myColor(3);
    } else {
      return myColor(2);
    }
  };
  d3.select("body").attr("align", "center");
  var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", "50%")
    .attr("y", "2%")
    .attr("text-anchor", "middle")
    .text("US county education data");
  svg
    .append("text")
    .attr("id", "description")
    .attr("x", "50%")
    .attr("y", "4%")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text("Percentage of adults age 25 and older with a bachelors degree or higher");
  var g = svg.append("g");
  d3.json(geourl).then(function (topology) {
    index_arr = topology.objects.counties.geometries.map((x) => x["id"]);
    var legends_x = 0.7 * width;
    var g_leg = g.append("g").attr("id", "legend");

    d3.select("body").append("div").attr("id", "tooltip").attr("style", "position: absolute; opacity: 0;");
    g_leg
      .selectAll("rect")
      .data([1, 2, 3, 4, 5])
      .enter()
      .append("rect")
      .attr("x", (d, i) => legends_x + i * 10)
      .attr("y", "6%")
      .attr("width", 10)
      .attr("height", 5)
      .attr("fill", (d) => myColor(d));
    var feature = topojson.feature(topology, topology.objects.counties).features;

    console.log(fips_obj);
    g.selectAll("path")
      .data(feature)
      .enter()
      .append("path")
      .attr("d", d3.geoPath())
      .attr("class", "county")
      .attr("data-fips", (d, i) => d["id"])
      .attr("data-education", (d, i) => fips_obj[d["id"]]["bachelorsOrHigher"])
      .attr("fill", colorfunc)
      .attr("state", (d, i) => fips_obj[d["id"]]["state"])
      .on("mouseover", function (d, i) {
        console.log(d, i);
        d3.select("#tooltip")
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("color", "black")
          .style("background-color", "white")
          .attr("data-education", fips_obj[i["id"]]["bachelorsOrHigher"])
          .text(fips_obj[i["id"]]["state"] + "," + fips_obj[i["id"]]["bachelorsOrHigher"]);
      })
      .on("mouseout", function () {
        d3.select("#tooltip").style("opacity", 0);
      })
      .on("mousemove", function (d, i) {
        d3.select("#tooltip")
          .style("left", d.pageX + 10 + "px")
          .style("top", d.pageY + 10 + "px");
      });
  });
});
