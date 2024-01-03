const { v4: uuidv4 } = require("uuid");
const brokers = require("../clients/rabbitmq-broker-client");

async function placeOrder(call, callback) {
  const { product_id, quantity } = call.request;
  console.log(
    `Mock order placed for product id ${product_id} for quantity ${quantity}`
  );

  const order = {
    orderId: uuidv4(),
    productId: product_id,
    message: "success",
    status: 1,
  };
  console.log(order);

  try {
    //Rabbit mq publish
    const fanoutBroker = await brokers.RabbitMqFanoutBroker.getBroker();
    fanoutBroker.publish("order.create", order);

    console.log("Published post order events to RabbitMQ");
  } catch (err) {
    console.log("Error publishing to rabbitmq broker", err);
  }
  console.log("Called Place order");

  callback(null, order);
}


async function updateOrder(call, callback) {
  const { order_id, product_id, quantity } = call.request;
  console.log(
    `Order updated for order id ${order_id} product id ${product_id} for quantity ${quantity}`
  );

  const order = {
    orderId: order_id,
    productId: product_id,
    message: "success",
    status: 1,
  };
  console.log(order);

  try {
    //Rabbit mq publish
    const broker = await brokers.RabbitMqTopicBroker.getBroker();
    broker.publish("order.updated", order);
    console.log("Published post order events to RabbitMQ");
  } catch (err) {
    console.log("Error publishing to rabbitmq broker", err);
  }
  console.log("Called updated order");

  callback(null, order);
}

module.exports = {
  placeOrder: placeOrder,
  updateOrder: updateOrder,
};
