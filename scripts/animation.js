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
    var htmlContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet consectetur dolor eget interdum. Proin nec posuere enim. Maecenas hendrerit tempor dui, sed ultricies enim egestas nec. Cras ac quam nisl. Morbi eget lacus in lorem consectetur tristique vel in lectus. Cras vehicula quis tellus quis consequat. Vivamus interdum quis dolor nec rhoncus."
    var circleData = [
          { "cx": 200, "cy": 200, "radius": 60, "color" : "green" },
          { "cx": 70, "cy": 70, "radius": 60, "color" : "purple" }];
        
        //Create the SVG Viewport
        var svgContainer = d3.select("body").append("svg")
                                             .attr("width",500)
                                             .attr("height",500);
                                             
        var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
       
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
                                });
       
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

