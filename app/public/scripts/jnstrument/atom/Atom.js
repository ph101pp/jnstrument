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
			globalTick.addListener(env.tick.bind(env));

			var geometry =  new THREE.SphereGeometry(10,16,16);
			var material = new THREE.LineBasicMaterial( { color: 0xFF3333, opacity: 1.0} );
			var material2 = new THREE.LineBasicMaterial( { color: 0xFF3333, opacity: 1.0} );
			var element = new (require("./CollisionElement.js"))( geometry, material );
			var element2 = new THREE.Mesh( geometry, material2 );


			element.position.set(env.width/2,env.height/2,0);
			element2.position.set(env.width/3,env.height/3,0);

			console.log(element instanceof THREE.Mesh);
			
			env.scene.add(element);
			env.scene.add(element2);


			var ray =  new THREE.Vector3(-env.width/6, -env.height/6);
			var caster = new THREE.Raycaster();

			globalTick.activate();

			$(window).bind("click", function(){

				caster.set(element.position, ray);

				var hits = caster.intersectObjects([element2]);

				console.log(hits);

				for(var i=0; i<hits.length; i++) hits[i].object.material.color.setHex(0x0000ff);

				console.log(element);

				// element.scale.set(10,10,10);
				// element2.material.color.setHex(0x0000ff);



			 	// element.geometry.verticesNeedUpdate = true;
			 	// element.geometry.normalsNeedUpdate = true;
			 	// element.geometry.uvsNeedUpdate = true;
			 	// element.geometry.tangentsNeedUpdate = true;
			 	// element.geometry.morphTargetsNeedUpdate = true;
			 	// element.geometry.lineDistancesNeedUpdate = true;
			 	// element.geometry.elementsNeedUpdate = true;
			 	// element.geometry.buffersNeedUpdate = true;
			 	// element.geometry.colorsNeedUpdate = true;
			 	// element.geometry.dynamic = true;



			})
			
		}
		this.remove = function() {
			globalTick.deactivate();



		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(atom);
})(jQuery, THREE, window, document)