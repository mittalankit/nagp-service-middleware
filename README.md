# gRPC RabbitMQ Demo

### **Pre-requisites and assumptions**
Following softwares should be installed
- Nodejs >= 16
- npm (bundles with nodejs)
- RabbitMq running

Following ports should be available for the nodejs services:
- Product service http server: 8000
- Order service gRPC server: 50051

### **How to install** (Already done in the attached zip)
- For services - order-server, rabbit-mq-notification-service
  1. Rename the `dev.env` to `.env`
  2. Put the appropriate env details in all 3 `.env` files with information for RabbitMq and Kafka clusters, and put all relevant information by replacing all placeholders
- Run `npm install` in all the 4 services
  1. Go to `product-service` folder and run `npm install`
  2. Go to `order-server` folder and run `npm install`
  3. Go to `rabbit-mq-notification-service` folder and run `npm install`

### **How to run**
- Run each service in a separate terminal
  1. Go to `product-service` folder and run `npm start`
  2. Go to `order-server` folder and run `npm start`
  3. Go to `rabbit-mq-notification-service` folder 
    - Start Notification 1 service to listen order create event only `node notification1-consumer.js`
    - Start Notification 1 service to listen order create and updated event `node notification2-consumer.js`

### **APIs**
1. List all products  
```
  GET /products/ HTTP/1.1
  Host: localhost:8000
```
```bash
curl --location --request GET 'localhost:8000/products/'
```  

2. Get product details

```bash
  GET /products/:productId HTTP/1.1
  Host: localhost:8000
```
`productId` is id returned from the list all products API
```bash
curl --location --request GET 'localhost:8000/products/2'
```

3. Place order
```json
GET /products/order HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{"productId": "2", "quantity": 2}
```
```bash
curl --location --request GET 'localhost:8000/products/order' \
--header 'Content-Type: application/json' \
--data-raw '{"productId": "2", "quantity": 2}'
```

4. Update order
```json
GET /products/update-order HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{"orderId": "8c52ace2-be81-4988-b17b-5eb35dbd5649", "productId": "2", "quantity": 4}
```
```bash
curl --location --request GET 'localhost:8000/products/update-order' \
--header 'Content-Type: application/json' \
--data-raw {"orderId": "8c52ace2-be81-4988-b17b-5eb35dbd5649", "productId": "2", "quantity": 4}'
```

### Misc Details
- RabbitMQ fanout exchange name: `order_events_fanout`
- RabbitMQ topic exchange name: `order_events_topic`
- RabbitMQ queues: `order_created`, `order_created_updated`
