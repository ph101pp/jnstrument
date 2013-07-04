(function($, THREE, window, document, undefined) {

	var ObjectStore = function(){
		var empty = {}
		var objects = [];
		var objectIndexes = [];
		var objectData = [];
		this.length=0;
///////////////////////////////////////////////////////////////////////////////
		this.store = function(object, data){
			if(typeof object !== "object" && typeof object !== "function") 
				throw("Only objects and functions can be stored in ObjectStore");
			var id = data && data.id || null;

			var index =  id != null ? 
				objectIndexes.indexOf(id): 
				objects.indexOf(object);

			if(index >= 0) {
				objects[index] = object;
				if(typeof data === "object") {
					objectData[index] = data;
					objectIndexes[index] = id;
				}
			}
			else {
				//console.log("ObjectStore", "newElement");
				index = objects.length;
				objects[index] = object;
				objectData[index] = data;
				objectIndexes[index] = id;
			}
			this.length = this.size();
			return {
				object : objects[index],
				data : objectData[index] || empty
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function(query){
			var	index = typeof query === "object" || typeof query === "function" ?
				objects.indexOf(query):
				objectIndexes.indexOf(id);

			var object = {
				object : objects[index],
				data : objectData[index] || empty
			}

			objects.splice(index, 1);
			objectData.splice(index, 1);
			objectIndexes.splice(index, 1);
			this.length = this.size();

			return object;
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeAll = function(query){
			objects = [];
			objectIndexes = [];
			objectData = [];
			this.length = this.size();
		}
///////////////////////////////////////////////////////////////////////////////
		this.get = function(query){
			var	index = typeof query === "object" || typeof query === "function" ?
				objects.indexOf(query):
				objectIndexes.indexOf(query);

			return index >= 0 ? {
					object : objects[index],
					data : objectData[index] || empty
				}:false;
		}
///////////////////////////////////////////////////////////////////////////////
		this.getAll = function(){
			return {
				objects : objects,	
				data : objectData,
				ids : objectIndexes
			};
		}
///////////////////////////////////////////////////////////////////////////////
		this.getAllObjects = function(){
			return objects;
		}
///////////////////////////////////////////////////////////////////////////////
		this.size = function(){
			return objects.length;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(ObjectStore);
})(jQuery, THREE, window, document)