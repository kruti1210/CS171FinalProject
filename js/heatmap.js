// adopted from http://bl.ocks.org/tjdecke/5558084

var heatmap_margin = { top: 50, right: 0, bottom: 100, left: 100 },
    heatmap_width = 800 - heatmap_margin.left - heatmap_margin.right,
    heatmap_height = 600 - heatmap_margin.top - heatmap_margin.bottom,
    gridSize = Math.floor(heatmap_width / 12),
    colors = ["#fee0d2", "#fc9272", "#ef3b2c", "#a50f15"],
    states_feeder =[],
    states = [],
    categories = ["Adults without doctor", "Uninsured adults", "Infant death rate", "Adults with poor/fair health"];

var tip = d3.tip().attr("class", "heatmap-tooltip")
    .html(function(d) {
        if (d["Category"] == "No_Doctor_2015" || d["Category"] == "Uninsured_2015" || d["Category"] == "Fair_Poor_Health_Status_2015") {
            return (d["Value"]+"%");
        }
        if (d["Category"] == "Infant_Death_Rate_2013") {
            return (d["Value"]+" per 1000 live births");
        }
    });

var heatmap_svg = d3.select("#heatmap").append("svg")
    .attr("width", heatmap_width + heatmap_margin.left + heatmap_margin.right)
    .attr("height", heatmap_height + heatmap_margin.top + heatmap_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + heatmap_margin.left + "," + heatmap_margin.top + ")");

d3.csv("data/Heatmap2.csv", function(error, data) {
    data.forEach(function (d) {
        d.Value = +d.Value;
        d.State_num = +d.State_num;
        d.Category_num = +d.Category_num;
        d.Value_Corrected = +d.Value_Corrected;
    });

    for (i = 0; i < 50; i++) {
        states_feeder.push(data[i]);
    }
    console.log(states_feeder);
    states_feeder.sort(function(a, b) { return a.State_num - b.State_num; });

    for (i = 0; i < states_feeder.length; i++) {
        states.push(states_feeder[i].State);
    }

    console.log(states);

    var stateLabels = heatmap_svg.selectAll(".stateLabel")
        .data(states)
        .enter().append("text")
        .text(function (d) { return d;})
        .attr("x", 0)
        .attr("y", function(d, i) { return (i-2) * (heatmap_height/50) + 62})
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + (gridSize / 1.5) + ")")
        .attr("class", "stateLabel mono axis-state");

    var categoryLabels = heatmap_svg.selectAll(".categoryLabel")
        .data(categories)
        .enter().append("text")
        .text(function(d,i) { return d; })
        .attr("x", function(d, i) { return i * gridSize + 30; })
        .attr("y", 65)
        .style("text-anchor", "start")
        .attr("transform", "translate(" + (gridSize / 2) + ", -6)")
        .attr("transform", function(d, i) { return ("rotate(300," + (i*gridSize + 30) + ",65)"); })
        .attr("class", "categoryLabel mono axis-category");

    /*var categoryText = heatmap_svg.selectAll(".categoryText")
        .data(categories)
        .enter().append("text")
        .text(function(d,i) {return "Category " + (i+1) + ": " + d; })
        .attr("x", 170)
        .attr("y", function(d, i) { return i* gridSize/2 + 7; })
        .attr("class", "categoryText mono");*/

    var cards = heatmap_svg.selectAll(".card")
        .data(data, function(d) { return d.State_num + ":" + d.Category_num; });

    var colorScale = d3.scale.quantile()
        .domain([1,2,3,4])
        .range(colors);

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.Category_num - 1) * gridSize; })
        .attr("y", function(d) { return (d.State_num - 1) * (heatmap_height/50) + 75; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "card bordered")
        .attr("width", gridSize)
        .attr("height", heatmap_height/50)
        .style("fill", colors[0])
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    cards.call(tip)

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.Value_Corrected); });

    cards.select("title").text(function(d) { return d.Value; });

    cards.exit().remove();

   var legend = heatmap_svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", 250)
        .attr("y", function(d, i) { return i*30+75})
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d, i) { return colors[i]; });

    legend.exit().remove();

    heatmap_svg.append("text")
        .attr("class", "mono")
        .attr("x", 277)
        .attr("y", 88)
        .text("Top performing states (first quartile)");

    heatmap_svg.append("text")
        .attr("class", "mono")
        .attr("x", 277)
        .attr("y", 118)
        .text("Second quartile");

    heatmap_svg.append("text")
        .attr("class", "mono")
        .attr("x", 277)
        .attr("y", 148)
        .text("Third quartile");

    heatmap_svg.append("text")
        .attr("class", "mono")
        .attr("x", 277)
        .attr("y", 178)
        .text("Worst performing states (fourth quartile)");

    console.log(data);
});
