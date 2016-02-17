/* This module allow to connect the user with our Database */
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, database, passport) {

	passport.serializeUser(function (user, done) {
		done(null, user.id_user);
	});

	passport.deserializeUser(function (id_user, done) {
		database.executeQuery('SELECT * FROM user WHERE id_user = ' + id_user, function (rows) {
			done(null, rows[0]);
		});
	});

	passport.use(new LocalStrategy(
		function (username, password, done) {
			console.log('r'+ username);
			database.executeQuery('SELECT * FROM user WHERE name_user = "' + username + '" LIMIT 1', function (rows) {
				if (!rows.length)
					return done(null, false);

				if (password != rows[0].pass_user)
					return done(null, false);

				return done(null, rows[0]);
			});
		}));
}
