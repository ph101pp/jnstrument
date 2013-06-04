(function($, THREE, window, document, undefined) {	
	var test = function(){			
		var timer =0;
		var time,i;
		var iterations =5000;

		// console.log(new THREE.SphereGeometry);
		// console.log(new THREE.Mesh);

		var Class1 = require("../Class.js").extend(THREE.Mesh).extend({test : function(){console.log("blabla")}}).extend({construct : function(){console.log("hallo")},test : function(){console.log("blub"); this._super()}});
		var instance1 = new Class1;
		var plvl3 = require("./plvl3.js");
		instance1.test();

		// var Class2 = require("../Class.js").extend(THREE.Mesh).extend(THREE.SphereGeometry);
		// var instance2 = new Class2;
		var lvl3 = require("./lvl3.js");

		// var Class3 = require("./pcaClass.js")(THREE.Mesh).extend(THREE.SphereGeometry);
		//  var instance3 = new Class3;

		console.log(instance1, instance1 instanceof THREE.Mesh, instance1 instanceof THREE.SphereGeometry, instance1.instanceof(THREE.SphereGeometry), instance1.instanceof(THREE.Mesh), instance1.instanceof(Class1));
//		console.log(instance2, instance2 instanceof THREE.Mesh, instance2 instanceof THREE.SphereGeometry, instance2.instanceof(THREE.SphereGeometry), instance2.instanceof(THREE.Mesh), instance2.instanceof(Class2), instance2.instanceof(Class1));
		// console.log(instance3, instance3 instanceof THREE.Mesh, instance3 instanceof THREE.SphereGeometry);

		// var instance2 = new (require("./plvl3.js"))();
		// var bla = require("./lvl3.js");

		var construct = function(){};
		time = Date.now();
		for(i=0; i<iterations; i++)
			(["object", "function"].indexOf(typeof construct) < 0)
		
		timer = Date.now()-time;
		console.log(timer, timer/iterations);
		time= Date.now();
		

		for(i=0; i<iterations; i++)
			(typeof construct === "object" || typeof construct === "function")


		timer = Date.now()-time;
		console.log(timer, timer/iterations);
		// time= Date.now();
		

		// for(i=0; i<iterations; i++)
		// 	new Class3()


		// timer = Date.now()-time;
		// console.log(timer, timer/iterations);

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