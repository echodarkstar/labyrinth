// d3.selectAll("svg").transition()
//     .duration(750)
//     .delay(function(d, i) { return i * 10; })
//     .attr("r", function(d) { return Math.sqrt(d * 10); });

    // d3.select("body").transition()
    // .style("background-color", "black");

//     d3.select("body")
//   .selectAll("svg")
//   .data([4, 8, 15, 16, 23, 42])
//   .enter().append("svg")
//     .text(function(d) { return "I’m number " + d + "!"; })
//     .attr("style","background-color:red");
var active=1;
var htmlContent="<h1>Lorem ipsum dolor sit amet,</h1>"
var circleData = [
    { "cx": 200, "cy": 200, "radius": 60, "color" : "green" },
    { "cx": 300, "cy": 300, "radius": 60, "color" : "purple" }];

//Create the SVG Viewport
var svgContainer = d3.select("body").append("svg")
                                        .attr("width",800)
                                        .attr("height",680);
                                        
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

var contentWindow = d3.select("body").append("div")
.attr("class","contentWindow")
// .attr("class","col-md-2")
.style("opacity",0)
.attr("id","contentWindow");

var zoom = d3.zoom()
.scaleExtent([1, 10])
.on("zoom", zoomed);

function zoomed() {
    circles.attr("transform", d3.event.transform);
    console.log(d3.event.transform);
}


//Add circles to the svgContainer
var circles = svgContainer.selectAll("circle")
                            .data(circleData)
                            .enter()
                            .append("circle")
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
                        .on("click", function(){
                            
                            if(active==1){
                                contentWindow.transition()
                                .style("opacity",1);
                                contentWindow.html(htmlContent)
                                active=0;
                            } else {
                                contentWindow.transition()
                            .style("opacity",0);
                            contentWindow.html(htmlContent)
                            active=1;
                            }
                            
                        })
                        .call(zoom);

//Add the circle attributes
var circleAttributes = circles
                        .attr("cx", function (d) { return d.cx; })
                        .attr("cy", function (d) { return d.cy; })
                        .attr("r", function (d) { return d.radius; })
                        .style("fill", function (d) { return d.color; });

//Add the SVG Text Element to the svgContainer
var text = svgContainer.selectAll("text")
                        .data(circleData)
                        .enter()
                    //    .append("text");

//Add SVG Text Element Attributes
var textLabels = text
                .attr("x", function(d) { return d.cx; })
                .attr("y", function(d) { return d.cy; })
                .text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red")
                .attr("text-anchor","middle");

                