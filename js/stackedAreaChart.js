

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

StackedAreaChart = function(_parentElement, _data, _keys,_colorScale){
	this.parentElement = _parentElement;
  this.data = _data;
    this.keys = _keys;
  this.displayData = []; // see data wrangling
	this.colorScale = _colorScale;

  // DEBUG RAW DATA
	var start_year = document.getElementById('start').value;
	var end_year = document.getElementById('end').value;

  this.initVis(start_year,end_year);
}



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

StackedAreaChart.prototype.initVis = function(start_yr,end_yr){
	console.log(this.parentElement);
	document.getElementById(this.parentElement).innerHTML = "";
	var vis = this;
    vis.colorScale.domain(vis.keys);
    var dataCategories = vis.colorScale.domain();
	var selectedData = vis.data.filter(function(d){
		return ((d.Year>=start_yr)&(d.Year<=end_yr))
	});
	selectedData.forEach(function(d){
		console.log('hi');
		for(prop in d){
		if((prop!='POPULATION')&(prop!='Year'))
			d[prop] = d[prop]/d['POPULATION'];
		}
	})
    console.log(selectedData);
    var transposedData = dataCategories.map(function(name) {
        return {
            name: name,
            values: selectedData.map(function(d) {
                return {Year: d.Year, y: d[name]};
            })
        };
    });
    console.log(transposedData);
    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });
    vis.stackedData = stack(transposedData);

	vis.margin = { top: 40, right: 0, bottom: 40, left: 80 };

	vis.width = 800 - vis.margin.left - vis.margin.right,
  vis.height = 350 - vis.margin.top - vis.margin.bottom;
	//Tooltip from http://bl.ocks.org/d3noob/c37cb8e630aaef7df30d
	vis.tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");


  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);
	// TO-DO: Overlay with path clipping


	// Scales and axes
  vis.x = d3.scale.linear()
  	.range([0, vis.width])
  	.domain([start_yr,end_yr]);

	vis.y = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
		  .scale(vis.x)
		  .orient("bottom").tickFormat(d3.format("d"));

	vis.yAxis = d3.svg.axis()
	    .scale(vis.y)
	    .orient("left");

	vis.svg.append("g")
	    .attr("class", "x-axis axis")
	    .attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
			.attr("class", "y-axis axis");

	// TO-DO: Initialize stack layout


  // TO-DO: Stacked area layout
	vis.area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return vis.x(d.Year); })
        .y0(function(d) { return vis.y(d.y0); })
        .y1(function(d) { return vis.y(d.y0 + d.y); });
	//	...


	// TO-DO: Tooltip placeholder

	// TO-DO: (Filter, aggregate, modify data)

  vis.wrangleData();
}



/*
 * Data wrangling
 */

StackedAreaChart.prototype.wrangleData = function(){
	var vis = this;

	// In the first step no data wrangling/filtering needed
	vis.displayData = vis.stackedData;
	// Update the visualization
  vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

StackedAreaChart.prototype.updateVis = function(){
	var vis = this;

	// Update domain
	// Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
	vis.y.domain([0, d3.max(vis.displayData, function(d) {
			return d3.max(d.values, function(e) {
				return e.y0 + e.y;
			});
		})
	]);


	// Draw the layers
	var categories = vis.svg.selectAll(".area")
      .data(vis.displayData);
  
  categories.enter().append("path")
      .attr("class", "area")
	  .on("mouseover", function(d){vis.tooltip.text(d.name);
	  return vis.tooltip.style("visibility", "visible");})
	  .on('mousemove',function(d){return vis.tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	  .on("mouseout", function(d) {
		  return vis.tooltip.style("visibility", "hidden")
	  }).on("click", function(d){
      if(general_keys.includes(d.name)){
          document.getElementById('stacked-area-chart-sub').innerHTML = "";
          subchart = new StackedAreaChart("stacked-area-chart-sub",allData,all_keys[d.name],d3.scale.category20c());
      }
  });

  categories
  		.style("fill", function(d) { 
  			return vis.colorScale(d.name);
  		})
      .attr("d", function(d) {
				return vis.area(d.values);
      })

  // TO-DO: Update tooltip text




	categories.exit().remove();


	// Call axis functions with the new domain 
	vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}
