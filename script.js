var artifact_array = []

var storageRef = storage.ref();

db.collection("Artifacts")
.get()
.then(function(querySnapshot) {
    if (querySnapshot.empty) {
        console.log('no documents found');
    } else {
        querySnapshot.forEach(function(doc) {
            // console.log(doc.data());
            artifact_snap = doc.data()
            artifact_snap["fid"] = doc.id
            artifact_array.push(artifact_snap);
              
        });
    }
    
    var filter_fields = []
    var children = [];
    selected_filter = "Collection";
    // console.log(selected_filter);
    for (var artifact = 0; artifact < artifact_array.length; artifact++) {
        if (typeof(artifact_array[artifact][selected_filter]) != typeof("nan")) {
            artifact_array[artifact][selected_filter] = "NA";
            
        }
        filter_fields.push(artifact_array[artifact][selected_filter])
    }

    // console.log(filter_fields);    
    var unique_fields = filter_fields.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    // console.log(unique_fields);
    for (var name = 0; name < unique_fields.length; name++) {

        var child_artifacts = []
        for (var artifact = 0; artifact < artifact_array.length; artifact++) {
            if (artifact_array[artifact][selected_filter] == unique_fields[name]) {
                child_artifacts.push(artifact_array[artifact])
            }
        }
        var child_json = {
            "name" : unique_fields[name],
            "children" : child_artifacts,
            "parent" : "CSMVS"
        }
        // console.log(child_json)
        children.push(child_json)
    }
    // console.log(children);
    var artifact_json = {
        // "_children": null,
        "name": "CSMVS",
        "img-thumb": "https://career.webindia123.com/career/institutes/aspupload/Uploads/all-states/18914/logo.jpg",
        "children": children
    }
    // console.log(artifact_json)
    createGraph(artifact_json);
    // $('#filter').value = "Collection"
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});
var selected_filter;
var i = 0;

var maxNodeSize = 100;
var tcBlack = "#130C0E";

// rest of vars
var w = window.innerWidth,
    h = window.innerHeight ,
    x_browser = 20,
    y_browser = 25;
var count = true;
var root;
var centered;
var force = d3.layout.force(); 
// console.log(w,h);

 var svg = d3.select("body").append("svg").attr("width", w).attr("height", h).call(d3.behavior.zoom().scaleExtent([0.5,5]).on("zoom", function () {
    vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
  }))

 var vis = svg.append("svg:g")
                .attr("overflow","visible")

$('#filter').change(function() {
    var filter_fields = []
    var children = [];
    selected_filter = $(this).val();
    // console.log(selected_filter);
    for (var artifact = 0; artifact < artifact_array.length; artifact++) {
        if (typeof(artifact_array[artifact][selected_filter]) != typeof("nan")) {
            artifact_array[artifact][selected_filter] = "NA";
            
        }
        filter_fields.push(artifact_array[artifact][selected_filter])
    }

    // console.log(filter_fields);    
    var unique_fields = filter_fields.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    // console.log(unique_fields);
    for (var name = 0; name < unique_fields.length; name++) {

        var child_artifacts = []
        for (var artifact = 0; artifact < artifact_array.length; artifact++) {
            if (artifact_array[artifact][selected_filter] == unique_fields[name]) {
                child_artifacts.push(artifact_array[artifact])
            }
        }
        var child_json = {
            "name" : unique_fields[name],
            "children" : child_artifacts,
            "parent" : "CSMVS"
        }
        // console.log(child_json)
        children.push(child_json)
    }
    // console.log(children);
    var artifact_json = {
        // "_children": null,
        "name": "CSMVS",
        "img-thumb": "https://career.webindia123.com/career/institutes/aspupload/Uploads/all-states/18914/logo.jpg",
        "children": children
    }
    // console.log(artifact_json)
    createGraph(artifact_json);
    
});

function createGraph(artifact_json) {
         root = artifact_json;
         root.fixed = true;
         root.x = w / 2;
         root.y = h / 2;
        
        
               // Build the path
         var defs = vis.insert("svg:defs")
             .data(["end"]);
        
        
         defs.enter().append("svg:path")
             .attr("d", "M 100 350 q 150 -300 300 0");
        
            update();

function update() {

    
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);
    // console.log(nodes);
    // console.log(links)
  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        // .gravity(0.05)
    .charge(-1500)
    .linkDistance(100)
    .friction(0.5)
    .linkStrength(function(l, i) {return 1; })
    .size([w, h])
    .on("tick", tick)
        .start();
 
   var path = vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });
 
    path.enter().insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#ccc");
 
 
  // Exit any old paths.
  path.exit().remove();
 
 
 
  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { 
        // console.log(d.id)
        return d.id;
     });
 
 
  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node active")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click.enter", click)
    //   .on("click.center", clicked)
      .call(force.drag);
      
      
 
  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return 10; })
      .style("fill", "#ccc"); 
   
  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href", function(d) { return d["img-thumb"]; })
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)
        .style("z-index", 5);
  

  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          // Append hero text
          .on( 'click', function (d) {

              d3.select("#content").style("display","block");
              d3.select("#artifact-thumb-image").attr("src",d["img-thumb"]);
              d3.select("#artifact-full-image").attr("src",d["img-storage"]);
              d3.select("#artifact-title").html(d.Title);
              createCard("#artifact-provenance", d.Provenance);
              createCard("#artifact-period" , d.Period); 
              createCard("#artifact-short-description" , d["Short Description"]);
              createCard("#artifact-display-status" , d["Display Status"]);
              createCard("#artifact-long-description" , d["Long Description"]); 
              if (d["wiki-title"])
                d3.select("#artifact-link").attr("href","https://en.wikipedia.org/wiki/" + d["wiki-title"].replace(/ /g,"_"))
                    .html("Read More");

        })
          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });
  
  // Append hero name on roll over next to the node as well
  nodeEnter.append("text")
      .attr("class", "nodetext")
    //   .attr("class", function(d) { if (d.Title) {return "nodetext";} else {return "filternode"}})
      .attr("x", x_browser)
      .attr("y", y_browser+15)
      .attr("fill", tcBlack)
      .style("z-index", 6)
      .text(function(d) { if (d.Title) {return d.Title} else {return d.name; }});
 
 
  // Exit any old nodes.
  node.exit().remove();
 
 
  // Re-select for update.
  path = vis.selectAll("path.link");
  node = vis.selectAll("g.node");
 
