require('./styles.css');
const d3 = require('d3');

module.exports = run;

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    
const height = y*10;
const width = x;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  // .append("g")
    // .attr("transform", "translate(-" + width / 2 + ",-" + (height / 2) + ")");

var partition = d3.partition()
    .size([height, width])
    .padding(0)
    .round(false);
 
var format = d3.format(",d");

 
var color = d3.scaleOrdinal(d3.schemeCategory20);
   
function run(root, times) {
  partition(root);

  var cell = svg
    .selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d, i) { 
        // d.offset=0;
        // if(d.parent) {
        //   const startTime = d.data.data[1];
          
        //   const parentStartTime = d.parent.data.data[1];
        //   const parentDuration = times[d.parent.data.data[4]];
        //   const parentHeight = d.parent.x1 - d.parent.x0;
      
          
        //   const offset = (parentHeight/parentDuration)*(startTime-parentStartTime);
          
        //   d.offset = d.parent.x0+d.parent.offset+offset;
          
        // }
        return "translate(" +d.y0+ "," +d.x0+ ")"; 
      });
      
  cell.append("rect")
      .attr("id", function(d) { return "rect-" + d.id; })
      .attr("width", function(d) { return d.y1 - d.y0; })
      .attr("height", function(d) { return d.x1 - d.x0; })
    // .filter(function(d) { return !d.children; })
      .style("fill", function(d) {return color(d.data.data[3]); });


  cell.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#rect-" + d.id + ""; });

  cell.append("title")
      .text(function(d) { return d.data.data[3] + "\n" + format(d.value); });
};