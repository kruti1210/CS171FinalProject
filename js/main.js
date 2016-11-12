var areachart;
var colorScale = d3.scale.category20();
var allData = []
var general_keys = ["Out of pocket","Health Insurance","Other Third Party Payers and Programs","Public Health Activity","Investment"]
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}; //http://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
d3.csv("data/nhe2014.csv", function(data) {
    console.log(data);
    for(i = 1960;i<=2014;i++){
        allData.push({Year:i})
    }
    allData.forEach( function (d) {
        data.forEach(function(d_1){
            d[d_1['Expenditure Amount (Millions)'].trim()] = +d_1[d.Year].replaceAll(',','')||0
        })
    });
    console.log(allData)
    colorScale.domain(general_keys)
    console.log(d3.keys(allData[0]));
    areachart = new StackedAreaChart("stacked-area-chart",allData);
});