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
    console.log(subchart);
});
function updateVisualization() {
    console.log('hi')
    var start_year = document.getElementById('start').value;
    var end_year = document.getElementById('end').value;
    areachart.initVis(start_year,end_year);
    subchart.initVis(start_year,end_year);
    return false;

}
