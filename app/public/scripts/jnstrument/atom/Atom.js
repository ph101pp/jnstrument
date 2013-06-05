(function($, THREE, window, document, undefined) {	
	var atom = function(){
		var globalTick, env, loop, socket, that;
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_socket, _loop){		
			socket = _socket;
			loop = _loop;	
			that = this;
			globalTick = new (require("./GlobalTicker.js"))();
		}
///////////////////////////////////////////////////////////////////////////////
		this.initialize = function(container) {
			env = 	new (require("./Environment.js"))($(container));
			loop.addListener(globalTick.tick);
			loop.addListener(env.render);

			this.init();
		}
///////////////////////////////////////////////////////////////////////////////
		this.init = function() {

//			var geometry =  new THREE.CircleGeometry(10,16);
//			var geometry =  new THREE.CubeGeometry( 10, 10, 10 );

			var element1 = new (require("./FunctionElement.js"))();
			var element2 = new (require("./FunctionElement.js"))();
			var element3 = new (require("./FunctionElement.js"))();
			var element4 = new (require("./FunctionElement.js"))();
			var element5 = new (require("./FunctionElement.js"))();

			//	console.log(element5, element5.instanceof(require("./CollisionElement.js")));
			// console.log(element, element instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);

			element1.outboundEvent(element2);
			element1.outboundEvent(element2);
			element1.outboundEvent(element2);


			element1.worldReference(env);
			element2.worldReference(env);
			element3.worldReference(env);
			element4.worldReference(env);
			element5.worldReference(env);


 			env.scene.add(element1);
			env.scene.add(element2);
			env.scene.add(element3);
			env.scene.add(element4);
			env.scene.add(element5);
			
		//	element1.actionRadius=300;
			
			element1.position.set(0,0,0);
			element2.position.set(-100,0,0);
			element3.position.set(0, 50 ,0);
			element4.position.set(100,0,0);
			element5.position.set(0, -100,0);


			globalTick.addListener("update", element1.update);
			globalTick.addListener("update", element2.update);
			globalTick.addListener("update", element3.update);
			globalTick.addListener("update", element4.update);
			globalTick.addListener("update", element5.update);



			env.collisionDetection = new (require("./CollisionDetection.js"))();	
			var rayCount = 50;
			var ray = new THREE.Vector3(0, 1, 0);
			for(var i =0; i<rayCount; i++ )	
				env.collisionDetection.addRay(new THREE.Vector3(Math.cos( (i*360/rayCount)*(Math.PI/180) ), Math.sin( (i*360/rayCount)*(Math.PI/180) ), 0));

			env.collisionDetection.addElement(element1);
			env.collisionDetection.addElement(element2);
			env.collisionDetection.addElement(element3);
			env.collisionDetection.addElement(element4);
			env.collisionDetection.addElement(element5);



			// var ray =  new THREE.Vector3(0,-1,0);
			// var caster = new THREE.Raycaster();
			globalTick.activate();

				globalTick.addListener("calculate", function(){
					env.collisionDetection.testElements(true, true);
				});
			$(window).bind("click", function(){

				//CollisionDetection.testElements(true, true);

			element1.outboundEvent(element2);
			element1.outboundEvent(element2);			
			element2.inboundEvent(element1);		
			element2.inboundEvent(element1);




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
///////////////////////////////////////////////////////////////////////////////
		this.remove = function() {
			loop.removeListener(globalTick.tick);
			loop.removeListener(env.render);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(atom);
})(jQuery, THREE, window, document)