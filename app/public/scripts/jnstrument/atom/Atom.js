(function($, THREE, window, document, undefined) {	
	var atom = function(){
		var globalTick, env, loop, socket;

		this.construct = function(_socket, _loop){		
			socket = _socket;
			loop = _loop;	
			globalTick = 	new (require("./GlobalTicker.js"))(loop);
		}

		this.initialize = function(container) {
			env = 	new (require("./Environment.js"))($(container));
			globalTick.addListener(env.render.bind(env));

			var element1 = new (require("./FunctionElement.js"))();
			var element2 = new (require("./FunctionElement.js"))();
			var element3 = new (require("./FunctionElement.js"))();
			var element4 = new (require("./FunctionElement.js"))();
			var element5 = new (require("./FunctionElement.js"))();

			console.log(element1,element1.instanceof(require("./CollisionElement.js")));
			// console.log(element, element instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);


			env.scene.add(element1);
			env.scene.add(element2);
			env.scene.add(element3);
			env.scene.add(element4);
			env.scene.add(element5);
			
			
			element1.position.set(0,0,0);
			element2.position.set(-1,0,0);
			element3.position.set(0, 100 ,0);
			element4.position.set(100,0,0);
			element5.position.set(0, -100,0);

			var CollisionDetection = new (require("./CollisionDetection.js"))();
			
			CollisionDetection.addRay(new THREE.Vector3(0, -1, 0));
			CollisionDetection.addRay(new THREE.Vector3(0, 1, 0));
			CollisionDetection.addRay(new THREE.Vector3(1, 0, 0));
			CollisionDetection.addRay(new THREE.Vector3(-1, 0, 0));

			CollisionDetection.addElement(element1);
			CollisionDetection.addElement(element2);
			CollisionDetection.addElement(element3);
			CollisionDetection.addElement(element4);
			CollisionDetection.addElement(element5);



			var ray =  new THREE.Vector3(0,-1,0);
			var caster = new THREE.Raycaster();

			globalTick.activate();

			$(window).bind("click", function(){


				CollisionDetection.testElement(element1);




				// var elements = [element3, element2];

				// console.log(element.position, ray, elements);
				// caster.set(element.position, ray);

				// var hits = caster.intersectObjects(elements);

				//  console.log(hits);

				// for(var i=0; i<hits.length; i++) hits[i].object.material.color.setHex(0x0000ff);

				// //console.log(element);

				// element.scale.set(10,10,10);
				// element2.material.color.setHex(0x0000ff);



			 // 	// element.geometry.verticesNeedUpdate = true;
			 // 	// element.geometry.normalsNeedUpdate = true;
			 // 	// element.geometry.uvsNeedUpdate = true;
			 // 	// element.geometry.tangentsNeedUpdate = true;
			 // 	// element.geometry.morphTargetsNeedUpdate = true;
			 // 	// element.geometry.lineDistancesNeedUpdate = true;
			 // 	// element.geometry.elementsNeedUpdate = true;
			 // 	// element.geometry.buffersNeedUpdate = true;
			 // 	// element.geometry.colorsNeedUpdate = true;
			 // 	// element.geometry.dynamic = true;



			})
			
		}
		this.remove = function() {
			globalTick.deactivate();



		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(atom);
})(jQuery, THREE, window, document)