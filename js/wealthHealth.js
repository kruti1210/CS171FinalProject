var margin = { top: 20, right: 30, bottom: 40, left: 40 };
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.pctile); })
    .y(function(d) { return y(d.le_raceadj); });
year = 2001;
alldata = [];

var svg = d3.select("#le_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/le_wealth.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.le_raceadj = +d.le_raceadj;
        d.pctile = +d.pctile;
        d.year = +d.year;
    });
    alldata = data.filter(function(d){
        return (d.year>0);
    });
    var males = alldata.filter(function(d){
        return (d.year==year)&(d.gnd=='M');
    });
    var females = alldata.filter(function(d){
        return (d.year==year)&(d.gnd=='F');
    });
    var both = alldata.filter(function(d){
        return (d.year==year);
    });

    males.sort(function(a, b) {
        return a.pctile - b.pctile;
    });
    console.log(males);
    x.domain([1, 100]);
    y.domain(d3.extent(alldata, function(d) { return d.le_raceadj; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life Expectancy");
    svg.append('g')
        .append('text')
        .text('Male')
        .attr('y',y(72))
        .attr('x',x(25))
        .attr('fill','blue')
        .attr('font-size',32);
    svg.append('g')
        .append('text')
        .text('Income Percentile')
        .attr('y',y(69))
        .attr('x',x(88))
    svg.append('g')
        .append('text')
        .text('2001')
        .attr('y',y(75))
        .attr('x',x(70))
        .attr('font-size',32)
        .attr('opacity',.2)
    svg.append('g')
        .append('text')
        .attr('class','textyear')
        .text(year)
        .attr('y',y(77))
        .attr('x',x(70))
        .attr('font-size',32)
    svg.append('g')
        .append('text')
        .text('Female')
        .attr('y',y(88))
        .attr('x',x(25))
        .attr('fill','red')
        .attr('font-size',32);

    var lineGraphMales = svg.append("path")
        .attr("d", line(males))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "linemales");

    var lineGraphFemales = svg.append("path")
        .attr("d", line(females))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "linefemales");
    var lineGraphMalesBase = svg.append("path")
        .attr("d", line(males))
        .attr("stroke", "blue")
        .attr('opacity',.2)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "linemales");

    var lineGraphFemalesBase = svg.append("path")
        .attr("d", line(females))
        .attr("stroke", "red")
        .attr('opacity',.2)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "linefemales");
});
var inter = setInterval(function() {
    updateData();
}, 3000);

// ** Update data section (Called from the onclick)
function updateData() {

    // Get the data again
    year = year+1;
    if(year==2015){
        year=2001;
    };
    var males = alldata.filter(function(d){
        return (d.year==year)&(d.gnd=='M');
    });
    var females = alldata.filter(function(d){
        return (d.year==year)&(d.gnd=='F');
    });
    var both = alldata.filter(function(d){
        return (d.year==year);
    });
    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".linemales")   // change the line
        .duration(750)
        .attr("d", line(males));
    svg.select(".linefemales")   // change the line
        .duration(750)
        .attr("d", line(females));
    svg.select(".textyear")   // change the line
        .duration(750)
        .text(year);


}
