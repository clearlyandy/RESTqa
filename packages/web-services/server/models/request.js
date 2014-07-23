'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Web  Schema
 */
var RequestSchema = new Schema({
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
    payload: {
        type: String,
        required: true,
        trim: true
    },
    expected_output: {
        type: String,
        trim: true
    },
    web_service: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
RequestSchema.path('name').validate(function(name) {
    return !!name;
}, 'Name cannot be blank');

RequestSchema.path('payload').validate(function(payload) {
    return !!payload;
}, 'Payload cannot be blank');

RequestSchema.path('web_service').validate(function(web_service) {
    return !!web_service;
}, 'Web service cannot be blank');

/**
 * Statics
 */
RequestSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Request', RequestSchema);