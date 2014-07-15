'use strict';

var webservices = require('../controllers/web-services');

// Web service authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.webservice.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(WebServices, app, auth) {

    app.route('/web-services')
        .get(webservices.all)
        .post(auth.requiresLogin, webservices.create);
    app.route('/web-services/:webserviceId')
        .get(webservices.show)
        .put(auth.requiresLogin, hasAuthorization, webservices.update)
        .delete(auth.requiresLogin, hasAuthorization, webservices.destroy);

    // Finish with setting up the webserviceId param
    app.param('webserviceId', webservices.webservice);
};