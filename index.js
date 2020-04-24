const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://paulurl.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
      res.json(data.Item);
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
