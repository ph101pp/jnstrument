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

		var stepX = 50;
		var stepY = 10;
		var msOnScreen = 1000;
		var margin = 10;

		var materialDot = new THREE.MeshBasicMaterial({color:config.colors.normalDots, transparent:true, opacity:0.4});
		var material = new THREE.LineBasicMaterial({ color:config.colors.normalLines, linewidth:1, transparent:true, opacity:0.2});
		var materialActiveDot = new THREE.MeshBasicMaterial({color:config.colors.activeDots,transparent:true, opacity:0.4});
		var materialActive = new THREE.LineBasicMaterial({ color:config.colors.activeLines, linewidth:2,transparent:true, opacity:0.5});

		var EventCircle = new THREE.Mesh(new THREE.CircleGeometry(6,16));

		var maxEventsOverTime=0;
		var maxEventsOverAll=0;

		var stageObject, stageGeometry;
		var stageDotObject, stageDotGeometry;
		var activeObject, activeGeometry;
		var activeDotObject, activeDotGeometry;

///////////////////////////////////////////////////////////////////////////////
 		var socketJSEvent= function(data, answer, now){
			if(data.sender.id !== senderId) {
				elementData.removeAll();
				senderId = data.sender.id;
				maxEventsOverTime=10;
				maxEventsOverAll=50;
			}
			var element = elementData.get(data.id) || {object:[], data: {id:null, eventCount:0, history:[new THREE.Vector3(0,0,0)], position: new THREE.Vector3(0,0,0)}};
			element.data.id=data.id
			element.data.eventCount++;
			element.object.unshift(now);
			elementData.store(element.object, element.data);
		}		
///////////////////////////////////////////////////////////////////////////////
 		var calculateElements = function(data, answer, now){
			var store = elementData.getAll();
			var objects = store.objects;
			var data = store.data;
			var functionGap = 2*Math.PI/(objects.length);
			var eventsOverTime, actualPoint;

			stageGeometry = new THREE.Geometry();
			stageDotGeometry = new THREE.Geometry();
			activeGeometry = new THREE.Geometry();
			activeDotGeometry = new THREE.Geometry();

			// Update Data
			for(var i=0; i < objects.length; i++) {
				//if(i==0) activeId=data[i].id;
				eventsOverTime=0;
				//Count events over Time
				for(var k=0; k < objects[i].length; k++) {
					// Remove old events
					if(objects[i][k] < now-msOnScreen) {
						objects[i].splice(k, objects[i].length-k);
						continue;
					}
					eventsOverTime++;
				}

				actualPoint= new THREE.Vector3(data[i].eventCount, eventsOverTime, data[i].history[data[i].history.length-1].z);
				maxEventsOverAll = Math.max(maxEventsOverAll, data[i].eventCount);
				maxEventsOverTime = Math.max(maxEventsOverTime, eventsOverTime);

				// if(data[i].history.length <= 0 || data[i].history[data[i].history.length-1].y !== actualPoint.y) 
				// 	data[i].history.push(actualPoint);
				// else 
				// 	data[i].history[data[i].history.length-1] = actualPoint;	

				if(!data[i].history[data[i].history.length-1].equals(actualPoint)) {
					data[i].history.push(actualPoint);
				}
				data[i].history[data[i].history.length-1].z=now;
			}

			// Create Coordinate System
			var x, y;
			for(var i=0; i <= maxEventsOverAll; i+=stepX) {	
				x = getScreenPoints(new THREE.Vector3(i,0)).x;
				if(Math.abs(x-world.width/2) < 1) continue;
				stageGeometry.vertices.push(new THREE.Vector3(x, world.height/2, 0));
				stageGeometry.vertices.push(new THREE.Vector3(x, -world.height/2, 0));
			}
			for(var i=0; i <= maxEventsOverTime; i+=stepY) {	
				y = getScreenPoints(new THREE.Vector3(0,i)).y;
				if(Math.abs(y-world.height/2) < 1) continue;
				stageGeometry.vertices.push(new THREE.Vector3(world.width/2, y, 0));
				stageGeometry.vertices.push(new THREE.Vector3(-world.width/2, y, 0));
			}

			// Place Dots
			var targetPoint;
			var position;
			var distance;
			var curve;
			var movement;
			for(var i=0; i < objects.length; i++) {

				// Set Circle
				targetPoint = data[i].history[data[i].history.length-1];
				position = data[i].position;
				distance = targetPoint.clone().sub(position);
				movement = mapEase(0.6, 0, 1, 0, distance.length(), "easeNot");


				actualPoint = position.clone().add(distance.setLength(movement)); 
				data[i].position=actualPoint;

				EventCircle.position = getScreenPoints(actualPoint);
				EventCircle.position.z=0;
				if(data[i].id === activeId) 
					THREE.GeometryUtils.merge(activeDotGeometry, EventCircle);
				else
					THREE.GeometryUtils.merge(stageDotGeometry, EventCircle);


				// Create Curves
				// curve = new THREE.SplineCurve3(data[i].history);
				// points = curve.getPoints(100);
				points=data[i].history;
				largeStep = Math.ceil(points.length/100);
						
				 for(var v=0, step=1, w=points.length; v<w; v+=step) {

				
					p1 = v+step>= w ?
						getScreenPoints(actualPoint):
						getScreenPoints(points[v]);

					if(v-step <= 0)
						p2 = getScreenPoints(new THREE.Vector3(0,0,0));
					else 
						p2 = getScreenPoints(points[v-step]);
					p1.z=p2.z=0;

					if(data[i].id === activeId) {
						activeGeometry.vertices.push( p1 );
						activeGeometry.vertices.push( p2 );
					}
					else {
						stageGeometry.vertices.push( p1 );
						stageGeometry.vertices.push( p2 );
					}


					if(data[i].id === activeId) step = 1;
					else {
						step = w-v>100 ? largeStep : 1;
						console.log(step);
							
					}

				}


				elementData.store(objects[i], data[i]);
			}

 		}
 ///////////////////////////////////////////////////////////////////////////////
 		var getScreenPoints = function(point){
 			point = point.clone();
 			point.x = mapEase(point.x, 0, maxEventsOverAll,  -world.width/2+margin, world.width/2-margin, "easeOutQuint");
			point.y = mapEase(point.y, 0, maxEventsOverTime,  -world.height/2+margin, world.height/2-margin, "easeOutQuint");
			return point;
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

			//Background
			world.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(world.width, world.height, 1,1), new THREE.MeshBasicMaterial({color:config.colors.background})));
			setupComposer();

			loop.addListener(globalTick.tick, { bind:globalTick });
			
			socket.addListener(socketJSEvent, {bind : this, eventName:"jsEvent"});
		
			socket.addListener(function(data){
				activeId = data.id;
			}, {bind : this, eventName:"activeElement"});
		
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });
//			globalTick.addListener(setupComposer, { bind:this, eventName :"resize" });
			globalTick.addListener(calculateElements, { bind: this, eventName :"calculate"});
			globalTick.addListener(updateScenes, {bind: this, eventName :"update"});			
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