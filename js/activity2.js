/*
 Most of the choropleth implementation (the legend and accompanying text esp)
 taken from the midterm's implementation of a choropleth
 */

/*
 THIS CODE FOR THE TOOLTIP WAS TAKEN DIRECTLY FROM RUSSIA CHOROPLETH MAP
 AT: http://bl.ocks.org/KoGor/5685876
 */
var div = d3.select("#vis-3-placeholder").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Create SVG area
var width = 900,
    height = 600;

var svgLE = d3.select("#vis-3-placeholder").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create mercator projection
// var projection = d3.geo.orthographic()

var projection = d3.geo.mercator()
    .translate([width / 2, height / 2 + 100])
    .scale([130]);

// Specify it in a new geo path generator
var path = d3.geo.path()
    .projection(projection);

// Create color scale
/*
 Tip to go to Cynthia Brewer's github was taken from Mike Bostock's book at this link: http://chimera.labs.oreilly.com/books/1230000000345/ch12.html#_choropleth
 Found quantize scale from Mikes book at: ref directly above
 I got the js file from Cynthia Brewer's github instructions at: https://github.com/d3/d3/blob/v3.5.17/lib/colorbrewer/colorbrewer.js
 I learned from the example code found at: https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md
 */

var colorBins = 9;

var color = d3.scale.quantize()
    .range(colorbrewer.Blues[colorBins]);

/*
 Learned how to format numbers at: https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md
 */
var regformat = d3.format("f");

// Check if loaded; call vis
queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.csv, "data/LE-data2.csv")
    .defer(d3.csv, "data/country-codes.csv")
    .await(createVisualization);


// Load
function createVisualization (error, data, data2, data3) {

    // Convert the TopoJSON to GeoJSON
    var world = topojson.feature(data, data.objects.countries).features

    data2.forEach(function(dle){

        data3.forEach(function (dcc) {

            if (dle.Country === dcc.Name) {
                dle.isoCode = parseFloat(dcc.imptcode);
            }

        });

    });

    data2.forEach(function(dle) {

        world.forEach(function(d) {
            if (dle.isoCode === d.id) {
                d.countryName = dle.Country;
                d.le2013 = parseFloat(dle["2013"]);
            }

        });

    });

    // Give names to country even if there is no life expectancy data
    world.forEach(function(d) {
        if (!d.countryName) {
            data3.forEach(function (dcc) {
                var isoCode = parseFloat(dcc.imptcode);
                if (d.id === isoCode) {
                    d.countryName = dcc.Name;
                }
            });
        }
    });

    color.domain([
        d3.min(world, function(d) {return d.le2013; }),
        d3.max(world, function(d) {return d.le2013; })
    ]);

    // Render the world atlas using path generator
    var worldMap = svgLE.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "tehmap")
        .style("fill", function(d) {
            if (d.le2013) {
                return color(d.le2013);
            } else {
                return '#ccc';
            }
        })
        .style("opacity", 0.8);

    /*
     THIS CODE FOR THE TOOLTIP WAS TAKEN DIRECTLY FROM RUSSIA CHOROPLETH MAP
     AT: http://bl.ocks.org/KoGor/5685876
     */

    worldMap.on("mouseover", function(d) {
        d3.select(this)
            .transition().duration(400)
            .style("opacity", 1);
        div.transition().duration(400)
            .style("opacity", 1)
        div.html(
            "Country: " + d.countryName+ "<br/>" +
            "Life Expectancy: " + d.le2013+ "<br/>")
            .style("left", (d3.event.pageX - 60) + "px")
            .style("top", (d3.event.pageY - 60) + "px");
    })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(400)
                .style("opacity", 0.8);
            div.transition().duration(400)
                .style("opacity", 0);
        });

    /* Learned/used code from Responsive Legends with D3 (for invertExtent)
     at: http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/
     Also used code from: http://bl.ocks.org/KoGor/5685876
     */

    var ld_w = 20;
    var ld_h = 20;

    // --> Legend cubes implementation
    var legend = svgLE.selectAll("g.legend")
        .data(colorbrewer.Blues[colorBins]);

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", "30")
        .attr("y", function (d, i) {
            return height - i * ld_h - 2*ld_h;
        })
        .attr("height", ld_h)
        .attr("width", ld_w)
        .style("fill", function(d, i) {
            return colorbrewer.Blues[colorBins][i];
        });

    legend.exit().remove();


    // --> Legend numbers implementation

    var aText = svgLE.selectAll("text")
        .data(color.range());

    aText.enter().append("text")
        .attr("class", "aText");

    aText
        .attr("x", "60")
        .attr("y", function(d, i) {
            return height - i * ld_h - ld_h - 5;
        })
        .text(function (d) {
            var i = color.invertExtent(d);
            return d3.round(i[0], 2);
        });

    aText.exit().remove();


}
