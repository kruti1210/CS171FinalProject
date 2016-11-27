var areachart;
var subchart;
var allData = [];
var general_keys = ["Out of pocket","Health Insurance","Other Third Party Payers and Programs","Public Health Activity","Investment"]
var all_keys = {'Out of pocket':['Out of pocket'],'Health Insurance':
    ['Private Health Insurance','Medicare','Medicaid (Title XIX)','CHIP (Title XIX and Title XXI)','' +
    'Department of Defense','Department of Veterans Affairs'],'Other Third Party Payers and Programs':
['Worksite Health Care','Other Private Revenues','Indian Health Services',"Workers' Compensation",
'General Assistance','Maternal/Child Health','Vocational Rehabilitation','Other Federal Programs*',
'SAMHSA','Other State and Local Programs**','School Health'],'Public Health Activity':['Federal','State and Local'],
    'Investment':['Research','Structures & Equipment']
};
var fill;
	fill.margin = { top: 40, right: 0, bottom: 40, left: 80 };

	fill.width = 800 - fill.margin.left - fill.margin.right,
	fill.height = 350 - fill.margin.top - fill.margin.bottom;
	fill.svg = d3.select("#stacked-area-chart-sub").append("svg")
	    .attr("width", fill.width + fill.margin.left + fill.margin.right)
	    .attr("height", fill.height + fill.margin.top + fill.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + fill.margin.left + "," + fill.margin.top + ")");
	fill.svg.append('text').text('HI').attr('y',fill.height/2);
	var borderPath = fill.svg.append("rect")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("height", fill.height)
	  .attr("width", fill.width)
	  .style("stroke",'black')
	  .style("fill", "none")
	  .style("stroke-width", 1);
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
    areachart = new StackedAreaChart("stacked-area-chart",allData,general_keys,d3.scale.category10());

});
function updateVisualization() {
    console.log('hi')
    var start_year = document.getElementById('start').value;
    var end_year = document.getElementById('end').value;
    areachart.initVis(start_year,end_year);
    if(typeof subchart !='undefined'){
        subchart.initVis(start_year,end_year);
    }
    return false;

}
