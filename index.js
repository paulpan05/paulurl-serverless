const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}
