const mongoClient = require('mongodb').MongoClient;

const connectString = 'mongodb://localhost:27017/auth_local';
let client = null;

const connectMongo = async () => {
    if (client == null)
        client = await mongoClient.connect(connectString, {
            useNewUrlParser: true
        })

    return client;
};

module.exports = {
    connectMongo
};
