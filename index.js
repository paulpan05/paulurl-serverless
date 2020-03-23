const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();

app.get('/:route', (req, res) => {
  const params = {
    TableName: "customUrlTable",
    Key:{
        "route": req.params["route"]
    }
  };
  docClient.get(params, (err, data) => {
    if (err) {
      res.status(err.statusCode || 500).send(err.message);
    } else {
      res.json(data);
    }
  });
});

app.get('/', (req, res) => {
  const params = {
    TableName: "customUrlTable",
    Select: "ALL_ATTRIBUTES"
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      res.status(err.statusCode || 500).send(err.message);
    } else {
      res.json(data.Items);
    }
  });
})

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
}
