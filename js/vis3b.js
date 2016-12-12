/*
 Most of the choropleth implementation (the legend and accompanying text esp)
 taken from the midterm's implementation of a choropleth
 */

/*
 THIS CODE FOR THE TOOLTIP WAS TAKEN DIRECTLY FROM RUSSIA CHOROPLETH MAP
 AT: http://bl.ocks.org/KoGor/5685876
 */

/* Source for USA county GeoJSON file: http://bl.ocks.org/mbostock/raw/4090846/us.json */

var data2 = all_data_le;

var divUSLE = d3.select("#vis-3b-placeholder").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);


// Create SVG area
var widthUSLE = 900,
    heightUSLE = 600;

var usa;

var svgUSLE = d3.select("#vis-3b-placeholder").append("svg")
    .attr("width", widthUSLE)
    .attr("height", heightUSLE);

// Create  projection
var projectionUSLE = d3.geo.albersUsa()
    .scale(1000)
    .translate([widthUSLE / 2, heightUSLE / 2]);

// Specify it in a new geo path generator
var pathUSLE = d3.geo.path()
    .projection(projectionUSLE);

// Create color scale
/*
 Tip to go to Cynthia Brewer's github was taken from Mike Bostock's book at this link: http://chimera.labs.oreilly.com/books/1230000000345/ch12.html#_choropleth
 Found quantize scale from Mikes book at: ref directly above
 I got the js file from Cynthia Brewer's github instructions at: https://github.com/d3/d3/blob/v3.5.17/lib/colorbrewer/colorbrewer.js
 I learned from the example code found at: https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md
 */

var colorBinsUSLE = 9;

var colorUSLE = d3.scale.quantize()
    .range(colorbrewer.Greens[colorBinsUSLE]);


// Check if loaded; if so, call createVis
queue()
    .defer(d3.json, "data/us-counties.json")
    .await(createVisualization);

// Load
function createVisualization (error, data) {

    // Convert the TopoJSON to GeoJSON
    usa = topojson.feature(data, data.objects.counties).features

    usa.forEach(function(d) {

        data2.forEach(function(de) {

            if (d.id === parseFloat(de.cty)) {
                d.lefemale = de.le_female;
                d.lemale = de.le_male;
                d.countyname = de.cz_name;
                d.statename = de.statename;
                d.closest_country = de.closest_country;
            }

        });
    });

    // console.log(usa);

    // Update choropleth
    updateChoropleth();
}

function updateChoropleth() {

    /*
     Got this code from my old HW, I believe it was HW 3
     */

    var selectBox = document.getElementById("vis3b-options");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;

    colorUSLE.domain([
        d3.min(usa, function(d) {return d[selectedValue]; }),
        d3.max(usa, function(d) {return d[selectedValue]; })
    ]);


    var mapUSLE = svgUSLE.selectAll("path")
                    .data(usa);

    mapUSLE.enter().append("path")
        .attr("class", "vis3bmap");

    mapUSLE.attr("d", pathUSLE)
        .transition()
        .duration(2000)
        .style("fill", function(d) {
            //Get relevant value
            value = d[selectedValue];
            // Learned from Mike Bostock's book
            // at: http://chimera.labs.oreilly.com/books/1230000000345/ch12.html#_choropleth
            if (value) {
                return colorUSLE(value);
            } else {
                return "#ccc";
            }
        })
        .style("opacity", 1);

    mapUSLE.exit().remove();

    /*
     THIS CODE FOR THE TOOLTIP WAS TAKEN DIRECTLY FROM RUSSIA CHOROPLETH MAP
     AT: http://bl.ocks.org/KoGor/5685876
     */


    mapUSLE.on("mouseover", function(d) {
        d3.select(this)
            .transition().duration(400)
            .style("opacity", .8);
        divUSLE.transition().duration(400)
            .style("opacity", .8)
        divUSLE.html(
            "State: " + d.statename + "<br/>" +
            "County: " + d.countyname + "<br/>" +
            "Female Life Expectancy " + d.lefemale + "<br/>" +
            "Male Life Expectancy: " + d.lemale + "<br/>")
            .style("left", (d3.event.pageX - 50) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
    })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(400)
                .style("opacity", 1);
            divUSLE.transition().duration(400)
                .style("opacity", 0);
        });



    /*From hw 3 */
    mapUSLE.on("click", function (d) {
        document.getElementById("state_name").innerHTML = d.statename;
        document.getElementById("county_name").innerHTML = d.countyname;
        document.getElementById("le_female").innerHTML = d.lefemale;
        document.getElementById("le_male").innerHTML = d.lemale;
     document.getElementById("le_country").innerHTML = d.closest_country;
     console.log(d);
    });


    /* Learned/used code from Responsive Legends with D3 (for invertExtent)
     at: http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/
     Also used code from: http://bl.ocks.org/KoGor/5685876
     */


    var ld_w = 20;
    var ld_h = 20;

    // --> Legend cubes implementation
    var legendUSLE = svgUSLE.selectAll("g.legend")
        .data(colorbrewer.Greens[colorBins]);

    legendUSLE.enter().append("g")
        .attr("class", "legend");

    legendUSLE.append("rect")
        .transition()
        .duration(2000)
        .attr("x", "30")
        .attr("y", function (d, i) {
            return heightUSLE - i * ld_h - 2*ld_h;
        })
        .attr("height", ld_h)
        .attr("width", ld_w)
        .style("fill", function(d, i) {
            return colorbrewer.Greens[colorBins][i];
        });

    legendUSLE.exit().remove();


    // --> Legend numbers implementation

    var aTextUSLE = svgUSLE .selectAll("text")
        .data(colorUSLE.range());

    aTextUSLE .enter().append("text")
        .attr("class", "aText");

    aTextUSLE
        .transition()
        .duration(2000)
        .attr("x", "60")
        .attr("y", function(d, i) {
            return heightUSLE - i * ld_h - ld_h - 5;
        })
        .text(function (d) {
            var i = colorUSLE.invertExtent(d);
            return d3.round(i[0], 1);
        });

    aTextUSLE .exit().remove();



}
