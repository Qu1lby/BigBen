/* Handles the socket.IO requests */

module.exports = function (app, database, io) {

	/** **When there is a connection to socket.IO :**/
	io.sockets.on('connection', function (socket) {

		/* Update current user and store informations */
		if (socket.handshake.session.passport != undefined) {
			if (socket.handshake.session.passport.user != undefined) {
				database.executeQuery('SELECT * FROM user WHERE id_user = ' + socket.handshake.session.passport.user, function (result) {
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
			var myQuery = 'SELECT * FROM matchs, game WHERE id_user = ' + socket.handshake.session.user.id_user + ' AND id_category = ' + data.category;
			database.executeQuery(myQuery, function (res_1) {
				//				if (res_1.length == 0) {
				//					myQuery = 'INSERT INTO game(id_category) VALUES ( ' + data.category + ' )';
				//					database.executeQuery(myQuery, function (res_2) {
				//						myGame = res_2[0].id_game;
				//						myQuery = 'INSERT INTO matchs(id_game, id_user) VALUE ( ' + myGame + ', ' + data.id_user + ')';
				//					});
				//				} else myGame = res_1[0].id_game;
				//				console.log(myGame);

				// Save in session
				socket.handshake.session.id_game = res_1[0].id_game;

				myQuery = 'SELECT * FROM question NATURAL JOIN level WHERE level = 1 AND id_category = ' + data.category;
				database.executeQuery(myQuery, function (res_3) {

					var random = Math.floor((Math.random() * res_3.length));

					socket.emit('question', {
						id_game: res_1[0].id_game,
						id_question: res_3[random].id_question,
						question: res_3[random].text_question,
						a_1: res_3[random].answer_1,
						a_2: res_3[random].answer_2,
						a_3: res_3[random].answer_3,
						a_4: res_3[random].answer_4
					});
				});
			});
		});

		/** **Check an answer :** 
		 * Parameters needed : id_question, answer
		 **/
		socket.on('get_answer', function (data) {
			var myQuery = 'SELECT answer FROM question WHERE id_question = ' + data.id_question;
			database.executeQuery(myQuery, function (result) {
				if (result.length == 0) {
					socket.emit('back_answer', {
						verdict: false,
						wrong: data.answer
					});
				}
				if (data.answer == result[0].answer) {
					socket.emit('back_answer', {
						verdict: true
					});
				} else {
					socket.emit('back_answer', {
						verdict: false,
						wrong: data.answer
					});
				}
			});
		});

		/** **Check an answer :** 
		 * Parameters needed : id_question, answer
		 **/
		socket.on('get_50', function (data) {
			var myQuery = 'SELECT * FROM question WHERE id_question = ' + data.id_question;

			database.executeQuery(myQuery, function (result) {
				if (result[0].answer == 1)
					socket.emit('back_50', {
						q_1: 2,
						q_2: 4
					});

				if (result[0].answer == 2)
					socket.emit('back_50', {
						q_1: 3,
						q_2: 4
					});

				if (result[0].answer == 3)
					socket.emit('back_50', {
						q_1: 1,
						q_2: 4
					});

				if (result[0].answer == 4)
					socket.emit('back_50', {
						q_1: 2,
						q_2: 3
					});
			});
		});

		/** **Next question :** 
		 * Parameters needed : level, category
		 **/
		socket.on('next_one', function (data) {

			if (data.level == 11) {
				var random = (Math.floor((Math.random() * 10) * 15));
				var point = 1000;

				myQuery = 'UPDATE matchs SET point_match = ' + (point + random) + ' WHERE id_game = ' + socket.handshake.session.id_game;
				database.executeQuery(myQuery, function (res) {
					socket.emit('end_win', {
						random: random,
						points: point
					});
				});
			} else {

				var myQuery = 'SELECT * FROM question NATURAL JOIN level WHERE level = ' + data.level + ' AND id_category = ' + data.category;
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
			}
		});

		/** **Game Over :** 
		 * Parameters needed : level
		 **/
		socket.on('game_over', function (data) {

			var random = (Math.floor((Math.random() * data.level) * 20));
			var point = (10 * data.level * data.level)

			myQuery = 'UPDATE matchs SET point_match = ' + (point + random) + ' WHERE id_game = ' + socket.handshake.session.id_game;
			database.executeQuery(myQuery, function (res) {
				socket.emit('end', {
					random: random,
					points: point
				});
			});
		});
	});
}
