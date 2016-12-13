# CS171FinalProject
Health Inequality in the United States
Julie Castrillon, Harrison Chase, Kruti Vora

Project URL: kruti1210.github.io
Screencast video URL:https://www.youtube.com/watch?v=xi-aIczbKUc
Process Book URL: https://docs.google.com/a/college.harvard.edu/document/d/1h8jhye84esBVVVyxDgLwc8HMFTB8R6ZymAiPa1YOG00/edit?usp=sharing
GitHub repository: https://github.com/kruti1210/kruti1210.github.io

Welcome to our project elucidating the inequalities in health care within the United States! As part of this project, we are submitting our code, data, process book, and this README file to explain more in detail what our code is. 

As part of our zipped file folder, you will find subfolders sorting our data/code files. Let's walk through the folders and files:

index.html - this document contains our HTML code/layout of the website

css folder: (styling)
  bootstrap.min.css - stylesheet that came with the Bootstrap library
  d3.slider.css - styling for the slider that is implemented to select a year for the line graph in the "Wealth and Health Care" bucket
  style.css - styling for remainder of website
  
data folder: (data)
  Accessibility.csv - data for accessibility scatterplot
  Heatmap2.csv - data for accessibility heatmap
  LE-data2.csv & LE-data3.csv - international data for choropleth maps
  convertedstates.json - mapping data for US states in US choropleth map (used in older version)
  country-codes.csv - data giving countries codes to match other international data
  le_all.js - all data for US counties that is mapped in the US choropleth map
  le_wealth.csv - data for the timeline line graph mapping life expectancy by income level
  nhe2014.csv & nhe2014_pop.csv - data for stacked area chart showing health care spending over time
  states_le.csv - data for an older version of the US choropleth map showing the lowest and highest life expectancies within a state (see prototype 2)
  us-counties.json - mapping data for US counties in US choropleth map
  world-110m.json - mapping data for countries in world choropleth map
  
img folder: (images)
  All files within this folder are images that are used within our website
  
js folder: (libraries and visualization implementations)
  activity2.js - implementation of the world choropleth map
  bootstrap.min.js - Bootstrap library
  colorbrewer.js - ColorBrewer scale used in choropleth maps
  d3-tip.js - tooltip implementation
  d3.min.js - d3 library
  d3.slider.js - implementation of slider used for line graph showing life expectancy by income level over time
  heatmap.js - implementation of accessibility heatmap
  jquery.min.js - jQuery library
  main.js - implementation of stacked area chart showing how health care spending has changed over time
  queue.js - queue function
  scatterplot.js - implementation of accessibility scatterplot
  stackedAreaChart.js - initiation of a stackedAreaChart object constructor function
  timeline.js - initiation of a timeline object constructor function
  topojson.v1.min.js - TopoJSON mapping
  vis3b.js - US county choropleth map implementation
  wealthHealth.js - implementation of line graph timeline of income and health outcomes
  
Detailed descriptions of the functionality of all visualizations and our design process can be found in the Process Book.

Thanks!
