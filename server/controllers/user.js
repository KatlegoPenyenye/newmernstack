import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async(req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(404).json({ message: 'Password incorrect' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });


    } catch (error) {
        res.status(500).json({ message: "error on the server, couldnt sign in...please try again later" });

    }


}
export const signup = async(req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(404).json({ message: 'User already exists' });
        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' })
            //12 is the level of difficulty for hashing asalte
        const hashedPassword = await bcrypt.hash(password, 12);

        // create a new user
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
        /* The res.status() function set the HTTP status for the response. It is a chainable alias of Node’s response.statusCode.
           json() Function. The res. json() function sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using the JSON.
        */
        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "something went wrong, Couldnt sign up" })
    }


}