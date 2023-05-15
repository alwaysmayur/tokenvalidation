const jwt = require("jsonwebtoken");
import userdb from "../db/mongoDB/schema/userSchema";
const keysecret = process.env.ACCESS_KEY
import connectionMongoDB from "../../utility/db/mongoDB/connection";
import { isReturnStatement } from "typescript";
const authenticate = async (req, res) => {
    try {
        let token = req.headers.authorization;
        token = token.split(" ");
        const verifytoken = jwt.verify(token[1], keysecret);
        connectionMongoDB();
        const rootUser = await userdb.findOne({ _id: verifytoken._id });

        if (!rootUser) { throw new Error("user not found") }

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

    } catch (error) {
        console.log(error)
        return { status: 401, message: "Unauthorized no token provide" } 
    }
}


module.exports = authenticate