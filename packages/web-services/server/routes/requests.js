'use strict';

var requests = require('../controllers/requests');

// Request authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.request.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Requests, app, auth) {
    app.route('/requests')
        .get(auth.requiresLogin, hasAuthorization, requests.all)
        .post(auth.requiresLogin, hasAuthorization, requests.create);
    app.route('/requests/:requestId/test')
        .get(auth.requiresLogin, hasAuthorization, requests.test);
    app.route('/requests/:requestId')
        .get(auth.requiresLogin, hasAuthorization, requests.findOne)
        .put(auth.requiresLogin, hasAuthorization, requests.update)
        .delete(auth.requiresLogin, hasAuthorization, requests.destroy);

    // Finish with setting up the requestId param
    app.param('requestId', requests.request);
};