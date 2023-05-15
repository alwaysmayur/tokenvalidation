import { log } from "console";
import Cors from 'cors'
import userdb from "../../utility/db/mongoDB/schema/userSchema";
import connectionMongoDB from "../../utility/db/mongoDB/connection";
// Initializing the cors middleware
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fun
) {
    return new Promise((resolve, reject) => {
        fun(req, res, async (result) => {
            try {
                const { fname, email, password, cpassword } = req.body;

                if (!fname || !email || !password || !cpassword) {
                    res.status(422).json({ error: "fill all the details" })
                }
                connectionMongoDB();
                const preuser = await userdb.findOne({ email: email });

                if (preuser) {
                    res.status(422).json({ error: "This Email is Already Exist" })
                } else if (password !== cpassword) {
                    
                    res.status(422).json({ error: "Password and Confirm Password Not Match" })
                } else {
                    const finalUser = new userdb({
                        fname, email, password, cpassword
                    });

                    // here password hasing
                    const storeData = await finalUser.save();

                    console.log({storeData});
                    res.status(201).json({ status: 201, storeData })
                }
            }
            catch (error) {
                console.log(error)
                res.status(422).json(error)
            }
        })
    })
}

export default async function handler(req, res) {
    try {
        // Run the middleware
        await runMiddleware(req, res, cors);
    } catch (error) {
        res.status(422).json(error)

    }

}
