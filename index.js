module.exports = function (server) {

	// Serve client js.
	// TODO: Read this in a better way.

	var fs = require("fs");
	var clientJS = fs.readFileSync("../khoros-client/khoros.js");

	server.on('request', function(req, res) {
		if (req.url == "/khoros/khoros.js") {
  			res.writeHead(200, {"Content-Type": "text/plain"});
  			res.end(clientJS);
		}
	});

	// Return middleware.

	return function (socket, next) {

		socket.onevent = function (packet) {
			if(packet.type == 2) {

				var type = packet.data[0];
				var data = packet.data[1];

				switch(type) {
					case "khoros.join":
						console.log("New listener in room: " + data.khoros.room);
						socket.join(data.khoros.room);
					break;
					default:
						data.khoros.clientID = socket.client.id;
						socket.broadcast.to(data.khoros.room).emit(type, data);
						break;
				}

			}
		}

		return next ? next() : null;
	}

}