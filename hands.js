
var margin = {top:20 , right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#hand").append("svg")
    .attr("width", width - 300)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

var width2 = width - 150;
var svg2 = d3.select("#pca").append("svg")
    .attr("width", width2)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");


d3.text("hands.csv", function(text) {
  var hand_data = d3.csv.parseRows(text).map(function(row) {
    return row.map(function(value) {
      return +value;

    });
  });
d3.text("hands_pca.csv", function(text) {
  var hand_pca_data = d3.csv.parseRows(text).map(function(col, i) {
    return d3.csv.parseRows(text).map(function(row) {
      return +row[i]
    })
  });


var hands=[];

for (i in hand_data) {

  var shape = hand_data[i];
  hands[i] = d3.zip(shape.slice(0, 56),shape.slice(56, 113));

};



var pc = [1,2];

var pca_hands = d3.zip(hand_pca_data[pc[0]-1],hand_pca_data[pc[1]-1]);

var pos = {x: 250, y: 230, xh: 60, yh: 85};
var circ_r = 200;
var scale_h = width/3;

	// Scale the range of the data

  var xValue = function(d) { return d;}, // data -> value
    xScale = d3.scale.linear()
        .domain([d3.min(pca_hands, function(d) { return d[0]-0.05; }),d3.max(pca_hands, function(d) { return d[0]; })])
        .range([0, width2]), // value -> display
    xMap = function(d) { return xScale(xValue(d[0]));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
// setup y
var yValue = function(d) { return d;}, // data -> value
    yScale = d3.scale.linear()
        .domain([d3.min(pca_hands, function(d) { return d[1]-0.05; }), d3.max(pca_hands, function(d) { return d[1]; })])
        .range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d[1]));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");



	// Add the X Axis
svg2.append("g")
		.attr("class", "x_axis")
		.attr("transform", 'translate(0, '+ height +')')
		.call(xAxis);
    svg2.append("text")
    .attr("class", "xlabel")
    .attr("x", width2 - 40)
    .attr("y", height - 6)
    .style("text-anchor", "end")
    .text("PC"+pc[0]);

	// Add the Y Axis
svg2.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
  svg2.append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("PC"+pc[1]);



var scaledX = pca_hands.map(function(d){return xMap(d);}) 
var scaledY = pca_hands.map(function(d){return yMap(d);}) 

var scaleD  = d3.zip(scaledX, scaledY)

var clusters = clusterfck.kmeans(scaleD, 3);


svg2.append("g")
  .selectAll("path")
    .data(d3.geom.delaunay(clusters[0]))
  .enter().append("path")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .style("fill", "red")
    .style("opacity", 0.2)
     .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Cluster: " + 1), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});;


svg2.append("g")
  .selectAll("path")
    .data(d3.geom.delaunay(clusters[1]))
  .enter().append("path")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .style("fill", "green")
        .style("opacity", 0.2)

     .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Cluster: " + 2), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});;


clust3 = svg2.append("g")
  .selectAll("path")
    .data(d3.geom.delaunay(clusters[2]))
  .enter().append("path")
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .style("fill", "blue")
        .style("opacity", 0.2)
     .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Cluster: " + 3), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});;



var tooltip = d3.select("#pca")
  .append("div")
  .style("background-color", "rgba(163, 171, 253, 0.6)")
  .style("font-Family", "Impact,Charcoal,sans-serif")
  .style("background-opacity", "0.5")
  .style("position", "absolute")
  .style("visibility", "hidden");

  var lineFn = d3.svg.line()
      .x(function(d) { return d[0]*scale_h; })
      .y(function(d) { return d[1]*scale_h; })
      .interpolate("basis");

svg.append('circle')
    .attr("r", width/4)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr('transform', 'translate('+pos.x+','+pos.y+')');
var handy = svg.append("g")
    .append("path")
      .attr("d", lineFn(hands[20]))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("opacity", "1")

      .attr("fill", "rgba(238, 203, 173, 0.6)")
      .attr('transform', 'translate('+(pos.x/4-15)+','+pos.y/4+')');


  points = svg2.selectAll('circle')
  .data(pca_hands)
  .enter()
  .append('circle')
  .attr("cx", xMap)
  .attr("cy", yMap)
  .attr('r', 4)
  .style("fill", "white")
  .on('click', function(d, i) {
  handy
    .transition()
    .duration(1000)
    .attr("d", lineFn(hands[i]));})

  .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Hand: " + (i+1)), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


    

  document.getElementById("button").addEventListener('click', function () {
    var input1 = document.getElementById("pcx").value;
    var input2 = document.getElementById("pcy").value;
    var pc = [input1,input2];
    var pca_hands = d3.zip(hand_pca_data[pc[0]-1],hand_pca_data[pc[1]-1]);

    xScale.domain([d3.min(pca_hands, function(d) { return d[0]-0.05; }),d3.max(pca_hands, function(d) { return d[0]; })]);
    yScale.domain([d3.min(pca_hands, function(d) { return d[1]-0.05; }), d3.max(pca_hands, function(d) { return d[1]; })]);
    svg2.selectAll('circle')
        .data(pca_hands)
        .transition()
        .duration(1000)
        .attr("cx", xMap)
        .attr("cy", yMap);

var scaledX = pca_hands.map(function(d){return xMap(d);}) 
var scaledY = pca_hands.map(function(d){return yMap(d);}) 

var scaleD  = d3.zip(scaledX, scaledY)

var clusters = clusterfck.kmeans(scaleD, 3);
console.log(clusters)

d3.select("path")
  .data(clusters[2])
  .transition()
  .duration(1000)


    svg2.select(".x_axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    svg2.select(".xlabel")
        .text("PC"+pc[0]);
    // Update Y Axis
    svg2.select(".y_axis")
        .transition()
        .duration(1000)
        .call(yAxis);
    svg2.select(".ylabel")
        .text("PC"+pc[1]);

});
});
});
