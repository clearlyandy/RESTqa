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
        .get(requests.all)
        .post(auth.requiresLogin, requests.create);
    app.route('/requests/:requestId')
        .get(requests.show)
        .put(auth.requiresLogin, hasAuthorization, requests.update)
        .delete(auth.requiresLogin, hasAuthorization, requests.destroy);

    // Finish with setting up the requestId param
    app.param('requestId', requests.request);
};