/* Handles the routing queries */
module.exports = function (app, database, io, passport, router) {

	/** Home page */
	router.get('/', function (req, res, next) {
		var arg = [];
		giveRender(req, res, 'index.ejs', 'Home - BigBen project', arg);
	});


	/** Home page for unauthentified user */
	router.get('/login', function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/');

		} else {
			var arg = [];
			if (req.query.error != undefined)
				arg['error'] = true;

			res.render('login.ejs', {
				arg: arg
			});
		}
	});

	router.post('/login', passport.authenticate('local'), function (req, res) {
		if (ensureAuthenticated) {
			res.redirect('/');
		} else redirect('/login?error=true');
	});

	
	

	/** Launch a new game */
	router.get('/play', ensureAuthenticated, function (req, res, next) {
		var arg = [];
		giveRender(req, res, 'game.ejs', 'Play - BigBen project', arg);
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


	/** Take informations and build the view */
	function giveRender(req, res, page, title) {
		var render = [];
		render['title'] = title;
		
		res.render(page, {
			arg: render
		});
	}

	/** Ensure user is log-in */
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else res.redirect('/login');
	}
}
