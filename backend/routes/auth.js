const express = require('express');
// const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
// var fetchuser = require('../middleware/fetchuser');
// const Image = require('../models/Image');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'Aryanisagoodb$oy';

//Create a new user using post "/api/auth/createuser" . Doesn't require Auth
router.post('/createuser', [
    body('name').isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 3 })
], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);

    //if there are errors in validations return bad request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //if there are errors while creating the user cath them else send the created user as response
    try {

        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);

        //creating a new user
        let user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        })

        //payload for the jwt
        const data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        res.json({ authtoken })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({//always send the json object
            message: err.message
        })
    }
})

// // ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
// router.post('/createuser', [
//     body('name', 'Enter a valid name').isLength({ min: 3 }),
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
// ], async (req, res) => {
//     let success = false
//     // If there are errors, return Bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         // Check whether the user with this email exists already
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             success = false
//             return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
//         }
//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(req.body.password, salt);

//         // Create a new user
//         user = await User.create({
//             name: req.body.name,
//             password: secPass,
//             email: req.body.email,
//         });
//         const data = {
//             user: {
//                 id: user.id
//             }
//         }
//         const authtoken = jwt.sign(data, JWT_SECRET);


//         // res.json(user)
//         success = true;
//         res.json({ success, authtoken })

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })


// // ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
// router.post('/login', [
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password cannot be blank').exists(),
// ], async (req, res) => {
//     let success = false
//     // If there are errors, return Bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             success = false
//             return res.status(400).json({ success, error: "Please try to login with correct credentials" });
//         }

//         const passwordCompare = await bcrypt.compare(password, user.password);
//         if (!passwordCompare) {
//             success = false
//             return res.status(400).json({ success, error: "Please try to login with correct credentials" });
//         }

//         const data = {
//             user: {
//                 id: user.id
//             }
//         }
//         const authtoken = jwt.sign(data, JWT_SECRET);
//         success = true;
//         res.json({ success, authtoken })

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }


// });


// // ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
// router.post('/getuser', fetchuser, async (req, res) => {

//     try {
//         let userId = req.user.id;
//         const user = await User.findById(userId).select("-password")
//         res.send(user)
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })
module.exports = router