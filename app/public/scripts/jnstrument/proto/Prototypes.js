(function($, THREE, window, document, undefined) {	
	var atom = function(){
		var globalTick, env, loop, socket, that;

		var elements = new (require("./ObjectStore"));

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_socket, _loop){		
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


			var objects, position;
			// Group1 
			objects = [
				new (require("./FunctionElement.js"))(),
				new (require("./FunctionElement.js"))(),
				new (require("./FunctionElement.js"))()
			];
			position = new THREE.Vector3(-500,200,0);
			this.createGroup("one",position, objects);

			// Group2
			objects = [
				new (require("./FunctionElement1.js"))(),
				new (require("./FunctionElement1.js"))(),
				new (require("./FunctionElement1.js"))()
			];
			position = new THREE.Vector3(-500,0,0);
			this.createGroup("two",position, objects);

			// Group3 
			objects = [
				new (require("./FunctionElement2.js"))(),
				new (require("./FunctionElement2.js"))(),
				new (require("./FunctionElement2.js"))()
			];
			position = new THREE.Vector3(300,200,0);
			this.createGroup("three",position, objects);



			$(window).click(eventHandler);		

			var interval;
			$(window).mousedown(function() {
				interval = setInterval(eventHandler, 10);
			});

			$(window).mouseup(function() {
				clearInterval(interval);
			});
		}
///////////////////////////////////////////////////////////////////////////////
		var eventHandler = function() {
			var objects = elements.getAll();
			var groups = {};

			for(var i=0; i<objects.length; i++) {
				if(!groups[objects[i].data.name]) groups[objects[i].data.name] = {};
				groups[objects[i].data.name][objects[i].data.type]=objects[i].object;
			}

			for(i in groups) {
				var caller = groups[i].caller;
				var forward = groups[i].forward;
				var receiver = groups[i].receiver;

				caller.outboundEvent(forward);
				forward.inboundEvent(caller);
		
				forward.outboundEvent(receiver);
				receiver.inboundEvent(forward);

			}

		}
///////////////////////////////////////////////////////////////////////////////
		this.createGroup = function(name, position, objects){
			var caller, forward, receiver;

			caller = objects[0];
			caller.position=position;
			globalTick.addListener(caller.update, {bind:caller, eventName:"update"});
			env.scene.add(caller);
			elements.store(caller,{name:name, type:"caller"});

			forward = objects[1];
			forward.position= position.clone().sub(new THREE.Vector3(-100, 0, 0));
			globalTick.addListener(forward.update, {bind:forward, eventName:"update"});
			env.scene.add(forward);
			elements.store(forward,{name:name, type:"forward"});

			receiver = objects[2];
			receiver.position= position.clone().sub(new THREE.Vector3(-200, 0, 0));
			globalTick.addListener(receiver.update, {bind:receiver, eventName:"update"});
			env.scene.add(receiver);
			elements.store(receiver,{name:name, type:"receiver"});
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