
var margin = {top:20 , right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// Set the ranges
/*var	x = d3.scale.linear().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);


var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);*/

var svg = d3.select("#pca").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

var svg2 = d3.select("#pca").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");




//var svg = d3.select('svg');


d3.text("hands.csv", function(text) {
  var hand_data = d3.csv.parseRows(text).map(function(row) {
    return row.map(function(value) {
      return +value;

    });
  });
d3.text("hands_pca.csv", function(text) {
  var hand_pca_data = d3.csv.parseRows(text).map(function(row) {
    return row.map(function(value) {
      return +value;
    });

  });

var hands=[];

for (i in hand_data) {

  var shape = hand_data[i];
  hands[i] = d3.zip(shape.slice(0, 56),shape.slice(56, 113))

};

var pca_hands=[];
for (i in hand_data) {
  var pca = hand_pca_data[i];

  pca_hands[i] = [pca[0],pca[1]];

  };

var pos = {x: 200, y: 200, xh: 60, yh: 85};
var circ_r = 150;
var scale_h = 200;
var scale_pc = 400;

	// Scale the range of the data

  var xValue = function(d) { return d[0];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d[1];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");
/*x.domain(d3.extent(pca_hands, function(d) { return d[0]*scale_pc; }));
y.domain([d3.min(pca_hands, function(d) { return d[1]*scale_pc; }), d3.max(pca_hands, function(d) { return d[1]*scale_pc; })]);*/
xScale.domain([-0.5,0.7]);
yScale.domain([-0.5, d3.max(pca_hands, function(d) { return d[1]; })]);

// d3.extent(pca_hands, function(d) { return d[0]; })
// d3.min(pca_hands, function(d) { return d[1]; })

	// Add the X Axis
svg2.append("g")
		.attr("class", "x axis")
		.attr("transform", 'translate(0, '+ height +')')
		.call(xAxis);

	// Add the Y Axis
svg2.append("g")
		.attr("class", "y axis")
	
		// "rotate(-90)"
		.call(yAxis); 

var tooltip = d3.select("#pca")
  .append("div")
  .style("background-color", "rgba(163, 171, 253, 0.6)")
  .style("font-Family", "Impact,Charcoal,sans-serif")
  .style("background-opacity", "0.5")
  .style("position", "absolute")
  .style("visibility", "hidden")

svg.append('circle')
    .attr("r", circ_r)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr('transform', 'translate('+pos.x+','+pos.y+')');

  points = svg2.selectAll()
  .data(pca_hands)
  .enter()
  .append('circle')
  .attr("cx", xMap)
  .attr("cy", yMap)
/*  .attr('cx',function(d){return d[0]*scale_pc;})
  .attr('cy',function(d){return d[1]*scale_pc;})*/
  .attr('r',2)
  // .attr('transform', 'translate(0, '+ height+')')
  .on('click', function(d, i) {
  svg.append('circle')
    .attr("r", circ_r)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr('transform', 'translate('+pos.x+','+pos.y+')');

      var lineFn = d3.svg.line()
  .x(function(d) { return d[0]*scale_h; })
  .y(function(d) { return d[1]*scale_h; })
  .interpolate("basis");

var lineGraph = svg.append("path")
  .attr("d", lineFn(hands[i]))
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("opacity", "1")
  .attr("fill", "pink")
  .attr('transform', 'translate('+pos.xh+','+pos.yh+')');})
  .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Hand: " + i), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});





});
});
