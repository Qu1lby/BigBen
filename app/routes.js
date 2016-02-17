/* Handles the routing queries */
module.exports = function (app, database, io, passport, router) {

	/** **Home page** */
	router.get('/', ensureAuthenticated, function (req, res, next) {

		// Catch all categories availables
		database.executeQuery("SELECT * FROM category", function (result) {

			var arg = [];
			arg['categories'] = result;
			arg['user_id'] = req.user.id_user;
			arg['user_name'] = req.user.name;
			giveRender(req, res, 'index.ejs', 'Home - BigBen project', arg);
		});
	});

	
	/** **Launch a new game** */
	router.get('/play', ensureAuthenticated, function (req, res, next) {
		giveRender(req, res, 'game.ejs', 'Play - BigBen project');
	});


	/** **Home page for unauthentified user** */
	router.get('/login', function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/');
		} else {

			// If true : Connection refused
			var arg = [];
			if (req.query.error != undefined)
				arg['error'] = req.query.error;

			res.render('login.ejs', {
				arg: arg
			});
		}
	});
	
	/** **POST Methods** */
	router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login?error=true',
	}));

	router.post('/signin', function (req, res, next) {
		// Check if we have all the informations
		if (req.body.username_si != undefined && req.body.password_si != undefined) {

			myQuery = "INSERT INTO user(name_user, pass_user) VALUES(" +
				database.escape(req.body.username_si) + ", " +
				database.escape(req.body.password_si) + ")";

			var data_tmp = database.getSQL();
			data_tmp.query(myQuery, function (error, results) {

				if (error) {
					console.log('[ERR] ' + error);
					console.log('[QUERY] ' + myQuery);

					// UTILISATEUR EXISTANT + FAKE CLIK CREATE (afficher direct bonne fenêtre)
					res.redirect('/login?signin=false')
					return;
				}

				// DISPLAY INSCRIPTION REUSSIE CONNECTEZ VOUS 
				res.redirect('/login?signin=true');
			});

		} else res.redirect('/login?signin=false');
	});

	/** **Log-out** */
	router.get('/logout', function (req, res, next) {
		req.session.destroy();
		res.redirect('/');
	});


	/** **Redirection on this specific error** */
	app.get('/css', ensureAuthenticated, function (req, res, next) {
		res.redirect('/404');
	});

	/** **Redirection on this specific error** */
	app.get('/img', ensureAuthenticated, function (req, res, next) {
		res.redirect('/404');
	});

	/** **Redirection on this specific error** */
	app.get('/js', ensureAuthenticated, function (req, res, next) {
		res.redirect('/404');
	});


	/** **Redirection for 404 errors** */
	app.use('*', ensureAuthenticated, function (req, res, next) {
		giveRender(req, res, '404.ejs', 'Error 404');
	});


	/** **Take informations and build the view** */
	function giveRender(req, res, page, title) {
		var render = [];
		render['title'] = title;

		res.render(page, {
			arg: render
		});
	}

	/** **Ensure user is log-in** */
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else res.redirect('/login');
	}
}
