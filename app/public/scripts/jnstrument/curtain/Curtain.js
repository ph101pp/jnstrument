(function($, THREE, window, document, undefined) {	
	var curtain = function(){
		var globalTick, world, loop, socket, that;
		var elements = new (require("./ObjectStore"));
		var stage;

		var msPerFunction = 3000;

		this.attributes = {
			events : {type:"fv1",value:[]},
		} 

		var material =  new THREE.ShaderMaterial({ attributes:this.attributes, vertexShader:AEROTWIST.Shaders.CurtainElement.vertex, fragmentShader:AEROTWIST.Shaders.CurtainElement.fragment});
		material.side = THREE.DoubleSide;

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_socket, _loop){		
			socket = _socket;
			loop = _loop;	
			that = this;
			globalTick = new (require("./GlobalTicker.js"))();
		}
///////////////////////////////////////////////////////////////////////////////
		this.initialize = function(container) {
			world = new (require("./World.js"))($(container));
			loop.addListener(globalTick.tick, { bind:globalTick });
//			loop.addListener(world.render, { bind:world });
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });
			globalTick.activate();

			globalTick.addListener(this.resizeStage, {bind:this, eventName :"resize" });	

			socket.addListener(function(data, answer, now){
				var knownElement = elements.get(data.id);
				var element = knownElement || {object:[]};
				element.object.unshift(now);
				elements.store(element.object, {id:data.id});
				if(!knownElement) this.updateStage();
			}, {bind : this});

			globalTick.addListener(function(data, answer, now){
				var store = elements.getAll();
				var objects = store.objects;
				var eventGap = world.height/(msPerFunction+1);

				for(var i=0; i < objects.length; i++) {
					for(var k=0; k < objects[i].length; k++) {
						if(objects[i][k] < now-msPerFunction) {
							objects[i].splice(k, objects[i].length-k);
							continue;
						}
						this.attributes.events.value[i] =  this.attributes.events.value[i] || [];
						this.attributes.events.value[i].push((k+1)*eventGap);
					}
					elements.store(objects[i], store.data[i]);
				}				
			}, { bind: this, eventName :"calculate"});



			globalTick.addListener(function(data, answer, now){

			}, {bind: this, eventName :"update"});			

			globalTick.addListener(world.render, { bind:world, eventName :"update" });



		}

///////////////////////////////////////////////////////////////////////////////
		this.resizeStage = function(){
 			this.updateGeometry();
 		}
///////////////////////////////////////////////////////////////////////////////
		this.updateStage= function(){
			if(stage) {
				world.scene.remove(stage);
				stage.geometry.dispose();
			}

			var store = elements.getAllObjects();
			var gap = world.width / (store.length+1);
			var vertexWidth = 3;

			var geometry = new THREE.Geometry();
			
			for(var i = 0; i< store.length; i++) {
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap-vertexWidth/2, 0, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap+vertexWidth/2, 0, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap+vertexWidth/2, world.height, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap-vertexWidth/2, world.height, 0 ) );
				geometry.faces.push( new THREE.Face4( 0+i*4, 1+i*4, 2+i*4, 3+i*4, new THREE.Vector3(0,0,1), 0x00FF00,0));
			}

			stage = new THREE.Mesh(geometry, material);
			world.scene.add(stage);
			stage.position.set(-world.width/2, -world.height/2, 0);
		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function() {
			loop.removeListener(globalTick.tick);
			loop.removeListener(env.render);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(curtain);
})(jQuery, THREE, window, document)