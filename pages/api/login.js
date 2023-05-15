
import Cors from 'cors'
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import connectionMongoDB from "../../utility/db/mongoDB/connection";
import userdb from "../../utility/db/mongoDB/schema/userSchema";

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
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(422).json({ error: "fill all the details" })
                }
                // Make mongoDB database connection
                connectionMongoDB();

                // Validate user email
                const userValid = await userdb.findOne({ email: email });

                if (userValid) {
                    // Validate password
                    const isMatch = await bcrypt.compare(password, userValid.password);

                    if (!isMatch) {
                        // If password is not match then throw error 
                       return res.status(422).json({ error: "Invalid details" })
                    } else {

                        // Generate jwt token
                        const token = await generateAuthtoken(userValid);

                        // Set cookies
                        res.setHeader('Set-Cookie', serialize(
                            'token', token,
                            {
                                path: '/',
                                expires: new Date(Date.now() + 9000000),
                                httpOnly: true
                            }
                        ));

                        // Set user details and token 
                        const result = {
                            userValid,
                            token
                        }

                        // Send response with status code and result
                        return res.status(201).json({ status: 201, result });
                    }
                }
            } catch (error) {
                // Handle exception
                return res.status(401).json(error);
            }
        })
    })
}

export default async function handler(req, res) {
    try {
        // Run the middleware
        runMiddleware(req, res, cors);
    } catch (error) {
        res.status(401).json(error);
        console.log("catch block", error);
    }
}

// Generate jwt token
async function generateAuthtoken(user) {
    try {
        return jwt.sign({ "_id": user._id }, process.env.ACCESS_KEY, { expiresIn: "1d" });
    } catch (error) {
        console.log(error);
    }
}