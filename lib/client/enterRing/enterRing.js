require('./styles.css');
const d3 = require('d3');

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var width = 8000,
    height = 8000,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
    .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var partition = d3.partition();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return radius - 100; })
    .outerRadius(function(d) { return radius; });


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

function run(root, times) {    
  const timeIds =  Object.keys(times);
  
  timeIds.push('root');
  
  const timeStratus = d3.stratify()
    .id((d) => d)
    .parentId((d) => d === 'root' ? '' : 'root' )
  (timeIds);
    

console.log(timeStratus);
  const timeRoot = d3.hierarchy(timeStratus)
      .sum((d)=> 1 ||  times[d.data] );

  svg.selectAll("path")
      .data(partition(timeRoot).descendants())
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.data.split('-')[0]); })
      // .on("click", click)
    .append("title")
      .text(function(d) { return d.data.data.split('-')[0]; });
};

function click(d) {
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");


module.exports = run;