function tick() {
 
 
    path.attr("d", function(d) {
 
     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           return   "M" + d.source.x + "," 
            + d.source.y 
            + "A" + dr + "," 
            + dr + " 0 0,1 " 
            + d.target.x + "," 
            + d.target.y;
  });
    node.attr("transform", nodeTransform);    
  }


}
function clicked(d) {
    var x, y, k;
  
    if (d && centered !== d) {
      x = d3.event.x;
      y = d3.event.y;
      k = 4;
      centered = d;
    } else {
      x = w/2;
      y = h/2;
      k = 1;
    //   console.log("hi");
      centered = null;
    }
    // console.log(x,y,centered)
    // console.log(d);
  
    vis.selectAll("g.node")
        .classed("active", centered && function(d) { return d === centered; });
  
    vis.transition()
        .duration(750)
        .attr("transform", "translate(" + w/2 + "," + h/2+ ") scale(" + 1+ ")translate(" + -x + "," + -y + ")")
        // .style("stroke-width", 1.5 / k + "px");
        update();
  }
function nodeTransform(d) {
    // d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    //   d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
      update();
      
      return "translate(" + d.x + "," + d.y + ")";
     }
   
  /**
   * Toggle children on click.
   */ 
  function click(d) {
    //   console.log(d)
    if (d.children) {
      d._children = d.children;
      d.children = null;
      
    } else {
      d.children = d._children;
      d._children = null;
      if (!d["Display Status"]) {
        $.ajax({
            url: "https://rabbit-hole-backend.herokuapp.com/current",
            type: "post",
            data: JSON.stringify({"title": d["wiki-title"]}) ,
            contentType: 'application/json',
            success: function (response) {
                d.name = d.Title;
                data = response
                d["Long Description"] = response["summary"]
                createCard("#artifact-long-description" ,d["Long Description"]);
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
      }
      if (d["wiki-title"]) {
        $.ajax({
            url: "https://rabbit-hole-backend.herokuapp.com/adjacent?title=" + d["wiki-title"],
            cache: false,
            // type: "post",
            // data: JSON.stringify({"title": d["wiki-title"]}) ,
            // contentType: 'application/json',
            success: function (response) {
                d.name = d.Title;
                data = response
                // console.log(data)
                if (data != "An alternative method of recommendation is under development") {
                    new_children = []
                    for (var prop in data) {
                        var im;
                        if (data[prop] != null) {
                            im = data[prop]["img-thumb"];
                            im2 = data[prop]["img-storage"]
                        }
                        else {
                            im = "https://agilitytoday.com/img/thumb_image_not_available.png"
                        }
                        new_children.push({"Title":prop, "img-thumb":im, "wiki-title":prop, "name":prop, "img-storage": im2});
                    }
                    d.children = new_children;
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
      }
      else {
          console.log("Incompatible node")
      }
      
      
    }
   
    update();
  }

   
  /**
   * Returns a list of all nodes under the root.
   */ 
  function flatten(root) {
    var nodes = []; 
      
    function recurse(node) {
      if (node.children) 
        node.children.forEach(recurse);
      if (!node.id) {
        node.id = ++i;
      //   console.log(node.Title + " " + node.id)      
      }
      nodes.push(node);
    }
   
    recurse(root);
  //   update();
  // console.log(nodes)
    return nodes;
  } 
};
/**
 * Gives the coordinates of the border for keeping the nodes inside a frame
 * http://bl.ocks.org/mbostock/1129492
 */ 
document.getElementById("close-button").addEventListener("click",function() {
    document.getElementById("content").style.display="none";
});

    
function createCard(ctag, ccontent) {
    if (ccontent) {
        d3.select(ctag).select(function() {return this.parentNode;})
                .select(function() {return this.parentNode;})
                .select(function() {return this.parentNode;})
                .classed("hidden", false);
        d3.select(ctag).html(ccontent);
    }
    else {
        d3.select(ctag).select(function() {return this.parentNode;})
        .select(function() {return this.parentNode;})
        .select(function() {return this.parentNode;})
        .classed("hidden", true);
    }
    
    // d3.select("#content").append("div").attr("class", "card-body") 
    //                      .append("a").attr("class", "href-link").attr("href", clink)              
}

$(window).on('load',function(){
    $('#myModal').modal('show');
});
