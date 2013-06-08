(function($, THREE, window, document, undefined) {	
	var atom = function(){
		var globalTick, env, loop, socket, that;

		var elements = new (require("./ObjectStore"));
///////////////////////////////////////////////////////////////////////////////
		var setupCollisionDetection = function(){
			env.collisionDetection = new (require("./CollisionDetection.js"))();	
			var rayCount = 16;
			var ray = new THREE.Vector3(0, 1, 0);
			for(var i =0; i<rayCount; i++ )	
				env.collisionDetection.addRay(new THREE.Vector3(Math.cos( (i*360/rayCount)*(Math.PI/180) ), Math.sin( (i*360/rayCount)*(Math.PI/180) ), 0));
		}
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_socket, _loop){		
			socket = _socket;
			loop = _loop;	
			that = this;
			globalTick = new (require("./GlobalTicker.js"))();
		}
///////////////////////////////////////////////////////////////////////////////
		this.initialize = function(container) {
			env = 	new (require("./World.js"))($(container));
			loop.addListener(globalTick.tick, { bind:globalTick });
			loop.addListener(env.render, { bind:env });

			globalTick.activate();

			setupCollisionDetection();

			globalTick.addListener(function(){
				env.collisionDetection.testElements();
			}, {eventName :"calculate"});

			socket.addListener(function(data){
				
				var element = elements.get(data.id);
				var caller = elements.get(data.data.calledBy);
				if(caller === false) {
					caller = new (require("./FunctionElement.js"))();
					caller.position.set(Math.random()*100-50,Math.random()*100-50,Math.random()*100-50);
					globalTick.addListener(caller.update, {bind:caller, eventName:"update"});
					env.collisionDetection.addElement(caller);
					env.scene.add(caller);
					caller = elements.store(caller,{id:data.data.calledBy});
				}
				if(element === false) {
					element = new (require("./FunctionElement.js"))();
					element.position = caller.object.position.clone().add(new THREE.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5));
					globalTick.addListener(element.update, {bind:element, eventName:"update"});
					env.collisionDetection.addElement(element);
					env.scene.add(element);
					element = elements.store(element,{id:data.data.id});
				}

				element.object.inboundEvent(caller.object);
				caller.object.outboundEvent(element.object);
			});

		}

///////////////////////////////////////////////////////////////////////////////
		this.tests = function(){

			var element1 = new (require("./FunctionElement.js"))();
			var element2 = new (require("./FunctionElement.js"))();
			var element3 = new (require("./FunctionElement.js"))();
			var element4 = new (require("./FunctionElement.js"))();
			var element5 = new (require("./FunctionElement.js"))();

			//	console.log(element5, element5.instanceof(require("./CollisionElement.js")));
			// console.log(element, element instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);
			// console.log(element2, element2 instanceof THREE.Mesh);

			// element1.update();

			// element1.outboundEvent(element2);
			// element1.outboundEvent(element2);
			// element1.outboundEvent(element2);


			element1.worldReference(env);
			element2.worldReference(env);
			element3.worldReference(env);
			element4.worldReference(env);
			element5.worldReference(env);


 			env.scene.add(element1);
			env.scene.add(element2);
			env.scene.add(element3);
			env.scene.add(element4);
			env.scene.add(element5);
			
		//	element1.actionRadius=300;
			
			element1.position.set(0,0,0);
			element2.position.set(-100,0,0);
			element3.position.set(0, 50 ,0);
			element4.position.set(100,0,0);
			element5.position.set(0, -100,0);

			console.log(element1);

			// element1.scale.set(10,10,10);
			// element2.scale.set(10,10,10);
			// element3.scale.set(10,10,10);
			// element4.scale.set(10,10,10);
			// element5.scale.set(10,10,10);


			// globalTick.addListener(element1.update, {bind: element1, eventName:"update"});
			// globalTick.addListener(element2.update, {bind: element2, eventName:"update"});
			// globalTick.addListener(element3.update, {bind: element3, eventName:"update"});
			// globalTick.addListener(element4.update, {bind: element4, eventName:"update"});
			// globalTick.addListener(element5.update, {bind: element5, eventName:"update"});




			// env.collisionDetection.addElement(element1);
			// env.collisionDetection.addElement(element2);
			// env.collisionDetection.addElement(element3);
			// env.collisionDetection.addElement(element4);
			// env.collisionDetection.addElement(element5);



			// var ray =  new THREE.Vector3(0,-1,0);
			// var caster = new THREE.Raycaster();



		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function() {
			loop.removeListener(globalTick.tick);
			loop.removeListener(env.render);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(atom);
})(jQuery, THREE, window, document)