'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    WebService = mongoose.model('WebService'),
    _ = require('lodash');


/**
 * Find web service by id
 */
exports.webservice = function(req, res, next, id) {
    WebService.load(id, function(err, webservice) {
        if (err) return next(err);
        if (!webservice) return next(new Error('Failed to load web service ' + id));
        req.webservice = webservice;
        next();
    });
};

/**
 * Create a web service
 */
exports.create = function(req, res) {
    var webservice = new WebService(req.body);
    webservice.user = req.user;

    webservice.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the web service'
            });
        }
        res.json(webservice);

    });
};

/**
 * Update a web service
 */
exports.update = function(req, res) {
    var webservice = req.webservice;

    webservice = _.extend(webservice, req.body);

    webservice.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the web service'
            });
        }
        res.json(webservice);

    });
};

/**
 * Delete a web service
 */
exports.destroy = function(req, res) {
    var webservice = req.webservice;

    webservice.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the web service'
            });
        }
        res.json(webservice);

    });
};

/**
 * Show a web service
 */
exports.show = function(req, res) {
    res.json(req.webservice);
};

/**
 * List of Web Services
 */
exports.all = function(req, res) {
    WebService.find().sort('+created').populate('user', 'name username').exec(function(err, webservices) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the web services'
            });
        }
        res.json(webservices);

    });
};