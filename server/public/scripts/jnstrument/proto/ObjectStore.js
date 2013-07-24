(function($, THREE, window, document, undefined) {

	var ObjectStore = function(){
		var objects = [];
		var objectIndexes = [];
		var objectData = [];
///////////////////////////////////////////////////////////////////////////////
		this.store = function(object, data){
			var id = data && data.id || null;
			if(typeof object !== "object" && typeof object !== "function") 
				throw("Only objects can be stored in ObjectStore");

			var index =  id != null ? 
				objectIndexes.indexOf(id): 
				objects.indexOf(object);

			if(index >= 0 && (typeof objects[index] === "object" || typeof objects[index] === "function")) {
				objects[index] = object;
				if(typeof data === "object") {
					objectData[index] = data;
					objectIndexes[index] = id;
				}
			}
			else {
				console.log("ObjectStore", "newElement");
				index = objects.push(object)-1;
				objectData[index] = data;
				objectIndexes[index] = id;
			}
			return {
				object : objects[index],
				data : objectData[index] || {}
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.remove = function(query){
			var	index = typeof query === "object" || typeof query === "function" ?
				objects.indexOf(query):
				objectIndexes.indexOf(id);

			objects.splice(index, 1);
			objectData.splice(index, 1);
			objectIndexes.splice(index, 1);
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeAll = function(query){
			objects = [];
			objectIndexes = [];
			objectData = [];
		}
///////////////////////////////////////////////////////////////////////////////
		this.get = function(query){
			var	index = typeof query === "object" || typeof query === "function" ?
				objects.indexOf(query):
				objectIndexes.indexOf(query);
			if(index < 0 || index == null) return false;
			return {
				object : objects[index],
				data : objectData[index] || {}
			}
		}
///////////////////////////////////////////////////////////////////////////////
		this.getAll = function(){
			var ret = [];
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