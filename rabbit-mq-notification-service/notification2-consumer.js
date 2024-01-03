require("dotenv").config();
const RabbitMqBroker = require("./clients/notification2");

async function consumer() {
  try {
    const broker = await RabbitMqBroker.getBroker();
    const subscription = await broker.subscribe("order_updated_sub");
    subscription
      .on("message", (message, content, ackOrNack) => {
        console.log(content);
        ackOrNack();
      })
      .on("error", (err) => {
        console.error("Subscriber error", err);
      })
      .on("invalid_content", (err, message, ackOrNack) => {
        console.error("Invalid content", err);
        ackOrNack(err);
      });
  } catch (err) {
    // subscription didn't exist
    console.error("Subscription error", err);
  }
}

consumer();
