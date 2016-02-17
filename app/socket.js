/* Handles the socket.IO requests */

module.exports = function (app, database, io) {

	/** **When there is a connection to socket.IO :**/
	io.sockets.on('connection', function (socket) {

		/* Update current user and store informations */
		if (socket.handshake.session.passport != undefined) {
			if (socket.handshake.session.passport.user != undefined) {
				database.executeQuery('SELECT * FROM users WHERE id_user = ' + socket.handshake.session.passport.user, function (result) {
					socket.handshake.session.user = result[0];
					console.log('Saving user')
				});
			}
		}
	});
}
