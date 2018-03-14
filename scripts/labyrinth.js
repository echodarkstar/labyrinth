var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,		// canvas width
    height = window.innerHeight;		// canvas height

var scale = 1.0;
var htmlContent="<h1>Lorem ipsum dolor sit amet,</h1>"
var active=1;

var zoom = d3.behavior.zoom()
    .scale(scale)
    .scaleExtent([1, 5])
    .on("zoom", zoomed);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "outline: medium solid red;")
    .call(zoom);

var container = svg.append("g")
    .attr("id", "container")
    .attr("transform", "translate(0,0)scale(1,1)");

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    
var contentWindow = d3.select("body").append("div")
    .attr("class","contentWindow")
    // .attr("class","col-md-2")
    .style("opacity",0)
    .attr("id","contentWindow");
    
var bbox, viewBox, vx, vy, vw, vh, defaultView;

var clickScale = 2.0;		// scale used when circle is clicked

// class Node {
//         constructor() 
// }
d3.select("#reset").on("click", reset);
d3.tsv("circles.tsv", circletype, function(error, circles) {
  circle = container.append("g")
    .attr("id", "circles")
    .selectAll("circle")
      .data(circles)
    .enter().append("circle")
      .attr("r",  function(d) { return d.r; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return d.fill; })
//       .attr("perserveAspectRatio", xMinYMid)
      .on("mouseover", function(d) {		
        div.transition()		
                    
            .style("opacity", .9);		
        div	.html(htmlContent)
        
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
        })					
        .on("mouseout", function(d) {		
                div.transition()		
                        
                .style("opacity", 0);	
        })
        .on("click.content", function(d){
                
                if(active==1){
                contentWindow.transition()
                .style("opacity",1);
                console.log(contentWindow)
                contentWindow.html(htmlContent)
                active=0;
                } else {
                contentWindow.transition()
                .style("opacity",0);
                contentWindow.html(htmlContent)
                active=1;
                }
                
        })
        .on("click.center", clicked);
        
  bbox = container.node().getBBox();
  vx = bbox.x;		// container x co-ordinate
  vy = bbox.y;		// container y co-ordinate
  vw = bbox.width;	// container width
  vh = bbox.height;	// container height
  defaultView = "" + vx + " " + vy + " " + vw + " " + vh;
  svg
	.attr("viewBox", defaultView)
	.attr("preserveAspectRatio", "xMidYMid meet")
        .call(zoom);
});

/*
getTransform(node, scale) finds the correct translation co-ordinates in order
to center the circle (node) into the Viewbox. This depends on the scale.
 - bbox is the bounding box of the circle (node)
 - vx is the top-left x-cordinate of the Viewbox
 - vy is the top-left y-cordinate of the Viewbox
 - tx is the calculated movement in the x co-ordinate 
 - ty is the calculated movement in the y co-ordinate 
 - xScale is the scale of the SVG with respect to the default Viewbox
*/
function getTransform(node, xScale) {
  bbox = node.node().getBBox();
  var bx = bbox.x;
  var by = bbox.y;
  var bw = bbox.width;
  var bh = bbox.height;
  var tx = -bx*xScale + vx + vw/2 - bw*xScale/2;
  var ty = -by*xScale + vy + vh/2 - bh*xScale/2;
  return {translate: [tx, ty], scale: xScale}
}

function clicked(d, i) {
  if (d3.event.defaultPrevented) {
	return; // panning, not clicking
  }
  node = d3.select(this);
  var transform = getTransform(node, clickScale);
  container.transition().duration(1000)
     .attr("transform", "translate(" + transform.translate + ")scale(" + transform.scale + ")");
  zoom.scale(transform.scale)
      .translate(transform.translate);
  scale = transform.scale;
}

function circletype(d) {
  d.x = +d.x;
  d.y = +d.y;
  d.r = +d.r;
  return d;
}

function zoomed() {
  var translateX = d3.event.translate[0];
  var translateY = d3.event.translate[1];
  var xScale = d3.event.scale;
  container.attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + xScale + ")");
}

function reset() {
  scale = 1.0;
  container.attr("transform", "translate(0,0)scale(1,1)");
  zoom.scale(scale)
      .translate([0,0]);
}

d3.select(self.frameElement).attr("margin", 10);