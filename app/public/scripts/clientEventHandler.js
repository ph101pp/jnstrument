module.exports= function(guid){


	var connection = require("socket.io-client").connect('127.0.0.1:8000');

	connection.emit("__pca__Connect_Receiver",{guid:guid}, function(data){
		console.log("Connected", data);
		if(data.status == 404) connection.disconnect();
	});

	connection.on("__pca__Event", function(data, answer){
		console.log("Received", data);
	});
}