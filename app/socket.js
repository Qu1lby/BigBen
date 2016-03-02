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
		 * Parameters needed : category
		 **/
		socket.on('play_first', function (data) {

			var myQuery = 'SELECT * FROM matchs, game WHERE id_user = ' + req.user.id_user + ' AND id_category = ' + data.category;
			var myGame = 0;
			database.executeQuery(myQuery, function (res_1) {
				if (res_1.length == 0) {
					myQuery = 'INSERT INTO game(id_category) VALUES ( ' + data.category + ' )';
					database.executeQuery(myQuery, function (res_2) {
						myGame = res_2[0].id_game;
						myQuery = 'INSERT INTO matchs(id_game, id_user) VALUE ( ' + myGame + ', ' + data.id_user + ')';
					});
				} else myGame = res_1[0].id_game;
				
				// Save in session
				socket.handshake.session.passport.user.id_game = myGame;
				
				myQuery = 'SELECT * FROM question NATURAL JOIN level WHERE level = 1 AND id_category = ' + data.category;
				database.executeQuery(myQuery, function (res_3) {

					var random = Math.floor((Math.random() * res_3.length));

					socket.emit('question', {
						id_game: myGame,
						id_question: res[random].id_question,
						question: res[random].text_question,
						a_1: res[random].answer_1,
						a_2: res[random].answer_2,
						a_3: res[random].answer_3,
						a_4: res[random].answer_4
					});
				});
			});
		});

		/** **Check an answer :** 
		 * Parameters needed : id_question, answer
		 **/
		socket.on('get_answer', function (data) {
			var myQuery = 'SELECT answer FROM question WHERE id_question = ' + date.id_question;
			database.executeQuery(myQuery, function (result) {
				if (result.length == 0) {
					socket.emit('back_answer', {
						verdict: false
					});
				}

				if (data.answer == result[0]) {
					socket.emit('back_answer', {
						verdict: true
					});
				} else {
					socket.emit('back_answer', {
						verdict: false
					});
				}
			});
		});

		/** **Next question :** 
		 * Parameters needed : level, category
		 **/
		socket.on('next_one', function (data) {
			myQuery = 'SELECT * FROM question NATURAL JOIN level WHERE level = ' + data.level + ' AND id_category = ' + data.category;
			database.executeQuery(myQuery, function (result) {
				var random = Math.floor((Math.random() * result.length));

				socket.emit('question', {
					id_question: result[random].id_question,
					question: result[random].text_question,
					a_1: result[random].answer_1,
					a_2: result[random].answer_2,
					a_3: result[random].answer_3,
					a_4: result[random].answer_4
				});
			});
		});
		
		/** **Game Over :** 
		 * Parameters needed : level
		 **/
		socket.on('next_one', function (data) {
			
			var point = (100 * data.level) + (Math.floor((Math.random() * data.level) * 25)
																				
			myQuery = 'UPDATE matchs SET point_match = ' + points + ' WHERE id_game = ' + socket.handshake.session.passport.user.id_game;
			database.executeQuery(myQuery, function (res) {
				socket.emit('end');
			});
		});

	});
}
