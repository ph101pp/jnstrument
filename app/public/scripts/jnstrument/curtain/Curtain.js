(function($, THREE, window, document, undefined) {	
	var curtain = function(){
		var globalTick, world, loop, socket, that;
		var elements = new (require("./ObjectStore"));
		var stage;

		this.uniforms = {
			lerpAlpha : { type:"f", value:0.5 },
			radius : { type:"f", value:1 },			
			outbound : { type:"f", value:0 },
			inbound : { type:"f", value:0 }
		};


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
			loop.addListener(world.render, { bind:world });
			globalTick.addListener(world.onWindowResize, { bind:world, eventName :"resize" });
			globalTick.activate();


			var geometry = new THREE.Geometry()

			geometry.vertices.push( new THREE.Vector3( -10,  10, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 10, -10, 0 ) );
			geometry.vertices.push( new THREE.Vector3( -10, -10, 0 ) );
			geometry.faces.push( new THREE.Face4( 0, 1, 2, 3, new THREE.Vector3( 0, 0, -1 ), 0xFF00FF, 0) );
		
			var material =  new THREE.ShaderMaterial({ uniforms:this.uniforms, vertexShader:AEROTWIST.Shaders.CurtainElement.vertex, fragmentShader:AEROTWIST.Shaders.CurtainElement.fragment});
			material.side = THREE.DoubleSide;
			stage = new THREE.Mesh(geometry, material);
			world.scene.add(stage);

			stage.scale.set(world.width, world.height, 1);

			globalTick.addListener(function(){
			}, {eventName :"calculate"});


			socket.addListener(function(data){



			});

		}

		this.createTextureFromArray = function(array) {
			var texH = array.length;
			var texW = 0;
			var data = [];
			var addColor = function(num) {
				typeof num !== "integer" && throw("Error Array must only contain integers");
				color = int2RGBA(num);
				data.push(color.r);
				data.push(color.g);
				data.push(color.b);
				data.push(color.a);
			}
			var color;
			for(var i=0; i<array.length; i++)
				if(typeof array[i] === "object") {
					texW=Math.max(texW, array[i].length);
					for(var k=0; k<array[i].length; k++) {
						addColor(array[i][k]);
					}
				}
				else addColor(array[i]);





		}
///////////////////////////////////////////////////////////////////////////////
		var int2RGBA = function(num){
			num >>>= 0;
			var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16,
				a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
			return {r : r, g:g, b:b, a:a};
		}
///////////////////////////////////////////////////////////////////////////////
		var RGBA2int = function(r,g,b,a) {
			return ((a << 24) | (r << 16) | (g << 8) | b);
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