const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("blog");
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established" };
  } //we want to ensure that we dont try to work with a database, before we actually have it
  return database;
}

module.exports = {
  connectTodDatabase: connect,
  getDb: getDb,
};
