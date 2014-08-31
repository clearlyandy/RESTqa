'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Request = mongoose.model('Request'),
    _ = require('lodash'),
    http = require('http'),
    url = require('url');


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
    if (typeof req.query.webserviceId === 'undefined' && typeof req.query.requestId === 'undefined') {
        return res.json(500, {
            error: 'webserviceId or requestId required - cannot list the requests'
        });
    }

    Request.find({
        $or: [{
            'web_service': req.query.webserviceId
        }, {
            '_id': req.query.requestId
        }]
    }).sort('-created').populate('user', 'name username').populate('web_service').exec(function(err, requests) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }

        if (typeof req.query.webserviceId !== 'undefined') {
            res.json(requests);
        } else if (typeof req.query.requestId !== 'undefined') {
            res.json(requests[0]);
        }
    });
};


exports.findOne = function(req, res) {
    Request.findById(req.params.requestId).sort('-created').populate('user', 'name username').populate('web_service').exec(function(err, requests) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }
        res.json(requests);
    });
};

var getParamObject = function(obj, parent) {
    if (parent === null) {
        parent = {};
    }
    for (var prop in obj.parameters) {
        var child = obj.parameters[prop];
        if (child.data_type === 'Object') {
            parent[child.name] = getParamObject(child, null);
        } else {
            parent[child.name] = child.value;
        }
    }

    return parent;
};


exports.test = function(req, res) {
    Request.findById(req.params.requestId).sort('-created').populate('user', 'name username').populate('web_service').exec(function(err, request) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the requests'
            });
        }

        var response = {};
        var paramObj = getParamObject(request, null);
        var params = Object.keys(paramObj).map(function(k) {
            var value = paramObj[k];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return encodeURIComponent(k) + '=' + encodeURIComponent(value);
        }).join('&');

        var options = {
            host: url.parse(request.web_service.endpoint).host,
            port: 80,
            path: url.parse(request.web_service.endpoint).path + '/?' + params,
            method: request.web_service.request_type
        };

        var testReq = http.request(options, function(testRes) {
            response.code = JSON.stringify(testRes.statusCode);
            response.headers = testRes.headers;
            response.body = '';
            testRes.setEncoding('utf8');
            testRes.on('data', function(chunk) {
                response.body += chunk;
            });
            testRes.on('end', function() {
                res.json(response);
            });
        });

        testReq.on('error', function(e) {
            res.json(e);
        });

        testReq.write(params);

        testReq.end();
    });
};