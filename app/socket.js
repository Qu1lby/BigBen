/* Handles the socket.IO requests */

module.exports = function (app, database, io) {

	/** **When there is a connection to socket.IO :**/
	io.sockets.on('connection', function (socket) {

		/* Update current user and store informations */
		if (socket.handshake.session.passport != undefined) {
			if (socket.handshake.session.passport.user != undefined) {
				database.executeQuery('SELECT * FROM users WHERE id_user = ' + socket.handshake.session.passport.user, function (result) {
					socket.handshake.session.user = result[0];
					console.log('Saving user');
				});
			}
		}

		/** **Start a game :** 
		 * Call when the user click on play
		 * Parameters needed : category, level
		 **/
		socket.on('play_first', function (data) {

			var myQuery = 'SELECT * FROM match, game WHERE id_user = ' + req.user.id_user + ' AND id_category = ' + data.category;
			var myGame = 0;
			database.executeQuery(myQuery, function(result) {
				if (result.length == 0) {
					myQuery = 'INSERT INTO game(id_category) VALUES ( ' + data.category + ' )';
					database.executeQuery(myQuery, function(result) {
						myGame = result[0].id_game;
						myQuery = 'INSERT INTO match(id_game, id_user) VALUE ( ' + myGame + ', ' + data.id_user + ')';
					});
				}
			});
		});
		/*
						AJOUTER LES QUESTIONS
						var myQuery = 'UPDATE points SET vu = 1 WHERE vu = 0 AND id_1a = ' + socket.handshake.session.user.id_user; database.executeQuery(myQuery, function (result) {

							socket.emit('question', {
								question: data.point,
								a_1: data.id_user,
								a_2: data.id_user,
								a_3: data.id_user,
								a_4: data.id_user,
							});
						});
					});

		*/


	});
}
