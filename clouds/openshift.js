module.exports = {
  cloudName: ('openshift'),
  cloudConfig: {
    host: process.env.OPENSHIFT_NODEJS_IP,
    port: process.env.OPENSHIFT_NODEJS_PORT,
    env: process.env.NODE_ENV,
    db_connection_url: process.env.OPENSHIFT_MONGODB_DB_URL
  },
  isDetected: function(){
    for(var key in process.env){
      if( key.toLowerCase().indexOf('openshift') > -1){
        return true;
      }
    }
    return false;
  }
};
