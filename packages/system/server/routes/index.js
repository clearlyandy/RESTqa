'use strict';

module.exports = function(System, app, auth, database) {

	// Home route
	var index = require('../controllers/index');
	app.route('/')
		.get(index.render);

	app.get('/version', function(req,res){
        res.json({
            "NODE_ENV" : process.env.NODE_ENV
        });
    });

};
