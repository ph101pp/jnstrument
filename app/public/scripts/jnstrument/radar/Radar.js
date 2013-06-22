(function($, THREE, window, document, undefined) {	
	var curtain = function(){
		var globalTick, world, loop, socket, that;
		var elementData = new (require("./ObjectStore"));
		var senderId;
		var shaders;
		var composer;
		var composerActive;
		var composerBlur;
		var activeId;
		var msOnScreen = 3000;

		// var material =  new THREE.ShaderMaterial({ vertexShader:AEROTWIST.Shaders.CurtainElement.vertex, fragmentShader:AEROTWIST.Shaders.CurtainElement.fragment});
		// material.side = THREE.DoubleSide;
		var materialDot = new THREE.MeshBasicMaterial({color:0xFFFFFF, transparent:true, opacity:0.4});
		var material = new THREE.LineBasicMaterial({ color:0xcccccc, linewidth:1, transparent:true, opacity:0.2});
		var materialActiveDot = new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true, opacity:0.4});
		var materialActive = new THREE.LineBasicMaterial({ color:0xFFFFFF, linewidth:2,transparent:true, opacity:0.5});
		var circle = new THREE.CircleGeometry(1,32);
		var EventCircle = new THREE.Mesh(new THREE.CircleGeometry(6,8), material);
		var stageObject, stageGeometry;
		var stageDotObject, stageDotGeometry;
		var activeObject, activeGeometry;
		var activeDotObject, activeDotGeometry;

///////////////////////////////////////////////////////////////////////////////
 		var socketJSEvent= function(data, answer, now){
			if(data.sender.id !== senderId) {
				elementData.removeAll();
				senderId = data.sender.id;
			}
			var element = elementData.get(data.id) || {object:[], data: {lines:new THREE.Geometry(), dots: new THREE.Geometry()}};
			element.data.id=data.id
			element.object.unshift(now);
			elementData.store(element.object, element.data);
		}
///////////////////////////////////////////////////////////////////////////////
 		var calculateElements = function(data, answer, now){
			var store = elementData.getAll();
			var objects = store.objects;
			var data = store.data;
			var maxRadius = (new THREE.Vector3(world.width/2, world.height/2)).length();
			var functionGap = 2*Math.PI/(objects.length);
			var radius, w, eventAngle;

			activeGeometry = new THREE.Geometry();
			activeDotGeometry = new THREE.Geometry();


			for(var i=0; i < objects.length; i++) {
				if(i==0) activeId=data[i].id;
				data[i].lines.dispose();
				data[i].dots.dispose();
				data[i].dots = new THREE.Geometry();
				data[i].lines = new THREE.Geometry();
				eventAngle = new THREE.Vector3( Math.cos( functionGap*i ) * maxRadius, Math.sin( functionGap*i )* maxRadius, 0 );				

				// Function Line (Horizontal);
				if(data[i].id === activeId) {
					activeGeometry.vertices.push( eventAngle.clone().setLength(0) );
					activeGeometry.vertices.push( eventAngle.clone());
				}
				else {
					data[i].lines.vertices.push( eventAngle.clone().setLength(0) );
					data[i].lines.vertices.push( eventAngle.clone());
				}

				//Create Events on Function Line
				for(var k=0; k < objects[i].length; k++) {
					radius = maxRadius * (now-objects[i][k]) / msOnScreen;	
					// Remove old events
					if(radius > maxRadius) {
						objects[i].splice(k, objects[i].length-k);
						continue;
					}

					// create Large Circle
					for(var v=1; v< circle.vertices.length; v++) {
						w = v-1 >= 1 ? v-1 : circle.vertices.length-1;
						if(data[i].id === activeId) {
							activeGeometry.vertices.push( circle.vertices[v].clone().setLength(radius) );
							activeGeometry.vertices.push( circle.vertices[w].clone().setLength(radius) );
						}
						else {
							data[i].lines.vertices.push( circle.vertices[v].clone().setLength(radius) );
							data[i].lines.vertices.push( circle.vertices[w].clone().setLength(radius) );
						}
					}

					// create small Circle
					EventCircle.position= eventAngle.clone().setLength(radius);	
					if(data[i].id === activeId) 
						THREE.GeometryUtils.merge(activeDotGeometry, EventCircle);
					else
						THREE.GeometryUtils.merge(data[i].dots, EventCircle);
				}

				elementData.store(objects[i], data[i]);
				//console.log(objects[i].vertices.length, data[i].id);
			}			


 		}
///////////////////////////////////////////////////////////////////////////////
 		var updateElements=function(data, answer, now){
			var store = elementData.getAll();
			var objects = store.objects;
			var data = store.data;
			if(stageObject) {
				world.scene.remove(stageObject);	
				stageObject.geometry.dispose();
				stageGeometry.dispose();
									
				world.scene.remove(stageDotObject);	
				stageDotObject.geometry.dispose();
				stageDotGeometry.dispose();

				world.activeScene.remove(activeObject);	
				activeObject.geometry.dispose();
				activeGeometry.dispose();
									
				world.activeScene.remove(activeDotObject);	
				activeDotObject.geometry.dispose();
				activeDotGeometry.dispose();
			}

			stageGeometry = new THREE.Geometry();
			stageDotGeometry = new THREE.Geometry();
			for(var i=0; i < objects.length; i++) 
				if(data[i].id !== activeId) {
					stageGeometry.vertices = stageGeometry.vertices.concat(data[i].lines.vertices);
					THREE.GeometryUtils.merge(stageDotGeometry, data[i].dots);
				}

			stageObject = new THREE.Line(stageGeometry, material, THREE.LinePieces);
			stageDotObject = new THREE.Mesh(stageDotGeometry, materialDot);
			stageDotObject.position.set(0,0,1);
			world.scene.add(stageObject);
			world.scene.add(stageDotObject);

			activeObject = new THREE.Line(activeGeometry, materialActive, THREE.LinePieces);
			activeDotObject = new THREE.Mesh(activeDotGeometry, materialActiveDot);
			activeDotObject.position.set(0,0,1);
			world.activeScene.add(activeObject);
			world.activeScene.add(activeDotObject);

		}
///////////////////////////////////////////////////////////////////////////////
		var setupComposer = function() {

			// BlurActive
			composerBlur = new THREE.EffectComposer( world.renderer );
			composerBlur.addPass( new THREE.RenderPass( world.activeScene, world.camera ) );
			var effectTint = new THREE.ShaderPass( shaders.tint );
				effectTint.uniforms[ "color" ].value = new THREE.Color(0x76BDE5);
			var effectHorizBlur = new THREE.ShaderPass( shaders.horizontalBlur );
				effectHorizBlur.uniforms[ "h" ].value = 1.5 / window.innerWidth;
			var effectVertiBlur = new THREE.ShaderPass( shaders.verticalBlur );
				effectVertiBlur.uniforms[ "v" ].value = 1.5 / window.innerHeight;			
			composerBlur.addPass( effectTint );
			composerBlur.addPass( effectHorizBlur );
			composerBlur.addPass( effectVertiBlur );

			// Active
			composerActive = new THREE.EffectComposer( world.renderer );
			composerActive.addPass( new THREE.RenderPass( world.activeScene, world.camera ) );

			// Combine With Background and add Vignette
			composer = new THREE.EffectComposer( world.renderer );
			composer.addPass( new THREE.RenderPass( world.scene, world.camera ) );
			var effectVignette = new THREE.ShaderPass( shaders.vignette );
				// larger values = darker closer to center
				// darkness < 1  => lighter edges
				effectVignette.uniforms[ "offset" ].value = 1;
				effectVignette.uniforms[ "darkness" ].value = 1;
			var effectBlend1 = new THREE.ShaderPass( shaders.additiveBlend, "tDiffuse1" );
				effectBlend1.uniforms[ 'tDiffuse2' ].value = composerBlur.renderTarget2;
			var effectBlend11 = new THREE.ShaderPass( shaders.additiveBlend, "tDiffuse1" );
				effectBlend11.uniforms[ 'tDiffuse2' ].value = composerBlur.renderTarget2;
			var effectBlend2 = new THREE.ShaderPass( shaders.additiveBlend, "tDiffuse2" );
				effectBlend2.uniforms[ 'tDiffuse1' ].value = composerActive.renderTarget2
				effectBlend2.renderToScreen = true;
			composer.addPass(effectVignette);
			composer.addPass(effectBlend1);					
			composer.addPass(effectBlend1);					
			composer.addPass(effectBlend1);					
			composer.addPass(effectBlend2);
		}
///////////////////////////////////////////////////////////////////////////////
		var render = function(){
			composerBlur.render();
			composerActive.render();
			composer.render();
		}
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_socket, _loop){		
			socket = _socket;
			loop = _loop;	
			that = this;
			shaders = require("./shaders.js");
			globalTick = new (require("./GlobalTicker.js"))();
		}
///////////////////////////////////////////////////////////////////////////////
		this.initialize = function(container) {
			world = new (require("./World.js"))($(container));

			//Background
			world.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(world.width, world.height, 1,1), new THREE.MeshBasicMaterial({color:new THREE.Color(29,29,38)})));

			setupComposer();

			loop.addListener(globalTick.tick, { bind:globalTick });

			socket.addListener(socketJSEvent, {bind : this, eventName:"jsEvent"});
			
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });

			globalTick.addListener(calculateElements, { bind: this, eventName :"calculate"});

			globalTick.addListener(updateElements, {bind: this, eventName :"update"});			

			globalTick.addListener(render, { bind:this, eventName :"render" });

			globalTick.activate();

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