(function($, THREE, window, document, undefined) {	
	var CollisionDetection = function(){
		var rays = [];
		var elements = [];
///////////////////////////////////////////////////////////////////////////////
		this.testElement = function(element){
			var hitElements=[];
			var elementHits={};
			var id;
			for(var i=0; i<elements.length; i++) elements[i].material.side = THREE.DoubleSide;
			this.far = element.actionRadius;
			for(var i=0; i<rays.length; i++) {
				this.set(element.position, rays[i]);
				var hits = this.intersectObjects(elements, true);
				for(var k=0; k<hits.length; k++)
					if(hits[k].object !== element) {
						console.log("hit", hits[k].object.position);
						id = hitElements.indexOf(hits[k].object);
						if(id < 0) id=hitElements.push(hits[k].object)-1;
						if(typeof elementHits[id] !== "object") elementHits[id]=[];
						elementHits[id].push(hits[k]);
					}
			}
			for(var i=0; i<hitElements.length; i++) 
				element.collision(hitElements[i], elementHits[i], this);
			for(var i=0; i<elements.length; i++) elements[i].material.side = THREE.FrontSide;
		}
///////////////////////////////////////////////////////////////////////////////
		this.addRay = function(ray) {
			if(!(ray instanceof THREE.Vector3)) throw("Only instances of THREE.Vector3 can be rays.");
			rays.push(ray.normalize());
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeRay = function(ray){
			delete rays[rays.indexOf(ray)];
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElement = function(element){
			if(!element.instanceof(require("./CollisionElement.js"))) throw("Only instances of CollisionElement can be added to CollisionDetection.");
			elements.push(element);
		}
///////////////////////////////////////////////////////////////////////////////
		this.addElements = function(elements){
			for(var i=0; i<elements.length; i++) this.addElement(elements[i]);
		}
///////////////////////////////////////////////////////////////////////////////
		this.removeElement = function(element){
			delete elements[elements.indexOf(element)];
		}	
	}
///////////////////////////////////////////////////////////////////////////////
	module.exports = require("../Class.js").extend(THREE.Raycaster).extend(CollisionDetection);
})(jQuery, THREE, window, document)