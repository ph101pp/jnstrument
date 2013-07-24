(function($, THREE, window, document, undefined) {	
	var curtain = function(){
		var globalTick, world, loop, socket, that;
		var elements = new (require("./ObjectStore"));
		var functionStage, dotStage;
		var senderId;
		var msOnScreen = 3000;

		this.attributes = {
			events : {type:"fv1",value:[]},
		} 

		var material =  new THREE.ShaderMaterial({ vertexShader:AEROTWIST.Shaders.CurtainElement.vertex, fragmentShader:AEROTWIST.Shaders.CurtainElement.fragment});
		material.side = THREE.DoubleSide;
		material = new THREE.MeshBasicMaterial({transparent:false, opacity:1, wireframe:true, color:0xAAAAAA, side: THREE.DoubleSide});
		var dotGeometry;

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
				if(data.sender.id !== senderId) {
					elements.removeAll();
					senderId = data.sender.id;
				}
				var knownElement = elements.get(data.id);
				var element = knownElement || {object:[]};
				element.object.unshift(now);
				elements.store(element.object, {id:data.id});
				if(!knownElement) this.updateFunctionStage();
			}, {bind : this});

			globalTick.addListener(function(data, answer, now){
				var store = elements.getAll();
				var objects = store.objects;
				var eventGap = world.height/(msOnScreen+1);
				var dots = [];

				for(var i=0; i < objects.length; i++) {
					dots[i]=[];
					for(var k=0; k < objects[i].length; k++) 
						if(objects[i][k]) {
							var height = world.height * (now-objects[i][k]) / msOnScreen;

							if(height > world.height) {
								objects[i].splice(k, objects[i].length-k);
								continue;
							}
							
							dots[i].push( world.height-height );
						}
					elements.store(objects[i], store.data[i]);
				}			
				this.updateDotStage(dots);
			}, { bind: this, eventName :"calculate"});



			globalTick.addListener(function(data, answer, now){

			}, {bind: this, eventName :"update"});			

			globalTick.addListener(world.render, { bind:world, eventName :"update" });



		}

///////////////////////////////////////////////////////////////////////////////
		this.resizeStage = function(){
			this.updateFunctionStage();
 		}
///////////////////////////////////////////////////////////////////////////////
 		this.updateDotStage = function(dots) {
			if(dotStage) {
				world.scene.remove(dotStage);	
				dotStage.geometry.dispose();
			}
			dotGeometry = new THREE.Geometry();
			var circle = new THREE.Mesh(new THREE.CircleGeometry(6,8), material);

			var functionGap = world.width / (dots.length+1);

			for(var i=0, l=dots.length; i<l; i++)
				for(var k=0, n=dots[i].length; k<n; k++) {
					circle.position.set(functionGap*(i+1), dots[i][k],0);
					THREE.GeometryUtils.merge(dotGeometry, circle);
				}
			dotStage = new THREE.Mesh(dotGeometry, material);
			world.scene.add(dotStage);
			dotStage.position.set(-world.width/2, -world.height/2, 0);
 		}
///////////////////////////////////////////////////////////////////////////////
		this.updateFunctionStage= function(){
			if(functionStage) {
				world.scene.remove(functionStage);
				functionStage.geometry.dispose();
			}

			var store = elements.getAllObjects();
			var gap = world.width / (store.length+1);
			var vertexWidth = 0;

			var geometry = new THREE.Geometry();
			
			for(var i = 0; i< store.length; i++) {
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap-vertexWidth/2, 0, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap+vertexWidth/2, 0, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap+vertexWidth/2, world.height, 0 ) );
				geometry.vertices.push( new THREE.Vector3( (i+1)*gap-vertexWidth/2, world.height, 0 ) );
				geometry.faces.push( new THREE.Face4( 0+i*4, 1+i*4, 2+i*4, 3+i*4, new THREE.Vector3(0,0,1), 0x00FF00,0));
			}

			functionStage = new THREE.Mesh(geometry, material);
			world.scene.add(functionStage);
			functionStage.position.set(-world.width/2, -world.height/2, 0);
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