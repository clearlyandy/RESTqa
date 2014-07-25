'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var WebServices = new Module('web-services');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
WebServices.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    WebServices.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    WebServices.menus.add({
        title: 'Web Services',
        link: 'web services',
        roles: ['authenticated'],
        menu: 'main'
    });

    WebServices.menus.add({
        title: 'Tests',
        link: 'tests',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    WebServices.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    WebServices.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    WebServices.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    WebServices.aggregateAsset('css', 'mvpready-admin.css');
    WebServices.aggregateAsset('css', 'mvpready-flat.css');
    WebServices.aggregateAsset('css', 'web-services.css');

    return WebServices;
});