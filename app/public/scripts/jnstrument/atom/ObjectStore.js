(function($, THREE, window, document, undefined) {

	var ObjectStore = function(){

		var objects = [];
		var objectIndexes = {};
		var objectData = {};

///////////////////////////////////////////////////////////////////////////////
		this.store = function(object, id, data){
			if(!data && typeof object.data === "object" && typeof object.object === "object" && Object.getOwnPropertyNames(object).length === 2 ) {
				data = object.data;
				object = object.object;
			}
			if(typeof object !== "object") 
				throw("Only objects can be stored in ObjectStore");

			var index =  id != null ? 
				objectIndexes[id]: 
				objects.indexOf(object);

			if(index >= 0 && typeof objects[index] === "object") {
				id = id != null ? id : index;
				objects[index] = object;
				if(typeof data === "object") 
					objectData[index] = data;
				objectIndexes[id] = index;
			}
			else {
				delete objectIndexes[id];
				index = objects.push(object)-1;
				id = id != null ? id : index;
				
				objectData[index] = data;
				objectIndexes[id] = index;
			}
			return {
				object : objects[index],
				data : objectData[index] || {}
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function(query){
			var	index = typeof query === "object" ?
				objects.indexOf(query):
				objectIndexes[query];
			
			delete object[index];
			delete objectData[index];

			if(typeof query !== "object")
				delete objectIndexes[query];
		}
///////////////////////////////////////////////////////////////////////////////
		this.get = function(query){
			var	index = typeof query === "object" ?
				objects.indexOf(query):
				objectIndexes[query];

			if(index < 0 || index == null) return false;
			
			return {
				object : objects[index],
				data : objectData[index] || {}
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.getObjects = function(){
			var ret = []
			for(var i=0; i<objects.length; i++)
				ret.push({
					object : objects[i],
					data : objectData[i] || {}
				});
			return ret;
		}
///////////////////////////////////////////////////////////////////////////////
		this.size = function(){
			return objects.length;
		}


	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(ObjectStore);
})(jQuery, THREE, window, document)