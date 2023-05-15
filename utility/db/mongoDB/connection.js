const mongoose = require("mongoose");

export default function connectMongoDB() {
    try {
        const DB = process.env.DATABASE
        mongoose.connect(DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(() => console.log("DataBase Connected")).catch((errr) => {
            console.log("connectMongoDB",errr);
        })
    }catch(error){
        console.log("connectMongoDB",error);
    }
}