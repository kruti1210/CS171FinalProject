// Code adopted from http://bl.ocks.org/weiglemc/6185069 and Lab 4

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xValue,
    xScale = d3.scale.linear().range([0, width]),
    xAxis1 = d3.svg.axis().scale(xScale).orient("bottom");

var yValue,
    yScale = d3.scale.linear().range([height, 0]),
    yAxis1 = d3.svg.axis().scale(yScale).orient("left");

var popScale = d3.scale.linear().range([4,30]);

var cValue = function(d) { return d.Region;},
    color2 = d3.scale.category10();

var svg2 = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#details").append("svg")
    .attr("width", 250)
    .attr("height", 500)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("#scatterplot").append("div")
    .attr("class", "scatter-tooltip")
    .style("opacity", 0);

load();

function load() {
    d3.csv("data/Accessibility.csv", function (error, data) {
        data.forEach(function(d) {
            d.Active_Physicians = +d.Active_Physicians;
            d.Hospital_Bed_Density = +d.Hospital_Bed_Density;
            d.Hospital_Beds = +d.Hospital_Beds;
            d.Hospital_Bed_Density = d3.format(".1f")(d.Hospital_Bed_Density)
            d.Population_100000 = +d.Population_100000;
            d.Wait_Time = +d.Wait_Time;
            d.Population = d3.format(",.0f")(d.Population_100000 * 100000)
        });

        var selectBoxX = document.getElementById("scatter-x");
        xValue = selectBoxX.options[selectBoxX.selectedIndex].value;

        var selectBoxY = document.getElementById("scatter-y");
        yValue = selectBoxY.options[selectBoxY.selectedIndex].value;

        drawScatter(data);
    });
}

function drawScatter(data) {
    svg2.selectAll(".dot").remove();
    svg2.selectAll(".axis").remove();
    svg2.selectAll(".label").remove();
    svg2.selectAll(".pop-label").remove();

        xScale.domain([
            d3.min(data, function(d) {return d[xValue];}) - 3,
            d3.max(data, function(d) {return d[xValue];}) + 3
        ]);

        yScale.domain([
            d3.min(data, function(d) {return d[yValue];}) - 3,
            d3.max(data, function(d) {return d[yValue];}) + 3
        ]);

    popScale.domain([
        d3.min(data, function(d) {return d.Population_100000}),
        d3.max(data, function(d) {return d.Population_100000})
    ]);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis1)
        .append("text")
        .attr("class", "label")
        .attr("x", width - 50)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(function() {
            if (xValue == "Active_Physicians") {return "Active physicians per 100,000 population"}
            if (xValue == "Hospital_Bed_Density") {return "Hospital beds per 100,000 population"}
            if (xValue == "Wait_Time") {return "Average emergency room wait time (min)"}
        });

    // y-axis
    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis1)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(function() {
            if (yValue == "Active_Physicians") {return "Active physicians per 100,000 population"}
            if (yValue == "Hospital_Bed_Density") {return "Hospital beds per 100,000 population"}
            if (yValue == "Wait_Time") {return "Average emergency room wait time (min)"}
        });


    svg2.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return popScale(d.Population_100000);})
        .attr("cx", function(d) { return xScale(d[xValue]);})
        .attr("cy", function(d) { return yScale(d[yValue]);})
        .attr("opacity", 0.6)
        .style("stroke", "black")
        .style("fill", function(d) { return color2(cValue(d));})
        .on("click", function(d) { return displayDetails(d);})
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["State"])
                .style("left", (d3.event.pageX+5) + "px")
                .style("top", (d3.event.pageY-28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    var legend = svg2.selectAll(".legend")
        .data(color2.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 68)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color2);

    // draw legend text
    legend.append("text")
        .attr("x", width - 74)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

    svg2.append("text")
        .attr("class", "pop-label")
        .attr("x", width-50)
        .attr("y", 100)
        .style("text-anchor", "end")
        .text("Circle radius corresponds");

    svg2.append("text")
        .attr("class", "pop-label")
        .attr("x", width-50)
        .attr("y", 115)
        .style("text-anchor", "end")
        .text("to population size");
    console.log(data);
}

function displayDetails (d) {
    svg3.selectAll("text").remove();
    svg3.append("text")
        .attr("class", "state")
        .attr("x", 10)
        .attr("y", 10)
        .text(d.State);

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 35)
        .text("Population: " + d.Population + " people");

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 55)
        .text("Active physicians: " + d.Active_Physicians);

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 70)
        .text(" per 100,000 population");

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 90)
        .text("Hospital beds: " + d.Hospital_Bed_Density);

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 105)
        .text(" per 100,000 population");

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 125)
        .text("Emergency room wait time:");

    svg3.append("text")
        .attr("x", 10)
        .attr("y", 140)
        .text(d.Wait_Time + " minutes");
}
