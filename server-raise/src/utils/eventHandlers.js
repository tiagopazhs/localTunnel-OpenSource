const handleOnline = (client, opt) => {
    console.log('client online %s', opt.id);
    clearTimeout(client.graceTimeout);
  };
  
  const handleOffline = (client, opt) => {
    console.log('client offline %s', opt.id);
  
    clearTimeout(client.graceTimeout);
  
    client.graceTimeout = setTimeout(() => {
      client.close();
    }, 1000).unref();
  };
  
  module.exports = { handleOnline, handleOffline };
  