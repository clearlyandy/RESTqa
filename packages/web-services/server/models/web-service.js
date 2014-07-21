'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Web  Schema
 */
var WebServiceSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    endpoint: {
        type: String,
        required: true,
        trim: true
    },
    parameters: {
        type: Schema.Types.Mixed,
        required: false
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
WebServiceSchema.path('name').validate(function(name) {
    return !!name;
}, 'Name cannot be blank');

WebServiceSchema.path('endpoint').validate(function(endpoint) {
    return !!endpoint;
}, 'Endpoint cannot be blank');

/**
 * Statics
 */
WebServiceSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('WebService', WebServiceSchema);