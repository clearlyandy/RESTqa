'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Request = mongoose.model('Request'),
    _ = require('lodash');


/**
 * Find request by id
 */
exports.request = function(req, res, next, id) {
    Request.load(id, function(err, request) {
        if (err) return next(err);
        if (!request) return next(new Error('Failed to load request ' + id));
        req.request = request;
        next();
    });
};

/**
 * Create a request
 */
exports.create = function(req, res) {
    var request = new Request(req.body);
    console.log(request);
    request.user = req.user;

    request.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the request'
            });
        }
        res.json(request);

    });
};

/**
 * Update a request
 */
exports.update = function(req, res) {
    var request = req.request;

    request = _.extend(request, req.body);

    request.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the request'
            });
        }
        res.json(request);

    });
};

/**
 * Delete a request
 */
exports.destroy = function(req, res) {
    var request = req.request;

    request.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the request'
            });
        }
        res.json(request);

    });
};

/**
 * Show a request
 */
exports.show = function(req, res) {
    res.json(req.request);
};

/**
 * List of requests with a given web service ID.
 */
exports.all = function(req, res) {
    if (req.query.webserviceId === null) {
        return res.json(500, {
            error: 'Web service ID missing - cannot list the requests'
        });
    }

    Request.find({
        'web_service': req.query.webserviceId
    }).sort('-created').populate('user', 'name username').exec(function(err, requests) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }
        res.json(requests);

    });
};


exports.findOne = function(req, res) {
    Request.find().sort('+created').populate('user', 'name username').exec(function(err, requests) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }
        res.json(requests);

    });
};

exports.test = function(req, res) {
    Request.find().sort('+created').populate('user', 'name username').populate('web_service', 'name endpoint').exec(function(err, requests) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }


        res.json(requests);

    });
};