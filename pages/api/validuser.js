
import { log } from "console";
import Cors from 'cors'
import userdb from "../../utility/db/mongoDB/schema/userSchema";
var bcrypt = require("bcryptjs");
import connectionMongoDB from "../../utility/db/mongoDB/connection";
const jwt = require("jsonwebtoken");
import { serialize } from 'cookie';
import authenticate from '../../utility/middleware/authenticate'
// Initializing the cors middleware
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fun) {
    return new Promise((resolve, reject) => {
        fun(req, res, async (result) => {
            try {
                const ValidUserOne = await userdb.findOne({ _id: req.userId });
                res.status(201).json({ status: 201, ValidUserOne });
            } catch (error) {
                console.log(error)
                res.status(401).json({ status: 401, error });
            }
        })
    })
}

export default async function handler(req, res) {
    try {
        const authenticateResult = await authenticate(req, res);
        console.log({authenticateResult})
        if (authenticateResult?.status == 401) {
            return res.status(authenticateResult.status).json(authenticateResult);
        }
        // Run the middleware
        await runMiddleware(req, res, cors);

    } catch (error) {
        console.log("catch block", error);
        return res.status(401).json(error);
    }
}