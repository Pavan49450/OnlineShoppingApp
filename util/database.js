const mongoDb = require("mongodb");

const MongoClient = mongoDb.MongoClient;

let _db;

const mongoConnect = async (callback) => {
  console.log("In Client");
  MongoClient.connect(
    "mongodb+srv://pavan49450:427avCB68kLf1aVg@cluster0.pmgc3gi.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Datebase found";
  }
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
