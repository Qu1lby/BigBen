/* Handles the routing queries */
module.exports = function (app, database, io, passport, passwordHash, router) {

	/** **Home page** */
	router.get('/', ensureAuthenticated, function (req, res, next) {

		// Catch all categories availables
		myQuery = 'SELECT category.*, matchs.point_match FROM category, game, matchs where category.id_category = game.id_category AND matchs.id_game = game.id_game AND matchs.id_user = 1';
		
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

			var arg = [];
			arg['title'] = "Welcome - BigBen";

			if (req.query.error != undefined) {
				if (req.query.error == "auth")
					arg['error'] = "Invalid authentification";
				else if (req.query.error == "signin")
					arg['error'] = "Username not available";
				else if (req.query.error == "tech")
					arg['error'] = "Something went wrong. Try again";
			}

			if (req.query.signin != undefined)
				arg['signin'] = "Account created, log in to continue";

			res.render('login.ejs', {
				arg: arg
			});
		}
	});

	/** **POST Methods** */
	router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login?error=auth',
	}));

	router.post('/signin', function (req, res, next) {
		if (req.body.username_si != undefined && req.body.password_si != undefined) {

			myQuery = "INSERT INTO user(name_user, pass_user) VALUES(" +
				database.escape(req.body.username_si) + ", '" +
				passwordHash.generate(req.body.password_si) + "')";

			var data_tmp = database.getSQL();
			data_tmp.query(myQuery, function (error, results) {

				if (error) {
					console.log("[ERR] " + error);
					console.log("[QUERY] " + myQuery);

					res.redirect('/login?error=signin')
					return;
				}

				// DISPLAY INSCRIPTION REUSSIE CONNECTEZ VOUS 
				res.redirect('/login?signin=true');
			});

		} else res.redirect('/login?error=tech');
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
