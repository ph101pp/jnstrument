module.exports= function(){

	var io = require("socket.io");
	var connection = io.connect('127.0.0.1:8000');

	connection.emit("__pca__","hello", function(data){
		alert("responded");

	});


}