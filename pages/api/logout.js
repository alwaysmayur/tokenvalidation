
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
                req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
                    return curelem.token !== req.token
                });

                res.setHeader('Set-Cookie', serialize(
                    'token', "",
                    {
                        path: '/',
                        expires: new Date(Date.now()),
                        httpOnly: true
                    }
                ));
                req.rootUser.save();

                res.status(201).json({ status: 201 })

            } catch (error) {
                console.log(error)
                res.status(401).json({ status: 401, error })
            }
        })
    })
}

export default async function handler(req, res) {
    try {
        const authenticateResult = await authenticate(req, res);
        if (authenticateResult?.status == 401) {
            return res.status(authenticateResult.status).json(authenticateResult);
        }
        // Run the middleware
        await runMiddleware(req, res, cors);

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block", error);
    }
}
