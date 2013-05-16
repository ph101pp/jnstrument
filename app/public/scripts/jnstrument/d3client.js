(function($, d3, window, document, undefined) {	
	var d3client = function(eventHandler){
		var dataStore = {};

		var width = 500,
		    height = 500;

		var svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(0,0)");

		// var svg = d3.select("body")
		//   .append("svg")
		//   .append("g")
		//     .attr("transform", "translate(32," + (400 / 2) + ")");


		// var resizeCanvas = function(){
		// 	d3.select("g").attr("transform", "scale(" + $("body").width()/900 + ")");
		// 	$("svg").height($("body").width()*0.618);
		// }
		// resizeCanvas();
		// d3.select(window)
		// 	.on("resize", resizeCanvas);


		eventHandler.addListener("all", function (data){
			data = normalize(data);
			var circle = svg.selectAll("circle")
				.data(data, function(d){ 
					return d.id;
				})
				.attr("fill", function(d){
					if(!d.new) return "#000";
					d.new=false;
					return "#f00";
				});
			
			circle.enter().append("circle")
				.attr("r", 5)
				.attr("cy", function() {
		  			return (Math.random() * height);
				})
		  		.attr("cx", function() {
		  			return Math.random() * width;
				})
				.attr("fill", "#f00");

			circle.exit()
				.attr("fill", "#f00");
				// .remove();
		});
		var normalize = function(data){
			dataStore[data.id]=data;
			dataStore[data.id].new = true;

			return $.map(dataStore, function(v, k){return v;});

		}
	}
	module.exports = function(eventHandler){
		return new d3client(eventHandler);
	}	
})(jQuery, d3, window, document)