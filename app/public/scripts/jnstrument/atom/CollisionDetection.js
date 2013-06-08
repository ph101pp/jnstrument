(function($, THREE, window, document, undefined) {	
	var CollisionDetection = function(){
		var rays = [];
		var elements = [];
///////////////////////////////////////////////////////////////////////////////
		this.testElement = function(element, group, recursive, bulk){
			var hitElements=[];
			var elementHits={};
			var id;
			for(var i=0; i<elements.length; i++) elements[i].preCollisionDetection();
			for(var i=0; i<rays.length; i++) {
				var rayPosition = element.position.clone();
				rayPosition.z = 1;
				this.set(rayPosition, rays[i]);
				var hits = this.intersectObjects(elements, group || recursive);
				for(var k=0; k<hits.length; k++)
					if(hits[k].object !== element) {
						if(group === true) 
							while(elements.indexOf(hits[k].object) < 0)
								hits[k].object = hits[k].object.parent;
						id = hitElements.indexOf(hits[k].object);
						if(id < 0) id=hitElements.push(hits[k].object)-1;
						if(typeof elementHits[id] !== "object") elementHits[id]=[];
						elementHits[id].push(hits[k]);
					}
			}
			for(var i=0; i<hitElements.length; i++) 
				if(hitElements[i] !== element) {
					element.collision(hitElements[i], elementHits[i], this);	
					if(bulk === true) hitElements[i].collision(element, elementHits[i], this);
				}
		
			for(var i=0; i<elements.length; i++) elements[i].postCollisionDetection;
		}
///////////////////////////////////////////////////////////////////////////////
		this.testElements = function(group, recursive){
			var temp =[];
			var element;
			while(elements.length > 0) {
				element= elements.shift();
				this.testElement(element, group, recursive, true);
				temp.push(element);
			}
			elements = temp;
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