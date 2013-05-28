(function($, THREE, window, document, undefined) {	
	var test = function(){			
		var time = Date.now();
		var timer =0;
		var iterations = 10000000;
		var instance1 = new (require("./plvl3.js"))();
		var instance2 = new (require("./lvl3.js"))();
		var bla;

		console.log(instance1, instance2);



		for( var i=0; i<iterations; i++)
			bla = instance1 instanceof require("./plvl3.js");
		
		timer = Date.now()-time;
		console.log(timer, timer/iterations);
		time= Date.now();
		

		for( var i=0; i<iterations; i++)
			bla = instance2.instanceof(require("./lvl3.js"));


		timer = Date.now()-time;
		console.log(timer, timer/iterations);


	}
///////////////////////////////////////////////////////////////////////////////	
	// module.exports = function(){
	// 	return new guitarHeroVisual();
	// }
///////////////////////////////////////////////////////////////////////////////
	$(document).ready(function(){
		test(); // Start
	});
})(jQuery, THREE, window, document)