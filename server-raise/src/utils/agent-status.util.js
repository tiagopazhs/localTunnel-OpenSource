const agentStatus = (agent) => {
    const status = () => {
      return {
        connectedSockets: agent.connectedSockets,
      };
    };
    return status;
  };
  
  module.exports = agentStatus;
  