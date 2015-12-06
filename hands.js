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
        .domain([d3.min(pca_hands, function(d) { return d[0]; })/0.8,d3.max(pca_hands, function(d) { return d[0]; })*1.2])
        .range([0, width2]), // value -> display
    xMap = function(d) { return xScale(xValue(d[0]));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
// setup y
var yValue = function(d) { return d;}, // data -> value
    yScale = d3.scale.linear()
        .domain([d3.min(pca_hands, function(d) { return d[1]; })/0.8, d3.max(pca_hands, function(d) { return d[1]; })*1.2])
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

var tooltip = d3.select("#pca")
  .append("div")
  .style("background-color", "rgba(163, 171, 253, 0.6)")
  .style("font-Family", "")
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
      .attr("fill", "rgba(255,228, 196, 0.6)")
      .attr('transform', 'translate('+(pos.x/4-15)+','+pos.y/4+')');

var points = svg2.selectAll('circle')
  .data(pca_hands)
  .enter()
  .append('circle')
  .attr("cx", xMap)
  .attr("cy", yMap)
  .attr('r', 4)
  .on('click', function(d, i) {
  handy
    .transition()
    .duration(1250)
      .attr("d", lineFn(hands[i]));})
  .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Hand: " + i), svg2.style("cursor", "pointer");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    function new_cluster (data, figure, k, trans) {
        var scaledX = data.map(function(d){return xMap(d);});
        var scaledY = data.map(function(d){return yMap(d);});

        var scaleD  = d3.zip(scaledX, scaledY);

        var clusters = clusterfck.kmeans(scaleD, k);

        var colors = ["red", "green", "blue", "orange", "yellow", "purple", "grey", "brown"];
        if (trans == "new") {
            figure.selectAll(".cluster").remove();
        }
        for (e = 0; e < k; e++) {
            figure.append("g")
                .selectAll("path")
                .data(d3.geom.delaunay(clusters[e]))
                .enter().append("path")
                .attr("class", "cluster")
                .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
                .attr("id", e)
                .style("fill", colors[e])
                .style("opacity", 0.2);
        }

        svg2.selectAll("path")
            .on("mouseover", function(d, i){return tooltip.style("visibility", "visible").text("Cluster: " + (+this.id+1)), figure.style("cursor", "pointer");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    }



function new_pca(input1,input2) {
    var pc = [input1,input2];
    var pca_hands = d3.zip(hand_pca_data[pc[0]-1],hand_pca_data[pc[1]-1]);
    xScale.domain([d3.min(pca_hands, function(d) { return d[0]; })/0.8,d3.max(pca_hands, function(d) { return d[0]; })*1.2]);
    yScale.domain([d3.min(pca_hands, function(d) { return d[1]; })/0.8, d3.max(pca_hands, function(d) { return d[1]; })*1.2]);

    svg2.selectAll('circle')
        .data(pca_hands)
        .transition()
        .duration(1000)
        .attr("cx", xMap)
        .attr("cy", yMap);

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

    return pca_hands;
}

    d3.select("#outlier")

        .on("mouseover",   function(){
            svg2.selectAll(".cluster").remove();
            new_pca(1,2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(39===i) return 6;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(39===i) return 'red';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
                var input1 = document.getElementById("pcx").value;
                var input2 = document.getElementById("pcy").value;
                 svg2.selectAll(".cluster").remove();
                new_pca(input1,input2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(39===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(39===i) return 'white';
                });
        });

    d3.select("#outlier2")

        .on("mouseover",   function(){
            svg2.selectAll(".cluster").remove();
            new_pca(1,2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(30===i) return 6;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(30===i) return 'red';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
                var input1 = document.getElementById("pcx").value;
                var input2 = document.getElementById("pcy").value;
                 svg2.selectAll(".cluster").remove();
                new_pca(input1,input2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(30===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(30===i) return 'white';
                });
        });

            d3.select("#outlier3")

        .on("mouseover",   function(){
            svg2.selectAll(".cluster").remove();
            new_pca(1,2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(35===i) return 6;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(35===i) return 'red';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
                var input1 = document.getElementById("pcx").value;
                var input2 = document.getElementById("pcy").value;
                 svg2.selectAll(".cluster").remove();
                new_pca(input1,input2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(35===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(35===i) return 'white';
                });
        });

            d3.select("#outlier4")

        .on("mouseover",   function(){
            svg2.selectAll(".cluster").remove();
            new_pca(1,2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(37===i) return 6;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(37===i) return 'red';
                    else return 'white';
                });
        })
        .on("mouseout",  function () {
                var input1 = document.getElementById("pcx").value;
                var input2 = document.getElementById("pcy").value;
                 svg2.selectAll(".cluster").remove();
                new_pca(input1,input2);
            svg2.selectAll('circle')
                .attr("r", function(d,i){
                    if(37===i) return 4;
                    else return 4;
                })
                .style('fill',function(d,i){
                    if(37===i) return 'white';
                });
        });


    document.getElementById("button1").addEventListener('click', function () {
        var k = document.getElementById("km").value;
        var input1 = document.getElementById("pcx").value;
        var input2 = document.getElementById("pcy").value;
        var pca_hands_up = new_pca(input1,input2);
        new_cluster(pca_hands_up, svg2, k, "new");
        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        var el = svg2.selectAll('circle');
        el.moveToFront();
        });

  document.getElementById("button").addEventListener('click', function () {
    var input1 = document.getElementById("pcx").value;
    var input2 = document.getElementById("pcy").value;
      svg2.selectAll(".cluster").remove();
    new_pca(input1,input2);

});

    function calendarWeekHour(id, width, height, square, points)
    {

        var grid = d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart");

        var calData = randomData(width, height, square, grid);

        var row = grid.selectAll(".row")
            .data(calData)
            .enter().append("svg:g")
            .attr("class", "row");

        var col = row.selectAll(".cell")
            .data(function (d) { return d; })
            .enter().append("svg:rect")
            .attr("class", "cell")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", '#FFF')
            .style("stroke", '#555');
        randomData(width, height, square, grid, points);

    }


    function randomData(gridWidth, gridHeight, square, grid, points)
    {
        var data = new Array();
        var gridItemWidth = gridWidth / 25;
        var gridItemHeight = (square) ? gridItemWidth : gridHeight;
        var startX = gridItemWidth / 2;
        var startY = gridItemHeight / 2;
        var stepX = gridItemWidth;
        var stepY = gridItemHeight;
        var xpos = startX;
        var ypos = startY;
        var count = 0;
        var lineFn = d3.svg.line()
            .x(function(d) { return d[0]*55; })
            .y(function(d) { return d[1]*55; })
            .interpolate("basis");
        for (var index_a = 0; index_a < 2; index_a++)
        {
            data.push(new Array());
            for (var index_b = 0; index_b < 20; index_b++)
            {

                data[index_a].push({
                    width: gridItemWidth,
                    height: gridItemHeight,
                    x: xpos,
                    y: ypos,
                    count: count
                });
                grid.append("g")
                    .append("path")
                    .attr("d", lineFn(hands[count]))
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("opacity", "1")
                    .attr("fill", "rgba(255,228, 196, 0.6)")
                    .attr("id", count)
                    .attr('transform', 'translate('+(xpos)+','+ypos+')')
                    .on('mouseover', function() {
                        d3.select(this)
                            .style('fill', "black");
                        ind = +this.id;
                        svg2.selectAll('circle')
                            .attr("r", function(d,i){
                                if(ind===i) return 6;
                                else return 4;
                            })
                            .style('fill',function(d,i){
                                if(ind===i) return 'red';
                                else return 'white';
                            });
                    })
                    .on('mouseout', function() {
                        d3.select(this)
                            .style("fill", "rgba(255,228, 196, 0.6)");
                        ind = +this.id;
                        svg2.selectAll('circle')
                            .attr("r", function(d,i){
                                if(ind===i) return 4;
                                else return 4;
                            })
                            .style('fill',function(d,i){
                                if(ind===i) return 'white';
                            });
                    })
                xpos += stepX;
                count += 1;
            }
            xpos = startX;
            ypos += stepY;
        }
        return data;
    }
    calendarWeekHour('#all_hands', 1800, 200, true, points);


});
});
