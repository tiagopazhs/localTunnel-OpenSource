const TunnelAgentStats = (agent) => {
    const stats = () => {
      return {
        connectedSockets: agent.connectedSockets,
      };
    };
    return stats;
  };
  
  module.exports = TunnelAgentStats;
  