(function($, THREE, window, document, undefined) {	
	var drop = function(){
		var globalTick, world, loop, socket, that;
		var events = [];
		var stage;

		var msOnScreen = 3000;

		this.uniforms = {
			height : {type:"f", value:0},
			width : {type:"f", value:0}
		} 
		this.attributes = {
			events1 : {type:"v4", value:[]},
			events2 : {type:"v4", value:[]},
			// events3 : {type:"v4", value:[]},
			// events4 : {type:"v4", value:[]}
		}
		var circle = new THREE.Mesh(new THREE.CircleGeometry(1, 100),new THREE.MeshBasicMaterial());
		circle.geometry.mergeVertices();

		var material =  new THREE.ShaderMaterial({ uniforms:this.uniforms, attributes:this.attributes, vertexShader:AEROTWIST.Shaders.Drop.vertex, fragmentShader:AEROTWIST.Shaders.Drop.fragment});
		material.side = THREE.DoubleSide;
		material.transparent = true;
		//material = new THREE.MeshBasicMaterial({transparent:false, opacity:0.5, wireframe:true, side: THREE.DoubleSide});
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
				circle.position.z=0;
				this.attributes.events1 = {type:"v4", value:[], needsUpdate:true};
				this.attributes.events2 = {type:"v4", value:[], needsUpdate:true};
				// this.attributes.events3 = {type:"v4", value:[], needsUpdate:true};
				// this.attributes.events4 = {type:"v4", value:[], needsUpdate:true};

				for(var i=0, l = events.length; i < l; i++)
					if(events[i]) {
						radius = maxRadius * (now-events[i]) / msOnScreen;
						if(radius > maxRadius) {
							events.splice(i, events.length-i);
							continue;
						}
						radiuses.push( Math.round(radius) );
				
						if(radiuses.length >= 8) {
							this.createCircle(radiuses, i%2);
							radiuses.splice(0,radiuses.length-2);
						}
					}
				radiuses.push(maxRadius);
				this.createCircle(radiuses);

				stage = new THREE.Mesh(geometry, material);
				
				world.scene.add(stage);	

			}, { bind: this, eventName :"calculate"});



			globalTick.addListener(function(data, answer, now){		
				 // console.log(geometry.vertices.length);
				 //console.log(this.attributes.events1, this.attributes.events2);
			}, {bind: this, eventName :"update"});			


			globalTick.addListener(world.render, { bind:world, eventName :"update" });


		}

///////////////////////////////////////////////////////////////////////////////
		this.createCircle = function(radiuses, even){
			var segments = 16;

	//		var circle = new THREE.Mesh(new THREE.CircleGeometry(1, even ? 5 :64),new THREE.MeshBasicMaterial());

			var v41 = new THREE.Vector4(radiuses[0]||0, radiuses[1]||0, radiuses[2]||0, radiuses[3]||0);
			var v42 = new THREE.Vector4(radiuses[4]||0, radiuses[5]||0, radiuses[6]||0, radiuses[7]||0);
			var v43 = new THREE.Vector4(radiuses[8]||0, radiuses[9]||0, radiuses[10]||0, radiuses[11]||0);
			var v44 = new THREE.Vector4(radiuses[12]||0, radiuses[13]||0, radiuses[14]||0, radiuses[15]||0);
			var normal = new THREE.Vector3( 0, 0, 1 );
			var radius = radiuses[radiuses.length-1];
			circle.scale.set(radius,radius,radius);
			circle.position.z-=1;

			THREE.GeometryUtils.merge(geometry, circle);
			for(var i=0; i<circle.geometry.vertices.length; i++) {
				this.attributes.events1.value.push(v41);
				this.attributes.events2.value.push(v42);
				// this.attributes.events3.value.push(v43);
				// this.attributes.events4.value.push(v44);
			}

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