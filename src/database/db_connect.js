const mongoose = require('mongoose')
const uri = "mongodb+srv://anubhav_shukla:anubhav_shukla@cluster0.muwwtnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devTinder"

async function connect() {
    try {
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

module.exports = { connect };
