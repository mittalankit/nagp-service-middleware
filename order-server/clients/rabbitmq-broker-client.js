const Broker = require("rascal").BrokerAsPromised;
const brokerConfigTopic = require("../config/broker-config-topic.json");
const brokerConfigFanout = require("../config/broker-config-fanout.json");

class RabbitMqTopicBroker {
  constructor() {
    this.broker = undefined;
    brokerConfigTopic.vhosts["v1"].connection.url = process.env.RABBIT_MQ_URI;
  }

  static async getBroker() {
    try {
      if (!this.broker) {
        this.broker = await Broker.create(brokerConfigTopic);
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

class RabbitMqFanoutBroker {
  constructor() {
    this.broker = undefined;
    brokerConfigFanout.vhosts["v1"].connection.url = process.env.RABBIT_MQ_URI;
  }

  static async getBroker() {
    try {
      if (!this.broker) {
        this.broker = await Broker.create(brokerConfigFanout);
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

new RabbitMqFanoutBroker();


module.exports = {
  RabbitMqTopicBroker: RabbitMqTopicBroker,
  RabbitMqFanoutBroker: RabbitMqFanoutBroker,
};
