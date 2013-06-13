(function($, THREE, window, document, undefined) {	
	var base = function(){
		var globalTick, env, loop, socket, that;

		var elements = new (require("./ObjectStore"));
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


			globalTick.addListener(function(){
			}, {eventName :"calculate"});

			socket.addListener(function(data){

			});

		}


///////////////////////////////////////////////////////////////////////////////
		this.remove = function() {
			loop.removeListener(globalTick.tick);
			loop.removeListener(env.render);
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js")(base);
})(jQuery, THREE, window, document)