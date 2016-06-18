var read = require('fs').readFileSync;
var client = require('khoros-client');

module.exports = function (io, server) {

	// Serve client js.

	if (server) {
		var clientSource = read(require.resolve('khoros-client/khoros.js'), 'utf-8');

		server.on('request', function(req, res) {
			if (req.url == "/khoros/khoros.js") {
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.end(clientSource);
			}
		});
	}

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
						if (data.khoros.echo) {
							// Send to all including sender
							io.in(data.khoros.room).emit(type, data);
						} else {
							// Send to all except sender
							socket.broadcast.to(data.khoros.room).emit(type, data);
						}
						break;
				}

			}
		}

		return next ? next() : null;
	}

}
