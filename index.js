module.exports = function (io) {

	return function (socket, next) {
		
		// Add client to a room based on querystring

		var room = socket.handshake['query']['room'];
		if (room) socket.join(room);

		// React to all events

		socket.onevent = function (packet) {
			if(packet.type == 2) {

				var type = packet.data[0];
				var data = packet.data[1];

				if (!data.clientID) data.clientID = socket.client.id;

				if (data.room) {
					io.to(data.room).emit(type, data);
				}

			}
		}

		return next ? next() : null;
	}

}