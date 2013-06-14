(function($, THREE, window, document, undefined) {	
	var drop = function(){
		var globalTick, world, loop, socket, that;
		var events = [];
		var stage;

		var msOnScreen = 3000;

		this.uniforms = {
			events : {type:"fv1", value:[]},			
			eventCount : {type:"f", value:0},
			onScreen : {type:"f", value:msOnScreen},
			height : {type:"f", value:0},
			width : {type:"f", value:0}
		} 
		this.attributes = {
			events1 : {type:"v4", value:[]},
			events2 : {type:"v4", value:[]}
		}

		var material =  new THREE.ShaderMaterial({ uniforms:this.uniforms, attributes:this.attributes, vertexShader:AEROTWIST.Shaders.Drop.vertex, fragmentShader:AEROTWIST.Shaders.Drop.fragment});
		// material = new THREE.LineBasicMaterial({transparent:true, opacity:1, wireframe:true});
		material.side = THREE.DoubleSide;
		var geometry;

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
	

			socket.addListener(function(data, answer, now){
				events.unshift(now);
			}, {bind : this});

			globalTick.addListener(function(data, answer, now){
				var maxRadius = (new THREE.Vector3(world.width/2, world.height/2)).length();
				var radiuses =[];
				var radius;
				if(stage) {
					world.scene.remove(stage);	
					stage.geometry.dispose();
				}				
				geometry = new THREE.Geometry();
				this.attributes.events1 = {type:"v4", value:[], needsUpdate:true};
				this.attributes.events2 = {type:"v4", value:[], needsUpdate:true};

				for(var i=0, l = events.length; i < l; i++) {
					radius = maxRadius * (now-events[i]) / msOnScreen;

					if(radius > maxRadius) {
						events.splice(i, events.length-i);
						continue;
					}
					radiuses.push( radius );
			
					if(radiuses.length >= 8) {
						this.createCircle(radiuses);
						radiuses.splice(0,7);
					}
				}
				radiuses.push(maxRadius);
				this.createCircle(radiuses);

//				geometry.mergeVertices();
				stage = new THREE.Mesh(geometry, material);
				
				world.scene.add(stage);	

			}, { bind: this, eventName :"calculate"});



			globalTick.addListener(function(data, answer, now){		
				// console.log(geometry.vertices);
				// console.log(this.attributes.events1.value);
			}, {bind: this, eventName :"update"});			


			globalTick.addListener(world.render, { bind:world, eventName :"update" });


		}

///////////////////////////////////////////////////////////////////////////////
		this.createCircle = function(radiuses){
			var segments = 16;
			var circle = new THREE.CircleGeometry(radiuses[radiuses.length-1], segments);
			var v41 = new THREE.Vector4(radiuses[0]||0, radiuses[1]||0, radiuses[2]||0, radiuses[3]||0);
			var v42 = new THREE.Vector4(radiuses[4]||0, radiuses[5]||0, radiuses[6]||0, radiuses[7]||0);
			var faceVertexKeys= ["a","b","c"];


			if(geometry.vertices.length === 0) {
				for(var i=0, l = circle.vertices.length; i<l; i++) {
					var j = geometry.vertices.push(circle.vertices[i])-1;
					this.attributes.events1.value[j]=v41;
					this.attributes.events2.value[j]=v42;
				}
				geometry.faces = geometry.faces.concat(circle.faces);
			}
			else 
				for(var i=1, l = circle.vertices.length; i<l; i++) { // i=1 so (0,0,0) is not added to vertices again.
					var j = geometry.vertices.push(circle.vertices[i])-1;
					this.attributes.events1.value[j]=v41;
					this.attributes.events2.value[j]=v42;

					geometry.faces.push(new THREE.Face4(j, j-1, j-segments-1, j-segments-1));
				}
			
		}
///////////////////////////////////////////////////////////////////////////////
		this.resizeStage = function(){
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