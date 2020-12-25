var d3 = require("d3");
url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
d3.json(url).then(function (data) {
  console.log(data);
  var root = d3.hierarchy(data);
  var width = 800;
  var height = 400;
  var treemapLayout = d3.treemap();
  treemapLayout
    .size([width, height * 0.9])
    .paddingOuter(3)
    .paddingInner(1);
  root
    .sum(function (d) {
      return d.value;
    })
    .sort((a, b) => b.value - a.value);
  treemapLayout(root);
  console.log(root.descendants());
  d3.select("body").attr("align", "center");

  var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", "50%")
    .attr("y", "3%")
    .attr("text-anchor", "middle")
    .text("Movie Data");
  svg
    .append("text")
    .attr("id", "description")
    .attr("x", "50%")
    .attr("y", "7%")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text("Movies ordered by value");
  var colorfunc = (d) => {
    console.log(d);

    switch (d) {
      case "Action":
        return "red";
        break;
      case "Adventure":
        return "blue";
        break;
      case "Comedy":
        return "yellow";
        break;
      case "Drama":
        return "orange";
        break;
      case "Animation":
        return "darkgreen";
        break;
      case "Family":
        return "pink";
        break;
      case "Biography":
        return "teal";
        break;
      default:
        return "brown";
        break;
    }
  };
  d3.select("body").append("div").attr("id", "tooltip").attr("style", "position: absolute; opacity: 0;");
  var nodes = svg
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + [d.x0, d.y0 + height * 0.1] + ")";
    });

  nodes
    .append("rect")
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .attr("fill", (d) => colorfunc(d.data.category))
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => {
      return d.data.category ? d.data.category : d.data.name;
    })
    .attr("data-value", (d) => d.value)
    .text((i) => (i.x1 - i.x0) * (i.y1 - i.y0))
    .on("mouseover", function (d, i) {
      console.log(d, i);
      d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("color", "black")
        .attr("data-value", i.value)
        .attr("data-name", i.data.name)
        .style("background", "white")
        .text(i.data.name + ",$" + parseInt(i.value / 1000000) + "Mill");
    })
    .on("mousemove", function (d, i) {
      d3.select("#tooltip")
        .style("left", d.pageX + 10 + "px")
        .style("top", d.pageY + 10 + "px");
    })
    .on("mouseleave", function (d) {
      console.log("Hi");
      d3.select("#tooltip").style("opacity", 0);
    });

  nodes
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", function (d, i) {
      return 13 + i * 10;
    })
    .attr("font-size", 7)
    .text(function (d) {
      return d;
    });
  var g_leg = svg.append("g").attr("id", "legend");
  var legends_x = width * 0.7;
  g_leg
    .selectAll("rect")
    .data(["Action", "Adventure", "Comedy", "Drama", "Animation"])
    .enter()
    .append("rect")
    .attr("x", (d, i) => legends_x + i * 10)
    .attr("y", "6%")
    .attr("width", 10)
    .attr("height", 5)
    .attr("fill", colorfunc)
    .attr("class", "legend-item");
});
