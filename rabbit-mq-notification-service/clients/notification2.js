const Broker = require("rascal").BrokerAsPromised;
const brokerConfig = require("../config/order-updated-broker.json");

class RabbitMqBroker {
  constructor() {
    this.broker = undefined;
    brokerConfig.vhosts["v1"].connection.url = process.env.RABBIT_MQ_URI;
  }

  static async getBroker() {
    try {
      if (!this.broker) {
        this.broker = await Broker.create(brokerConfig);
        this.broker.on("error", (err, { vhost, connectionUrl }) => {
          console.error("Broker error", err, vhost, connectionUrl);
        });
        this.broker.on("blocked", (reason, { vhost, connectionUrl }) => {
          console.log(
            `Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`
          );
        });
        this.broker.on("unblocked", ({ vhost, connectionUrl }) => {
          console.log(`Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`);
        });
      }
      return this.broker;
    } catch (err) {
      console.log("Error while connecting to RabbitMq", err);
      throw err;
    }
  }
}
new RabbitMqBroker();

module.exports = RabbitMqBroker;
