(function($, THREE, window, document, undefined) {	
	var drop = function(){
		var globalTick, world, loop, socket, that;
		var events = [];
		var stage;

		var msOnScreen = 2000;

		this.uniforms = {
			events : {type:"fv1", value:[]},			
			eventCount : {type:"f", value:0},
			onScreen : {type:"f", value:msOnScreen},
			height : {type:"f", value:0},
			width : {type:"f", value:0}
		} 

		var material =  new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.Drop.vertex, fragmentShader:AEROTWIST.Shaders.Drop.fragment});
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
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });
			globalTick.activate();
			this.setupStage();

			socket.addListener(function(data, answer, now){
				events.unshift(now);
			}, {bind : this});

			globalTick.addListener(function(data, answer, now){
				this.uniforms.events.value = [];
				this.uniforms.eventCount.value =0;
				for(var i=0, l = events.length; i < l; i++) {
					if(now-events[i] > msOnScreen) {
						events.splice(i, events.length-i);
						continue;
					}
					this.uniforms.events.value.push(now-events[i]);
					this.uniforms.eventCount.value++;
				}	
			}, { bind: this, eventName :"calculate"});



			// globalTick.addListener(function(data, answer, now){		
			// 	console.log(this.uniforms);
			// }, {bind: this, eventName :"update"});			


			globalTick.addListener(world.render, { bind:world, eventName :"update" });


		}

///////////////////////////////////////////////////////////////////////////////
		this.resizeStage = function(){
 			var vertices = [];			
 			vertices.push( new THREE.Vector3( -world.width/2, world.height/2, 0 ) );
			vertices.push( new THREE.Vector3( world.width/2, world.height/2, 0 ) );
			vertices.push( new THREE.Vector3( world.width/2, -world.height/2, 0 ) );
			vertices.push( new THREE.Vector3( -world.width/2, -world.height/2, 0 ) );

			stage.geometry.vertices = geometry;
			stage.geometry.verticesNeedUpdate = true;

			this.uniforms.height.value= world.height;
			this.uniforms.width.value=world.width;
 		}
///////////////////////////////////////////////////////////////////////////////
		this.setupStage= function(){

			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( -world.width/2, world.height/2, 0 ) );
			geometry.vertices.push( new THREE.Vector3( world.width/2, world.height/2, 0 ) );
			geometry.vertices.push( new THREE.Vector3( world.width/2, -world.height/2, 0 ) );
			geometry.vertices.push( new THREE.Vector3( -world.width/2, -world.height/2, 0 ) );
			geometry.faces.push( new THREE.Face4( 0,1,2,3, new THREE.Vector3(0,0,1), 0x00FF00,0));
			
			stage = new THREE.Mesh(geometry, material);
			world.scene.add(stage);			
			globalTick.addListener(this.resizeStage, {bind:this, eventName :"resize" });	

			this.uniforms.height.value= world.height;
			this.uniforms.width.value=world.width;
		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function() {
			loop.removeListener(globalTick.tick);
			loop.removeListener(env.render);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(drop);
})(jQuery, THREE, window, document)