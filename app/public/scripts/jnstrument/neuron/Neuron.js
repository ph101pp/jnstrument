(function($, THREE, window, document, undefined) {	
	var config = require("../config.js");
	var curtain = function(){
		var globalTick, world, loop, socket, that;
		var elementData = new (require("./ObjectStore"));
		var senderId;
		var shaders;
		var mapEase;
		var composer;
		var composerActive;
		var composerBlur;
		var activeId;

		var materialDot = new THREE.MeshBasicMaterial({color:config.colors.normalDots, transparent:true, opacity:0.4});
		var material = new THREE.LineBasicMaterial({ color:config.colors.normalLines, linewidth:1, transparent:true, opacity:0.2});
		var materialActiveDot = new THREE.MeshBasicMaterial({color:config.colors.activeDots,transparent:true, opacity:0.4});
		var materialActive = new THREE.LineBasicMaterial({ color:config.colors.activeLines, linewidth:2,transparent:true, opacity:0.5});

		var stageObject, stageGeometry;
		var stageDotObject, stageDotGeometry;
		var activeObject, activeGeometry;
		var activeDotObject, activeDotGeometry;

		var baseElementCircle = new THREE.Mesh(new THREE.CircleGeometry(1,8));

		var showDebugStuff=false;

		var functionCollisionDetection;
		var groupCollisionDetection;

		var elementGroups = new (require("./ObjectStore"));

		var clicked = function(data, answer, now){
			console.log(elementGroups.getAll());
			console.log(elementData.getAll());
			showDebugStuff=!showDebugStuff;

		}


///////////////////////////////////////////////////////////////////////////////
 		var socketJSEvent= function(data, answer, now){
 			// Remove everything if new SenderId received
			if(data.sender.id !== senderId) {
				elementGroups.removeAll();
				elementData.removeAll();
				senderId = data.sender.id;
			}

			// get caller
			var caller = data.data.calledById !== false ?
				elementData.get(data.data.calledById) || {object:new (require("./FunctionElement"))(data.data.calledById), data:{}}:
				{object:{}, data:false};

			// get element
			var element = elementData.get(data.id) || {object:new (require("./FunctionElement"))(data.id), data:{}};
			element.data.id = data.id;

			// get group
			if(element.object.group && caller.object.group && element.object.group.id !== caller.object.group.id) {
				elementGroups.remove(caller.object.group);
				groupCollisionDetection.removeElement(caller.object.group);
				var group = elementGroups.get( element.object.group.merge( caller.object.group ) );
			}
			else var group = elementGroups.get(element.object.group) || elementGroups.get(caller.object.group) || {object:new (require("./GroupElement"))(data.id+"_"+data.data.calledById), data:{id:data.id+"_"+data.data.calledById}};
			groupCollisionDetection.addElement(group.object);

			// if there is a caller
			if(caller.data !== false) {
				caller.data.id = data.data.calledById;
				group.object.elements.store(caller.object);
				caller.object.group = group.object;

				caller.object.outboundElements.store(element.object, { id: element.object.id });
				element.object.inboundElements.store(caller.object, { id: caller.object.id });

				element.object.inboundCounts[caller.object.id] = element.object.inboundCounts[caller.object.id] > 0 ? 
					element.object.inboundCounts[caller.object.id]+1 : 1;
				caller.object.outboundCounts[element.object.id] = caller.object.outboundCounts[element.object.id] > 0 ? 
					caller.object.outboundCounts[element.object.id]+1 : 1;

				caller.object.outboundCounts.total++;
				caller.object.events.unshift(now);

				functionCollisionDetection.addElement(caller.object);

				elementData.store(caller.object, caller.data);
			}

			group.object.elements.store(element.object);

			element.object.group = group.object;
			element.object.inboundCounts.total++;
			element.object.events.unshift(now);
			functionCollisionDetection.addElement(element.object);

			elementGroups.store(group.object, group.data);
			elementData.store(element.object, element.data);
		}		

///////////////////////////////////////////////////////////////////////////////
 		var calculateElements = function(data, answer, now){
			var groupElements = elementGroups.getAllObjects();
			var functionElements = elementData.getAllObjects();

			// Update collision detections
			functionCollisionDetection.reMap();
			groupCollisionDetection.reMap();


			// Collide
			functionCollisionDetection.testElements();
			groupCollisionDetection.testElements();

 			// Update Group positions
 			for(var i=0; i<groupElements.length; i++) {
 				groupElements[i].updatePosition();
 				groupElements[i].updateActionRadius();
 			}
			// Update functionElement Positions
 			for(var i=0; i<functionElements.length; i++) 
 				functionElements[i].updatePosition();
 		}
///////////////////////////////////////////////////////////////////////////////
 		var updateElements = function(data, answer, now){
			var store = elementData.getAll();
			var objects = store.objects;
			var data = store.data;
			var outboundElements;
			

			stageGeometry = new THREE.Geometry();
			stageDotGeometry = new THREE.Geometry();
			activeGeometry = new THREE.Geometry();
			activeDotGeometry = new THREE.Geometry();

			// Update Data
			for(var i=0; i < objects.length; i++) {
				//if(i==0) activeId=data[i].id;
				// eventsOverTime=0;
				// //Count events over Time
				// for(var k=0; k < objects[i].length; k++) {
				// 	// Remove old events
				// 	if(objects[i][k] < now-msOnScreen) {
				// 		objects[i].splice(k, objects[i].length-k);
				// 		continue;
				// 	}
				// 	eventsOverTime++;
				// }			

				baseElementCircle.position = objects[i].position;
				baseElementCircle.scale.set(3,3,3);
				THREE.GeometryUtils.merge(stageDotGeometry, baseElementCircle);

				outboundElements = objects[i].outboundElements.getAllObjects(); 
				for(var k=0;  k<outboundElements.length; k++) {
					stageGeometry.vertices.push(objects[i].position);
					stageGeometry.vertices.push(outboundElements[k].position);
				}

			}

			// Show group elements temp

			if(showDebugStuff){

			var groupElements = elementGroups.getAllObjects();
			for(var i=0; i < groupElements.length; i++) {
				
				baseElementCircle.position = groupElements[i].position;
				baseElementCircle.scale.set(groupElements[i].actionRadius,groupElements[i].actionRadius,groupElements[i].actionRadius);
				THREE.GeometryUtils.merge(activeDotGeometry, baseElementCircle);


				activeGeometry.vertices.push(groupElements[i].boundingBox.min);
				activeGeometry.vertices.push(groupElements[i].boundingBox.max);

			}
		}
			updateScenes();
 		}

///////////////////////////////////////////////////////////////////////////////
 		var updateScenes=function(data, answer, now){
			if(stageObject) {
				world.scene.remove(stageObject);	
				world.scene.remove(stageDotObject);	
				stageObject.geometry.dispose();									
				stageDotObject.geometry.dispose();

				world.activeScene.remove(activeObject);	
				world.activeScene.remove(activeDotObject);	
				activeObject.geometry.dispose();								
				activeDotObject.geometry.dispose();
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
				effectTint.uniforms[ "color" ].value = new THREE.Color(config.colors.activeGlow);
			var effectHorizBlur = new THREE.ShaderPass( shaders.horizontalBlur );
				effectHorizBlur.uniforms[ "h" ].value = 1.5 / world.width;
			var effectVertiBlur = new THREE.ShaderPass( shaders.verticalBlur );
				effectVertiBlur.uniforms[ "v" ].value = 1.5 / world.height;			
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
			mapEase = require("./mapEase.js");
			globalTick = new (require("./GlobalTicker.js"))();
		}
///////////////////////////////////////////////////////////////////////////////
		this.initialize = function(container) {
			world = new (require("./World.js"))($(container));
			functionCollisionDetection = new (require("./BSPCollisionDetection"))(world);
			groupCollisionDetection = new (require("./BSPCollisionDetection"))(world);

			//Background
			world.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(world.width, world.height, 1,1), new THREE.MeshBasicMaterial({color:config.colors.background})));
			setupComposer();

			loop.addListener(globalTick.tick, { bind:globalTick });
			
			socket.addListener(socketJSEvent, {bind : this, eventName:"jsEvent"});
			
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });
			globalTick.addListener(clicked, {bind:this, eventName:"click"});
//			globalTick.addListener(setupComposer, { bind:this, eventName :"resize" });
			globalTick.addListener(calculateElements, { bind: this, eventName :"calculate"});
			globalTick.addListener(updateElements, { bind: this, eventName :"update"});
			//globalTick.addListener(updateScenes, {bind: this, eventName :"update"});			
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