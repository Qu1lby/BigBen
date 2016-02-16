/* Handles the routing queries */
module.exports = function (app, database, io, router) {

  /** 
   * **Accueil :**
   * - Check if the terms has been seen before
   * - Fetch users for the search box
   * - Fecth the last 3 events and the last 4 articles
   **/
  router.get('/', function (req, res, next) {
    var arg = [];
    giveRender(req, res, 'index.ejs', 'Actualités - 1T', arg);
  });

  /** **Redirection on this specific error** */
  app.get('/css', function (req, res, next) {
    res.redirect('/404');
  });

  /** **Redirection on this specific error** */
  app.get('/img', function (req, res, next) {
    res.redirect('/404');
  });

  /** **Redirection on this specific error** */
  app.get('/js', function (req, res, next) {
    res.redirect('/404');
  });

  /** **Redirection for 404 errors** */
  app.use('*', function (req, res, next) {
    giveRender(req, res, '404.ejs', 'Erreur 404 - 1T');
  });


  /** 
   * **Take informations and build the view :**/
  function giveRender(req, res, page) {
    var render = [];
    res.render(page, {
      arg: render
    });
  }

}
