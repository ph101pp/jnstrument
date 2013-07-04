(function($, THREE, window, document, undefined) {	
	var BSPCollisionDetection = function(){
		var elements = new (require("./ObjectStore"));
		var maxGridSize = 500;
		var maps = {};
		var world;
		var width;
		var height;
		var that;

///////////////////////////////////////////////////////////////////////////////
		this.construct = function(_world, _elements){
			this.addElements(_elements);
			world = _world;
			width = world.width;
			height = world.height;
			that = this;
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElements = function(_elements){
			if(typeof _elements === "object") 
				for(var i=0; i<_elements.length; i++) 
					this.addElement(_elements[i]);
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElement = function(element){
			if(!element.instanceof || !element.instanceof(require("./CollisionElement.js")))
				throw("Only instances of CollisionElement can be added to CollisionDetection.");			
			elements.store(element);
			addToMap(element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeElement = function(element){
			removeFromMap(element);
			elements.remove(element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.clearElements = function(){
			elements.removeAll();
			maps = {};
		}
///////////////////////////////////////////////////////////////////////////////
		this.testElement = function(element, bulk){
			var map = placeOnMap(element);
			var screenCoords = index2ScreenCoords(map.gridSize, map.i);
			var quadrantBounds = {
				x1 : screenCoords.x,
				y1 : screenCoords.y,
				x2 : screenCoords.x+map.gridSize-1, // -1 to make shure to not go into next quadrant if its the same size
				y2 : screenCoords.y-map.gridSize+1
			}

			for(gridSize in maps) 
				testMapArea(element, gridSize, quadrantBounds, bulk);
			testBounds(element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.testElements = function (){
			var objects = elements.getAllObjects();
			for(var i=0; i<objects.length; i++) {
				this.testElement(objects[i], true);
				removeFromMap(objects[i]);
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.reMap= function(){
			width = world.width;
			height = world.height;
			maps = {};
			var objects = elements.getAllObjects();
		//	console.log("remap", objects.length);
			for(var i=0; i<objects.length; i++) {
				objects[i].preReMap();
				addToMap(objects[i]);
			}

		}	
///////////////////////////////////////////////////////////////////////////////
		var removeFromMap = function(element){
			element = elements.get(element);
			var index = maps[element.data.gridSize][element.data.i].indexOf(element.object);
			maps[element.data.gridSize][element.data.i].splice(index, 1);
		}
///////////////////////////////////////////////////////////////////////////////
		var testBounds = function(element){
			var x= (Math.abs(element.position.x) > world.width/2-element.actionRadius);
			var y= (Math.abs(element.position.y) > world.height/2-element.actionRadius);

			if(x||y) 
				element.hitBounds(
					(y && element.position.y > 0), // top 
					(x && element.position.x > 0), // right
					(y && element.position.y < 0), // bottom
					(x && element.position.x < 0)  // left
				);
		}
///////////////////////////////////////////////////////////////////////////////
		var testMapArea = function(element, gridSize, areaBounds, bulk){
			var topIndex = screenCoords2Index(gridSize, areaBounds.x1, areaBounds.y1);
			var botIndex = screenCoords2Index(gridSize, areaBounds.x2, areaBounds.y2);
			var topCoords = index2QuadrantCoords(gridSize, topIndex);
			var botCoords = index2QuadrantCoords(gridSize, botIndex);

			var top = {
				x : topCoords.x-1,
				y : topCoords.y-1
			}
			var bot = {
				x : botCoords.x+1,
				y : botCoords.y+1
			}

			for(var i= top.x; i<=bot.x; i++)
				for(var k = top.y; k<= bot.y; k++) {
					index = quadrantCoords2Index(gridSize, i, k);
					if(index>=0 && maps[gridSize] && maps[gridSize][index])
						for(var o = 0; o < maps[gridSize][index].length; o++) 
							if(element !== maps[gridSize][index][o]) {
								element.collision(maps[gridSize][index][o], that);
								if(bulk === true) maps[gridSize][index][o].collision(element, that);
							}
				}
		}
///////////////////////////////////////////////////////////////////////////////
		var addToMap = function(element){
			var map = placeOnMap(element);
			maps[map.gridSize] = maps[map.gridSize]||{};
			maps[map.gridSize][map.i] = maps[map.gridSize][map.i] || [];
			maps[map.gridSize][map.i].push(element);
			elements.store(element, map);
		}
///////////////////////////////////////////////////////////////////////////////
		var placeOnMap= function(element){
			// element.geometry.computeBoundingSphere();
			// var minGridSize = element.geometry.boundingSphere.radius *2;
			var minGridSize = element.actionRadius*2;
			for(var i= 0; minGridSize < Math.floor(maxGridSize/Math.pow(2, i)); i++);	
			var gridSize = Math.floor(maxGridSize/Math.pow(2, i));
			return {
				gridSize : gridSize,
				i : screenCoords2Index(gridSize, element.position.x, element.position.y)
			}
		}	
///////////////////////////////////////////////////////////////////////////////	
		var quadrantCoords2Index = function(gridSize, x, y){
			var maxY = Math.ceil(width/gridSize);
			return y * maxY + x;
		}
///////////////////////////////////////////////////////////////////////////////
		var index2QuadrantCoords = function(gridSize, i) {
			var maxY = Math.ceil(width/gridSize);
			return {
				x : i % maxY,
				y : Math.floor(i/maxY)
			}
		}
///////////////////////////////////////////////////////////////////////////////
		var screenCoords2Index = function(gridSize, x,y){
			x+=width/2;
			y=y < 0 ? height/2+Math.abs(y) : height/2 - y;

			var coordX = Math.floor(x/gridSize);			
			var coordY = Math.floor(y/gridSize);

			return quadrantCoords2Index(gridSize, coordX, coordY);
		}
///////////////////////////////////////////////////////////////////////////////
		var index2ScreenCoords = function(gridSize, i){
			var coords = index2QuadrantCoords(gridSize, i);

			var x = coords.x*gridSize;
			var y = coords.y*gridSize;

			return {	
				x : x-width/2,
				y : y < height/2 ? height/2 - y : 0 - (y - height/2)
			}
		}	
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(BSPCollisionDetection);
})(jQuery, THREE, window, document)