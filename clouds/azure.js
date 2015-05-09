module.exports = {
  cloudName: ('azure'),
  cloudConfig: {
    port: (process.env.port || 3000),
    db_connection_url: process.env.CUSTOMCONNSTR_MONGODB_URL
  },
  isDetected: function(){
    for(var key in process.env){
      if( key.indexOf('azure') > -1){
        return true;
      }
    }
    return false;
  }
};
