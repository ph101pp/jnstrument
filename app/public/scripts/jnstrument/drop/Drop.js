(function($, THREE, window, document, undefined) {	
	var drop = function(){
		var globalTick, world, loop, socket, that;
		var events = [];
		var stage;

		var msOnScreen = 5000;

		this.uniforms = {
			height : {type:"f", value:0},
			width : {type:"f", value:0}
		} 
		this.attributes = {
			events1 : {type:"v4", value:[]},
			events2 : {type:"v4", value:[]},
			events3 : {type:"v4", value:[]},
			events4 : {type:"v4", value:[]}
		}

		var material =  new THREE.ShaderMaterial({ uniforms:this.uniforms, attributes:this.attributes, vertexShader:AEROTWIST.Shaders.Drop.vertex, fragmentShader:AEROTWIST.Shaders.Drop.fragment});
		material.side = THREE.DoubleSide;
		material = new THREE.MeshBasicMaterial({transparent:false, opacity:0.5, wireframe:true, side: THREE.DoubleSide});
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
			this.resizeStage();

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
				this.attributes.events3 = {type:"v4", value:[], needsUpdate:true};
				this.attributes.events4 = {type:"v4", value:[], needsUpdate:true};

				for(var i=0, l = events.length; i < l; i++)
					if(events[i]) {
						radius = maxRadius * (now-events[i]) / msOnScreen;
						if(radius > maxRadius) {
							events.splice(i, events.length-i);
							continue;
						}
						radiuses.push( Math.round(radius) );
				
						if(radiuses.length >= 1) {
							this.createCircle(radiuses);
							radiuses.splice(0,1);
						}
					}
				radiuses.push(maxRadius);
				this.createCircle(radiuses);

//				geometry.mergeVertices();
				stage = new THREE.Mesh(geometry, material);
				
				world.scene.add(stage);	

			}, { bind: this, eventName :"calculate"});



			globalTick.addListener(function(data, answer, now){		
				 // console.log(geometry.vertices.length);
				 console.log(this.attributes.events1, this.attributes.events2);
			}, {bind: this, eventName :"update"});			


			globalTick.addListener(world.render, { bind:world, eventName :"update" });


		}

///////////////////////////////////////////////////////////////////////////////
		this.createCircle = function(radiuses){
			var segments = 16;
			var circle = new THREE.CircleGeometry(radiuses[radiuses.length-1], segments);
			var v41 = new THREE.Vector4(radiuses[0]||0, radiuses[1]||0, radiuses[2]||0, radiuses[3]||0);
			var v42 = new THREE.Vector4(radiuses[4]||0, radiuses[5]||0, radiuses[6]||0, radiuses[7]||0);
			var v43 = new THREE.Vector4(radiuses[8]||0, radiuses[9]||0, radiuses[10]||0, radiuses[11]||0);
			var v44 = new THREE.Vector4(radiuses[12]||0, radiuses[13]||0, radiuses[14]||0, radiuses[15]||0);
			var normal = new THREE.Vector3( 0, 0, 1 );
			
			circle.mergeVertices();
			if(geometry.vertices.length === 0) {	
				geometry.vertices= circle.vertices;
				geometry.faces= circle.faces;
				for(var i = 0; i<geometry.vertices.length; i++) {
					this.attributes.events1.value.push(v41);
					this.attributes.events2.value.push(v42);
					this.attributes.events3.value.push(v43);
					this.attributes.events4.value.push(v44);				
				}
			}
			else {
				for(var i=1, l = circle.vertices.length; i<l; i++) { // i=1 so (0,0,0) is not added to vertices again.
					if(i===1) {
						var k=geometry.vertices.push(circle.vertices[i])-1;
						this.attributes.events1.value.push(v41);
						this.attributes.events2.value.push(v42);
						this.attributes.events3.value.push(v43);
						this.attributes.events4.value.push(v44);
						continue; 
					}
					var j=geometry.vertices.push(circle.vertices[i])-1;

					this.attributes.events1.value.push(v41);
					this.attributes.events2.value.push(v42);
					this.attributes.events3.value.push(v43);
					this.attributes.events4.value.push(v44);	

					// geometry.faces.push(new THREE.Face4(j, j-1, j-2, j-3, normal,new THREE.Color(new THREE.Vector3(Math.random()*255,Math.random()*255,Math.random()*255))));
					// geometry.faces.push(new THREE.Face3(j-1, j-1-segments, j-segments, normal ));
					// geometry.faces.push(new THREE.Face3(j, j-1, j-segments, normal ));

					 geometry.faces.push(new THREE.Face4(j, j-1, j-1-segments, j-segments, normal ));

				}
				
				// geometry.faces.push(new THREE.Face3(k, k+segments-1-segments,k-segments ));
				// geometry.faces.push(new THREE.Face3(k, k+segments-1, k+segments-1-segments ));

				geometry.faces.push(new THREE.Face4(k, k+segments-1, k+segments-1-segments, k-segments, normal ));

			}

			circle.dispose();		
		}
///////////////////////////////////////////////////////////////////////////////
		this.resizeStage = function(){
			this.uniforms.height.value= world.height;
			this.uniforms.width.value=world.width;
			this.uniforms.height.needsUpdate=true;
			this.uniforms.width.needsUpdate=true;
 		}
///////////////////////////////////////////////////////////////////////////////
		this.setupStage= function(){

			// var geometry = new THREE.Geometry();
			// geometry.vertices.push( new THREE.Vector3( -world.width/2, world.height/2, 0 ) );
			// geometry.vertices.push( new THREE.Vector3( world.width/2, world.height/2, 0 ) );
			// geometry.vertices.push( new THREE.Vector3( world.width/2, -world.height/2, 0 ) );
			// geometry.vertices.push( new THREE.Vector3( -world.width/2, -world.height/2, 0 ) );
			// geometry.faces.push( new THREE.Face4( 0,1,2,3, new THREE.Vector3(0,0,1), 0x00FF00,0));
			
			// stage = new THREE.Mesh(geometry, material);
			// world.scene.add(stage);			
			// globalTick.addListener(this.resizeStage, {bind:this, eventName :"resize" });	

			// this.uniforms.height.value= world.height;
			// this.uniforms.width.value=world.width;
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