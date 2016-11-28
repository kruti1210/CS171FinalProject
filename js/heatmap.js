// adopted from http://bl.ocks.org/tjdecke/5558084

var margin = { top: 50, right: 0, bottom: 100, left: 100 },
    width = 580 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 12),
    legendElementWidth = gridSize*2,
    buckets = 4,
    colors = ["#fee5d9", "#fcae91", "fb6a4a", "cb181d"],
    states_feeder =[],
    states = [],
    categories = ["Adults without a doctor (2015)", "Uninsured adults (2015)", "Infant death rate (2013)", "Adults reporting poor/fair health (2015)"];

var values1 = [],
    values2 = [],
    values3 = [],
    values4 = [];

var heatmap_svg = d3.select("#heatmap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/Heatmap2.csv", function(error, data) {
    data.forEach(function (d) {
        d.Value = +d.Value;
        d.State_num = +d.State_num;
        d.Category_num = +d.Category_num;
        d.Value_Corrected = +d.Value_Corrected;
    });

    for (i = 0; i < 50; i++) {
        states_feeder.push(data[i]);
        values1.push(data[i].Value);
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
        .attr("y", function(d, i) { return (i-2) * (height/50) -1})
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + (gridSize / 1.5) + ")")
        .attr("class", "stateLabel mono axis-state");

    var categoryLabels = heatmap_svg.selectAll(".categoryLabel")
        .data(categories)
        .enter().append("text")
        .text(function(d,i) { return (i+1); })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + (gridSize / 2) + ", -6)")
        .attr("class", "categoryLabel mono axis-category");

    var categoryText = heatmap_svg.selectAll(".categoryText")
        .data(categories)
        .enter().append("text")
        .text(function(d,i) {return "Category " + (i+1) + ": " + d; })
        .attr("x", 170)
        .attr("y", function(d, i) { return i* gridSize/2 + 7; })
        .attr("class", "categoryText mono");

    var cards = heatmap_svg.selectAll(".card")
        .data(data, function(d) { return d.State_num + ":" + d.Category_num; });

    var colorScale = d3.scale.quantile()
        .domain([1,2,3,4])
        .range(colors);

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.Category_num - 1) * gridSize; })
        .attr("y", function(d) { return (d.State_num - 1) * (height/50); })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "card bordered")
        .attr("width", gridSize)
        .attr("height", height/50)
        .style("fill", colors[0]);

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.Value_Corrected); });

    cards.select("title").text(function(d) { return d.Value; });

    cards.exit().remove();

    var legend = heatmap_svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height + 10)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 5)
        .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
        .attr("class", "mono")
        .text(function(d, i) { return "Quartile " + (i + 1); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height + gridSize);

    legend.exit().remove();

    console.log(data);
});
