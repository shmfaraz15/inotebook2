//to establish the connection to database

const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017"

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
    } catch (error) {
        console.log(error);
    }
    console.log("Connected to monogdb successfully")
}

module.exports = connectToMongo;