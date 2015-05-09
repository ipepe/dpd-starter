//Author: Patryk "ipepe" Ptasiński npm@ipepe.pl, credit to: schettino72
//Author: Patryk "ipepe" Ptasiński npm@ipepe.pl, credit to: schettino72
module.exports = (function(){
	var starter_instance = {
		config: {
			host: 'localhost',
			port: 3000,
			env: 'development',
			db: {
				host: 'localhost',
				port: 27017,
				name: 'deployd',
				credentials: {
					username: 'deployd',
					password: 'deployd'
				}
			}
		},
		setConfig: function(options){
			if(typeof options == "object"){
				starter_instance.config.host = options.host || starter_instance.config.host;
				starter_instance.config.port = options.port || starter_instance.config.port;
				starter_instance.config.env = options.env || starter_instance.config.env;
				if(typeof options.db == "object"){
					starter_instance.config.db.host = options.db.host || starter_instance.config.db.host;
					starter_instance.config.db.port = options.db.port || starter_instance.config.db.port;
					starter_instance.config.db.name = options.db.name || starter_instance.config.db.name;
					if(typeof options.db.credentials == "object"){
						starter_instance.config.db.credentials.username = options.db.credentials.username || starter_instance.config.db.credentials.username;
						starter_instance.config.db.credentials.password = options.db.credentials.password || starter_instance.config.db.credentials.password;
					}
				}
				if(typeof options.db_connection_url == "string"){
					starter_instance.setDbConfigFromUrl(options.db_connection_url);
				}
			}
			return starter_instance;
		},
		getUrlInstance: function(){
			if(starter_instance.url_instance){
				return starter_instance.url_instance;
			}else{
				starter_instance.url_instance = require('url');
				return starter_instance.url_instance;
			}
		},
		setDbConfigFromUrl: function(connection_string){
			var url = starter_instance.getUrlInstance();
			var parsed_url = url.parse(connection_string);

			var newDbConfig = {
				db: {
					host: parsed_url.hostname,
					port: parseInt(parsed_url.port),
					name: parsed_url.pathname.slice(1),
					credentials: {
						username: parsed_url.auth.split(':')[0],
						password: parsed_url.auth.split(':')[1]
					}
				}
			};
			starter_instance.setConfig(newDbConfig);
		},
		setCloudTo: function(cloud_name, cloud_options){
			if(typeof cloud_name !== 'string'){
				console.error('Cloud name parameter is type of', typeof cloud_name, 'but should be string');
				return starter_instance;
			}
			cloud_name = cloud_name.toLowerCase();
			switch(cloud_name){
				case 'auto':
				starter_instance.setCloudToAuto(cloud_options);
				break;
				case 'azure':
				starter_instance.setCloudToAzure(cloud_options);
				break;
				case 'openshift':
				starter_instance.setCloudToOpenShift(cloud_options);
				break;
				case 'heroku':
				starter_instance.setCloudToHeroku(cloud_options);
				break;
				default:
					console.error('Cloud definition', cloud_name, 'was not found');
			}
			return starter_instance;
		},
		detectCloudName: function(){
			if( starter_instance.isAzureCloud() ){
				return 'azure';
			}else if( starter_instance.isHerokuCloud() ){
				return 'heroku';
			}else if( starter_instance.isOpenShiftCloud() ){
				return 'openshift';
			}else{
				return 'unknown';
			}
		},
		setCloudToAuto: function(cloud_options){
			// TODO - czy nie dałoby rady lepiej wywolac ten detectCloud?
			starter_instance.setCloudTo( starter_instance.detectCloud(), cloud_options);

		},
		startServer: function(after_start_callback){
			var server = require('deployd')(starter_instance.config);
			server.listen();
			server.on('listening', function() {
				console.log('Server is listening at', server.options.host, server.options.port);
				if ( typeof after_start_callback === "function" ) after_start_callback();
			});
			server.on('error', function(err) {
				console.error( err );
				console.log('Error!', err);
				// Give the server a chance to return an error
				process.nextTick(function() {
					process.exit();
				});
			});
			return server;
		}

	};
	return starter_instance;
})();
