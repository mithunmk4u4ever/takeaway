const User = require('../models/User')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecretKey = "mithun1234"
const Razorpay = require("razorpay")
const crypto = require("crypto")
require("dotenv").config()





const createUser = async (req, res) => {
    // const transporter = nodemailer.createTransport({
    //     host: 'localhost',
    //     port: 1025, // Maildev's SMTP port
    //     ignoreTLS: true
    // });

    // const mailOptions = {
    //     from: 'mithunmk4u4ever@gmail.com',
    //     to: req.body.email,
    //     subject: "User Registration Successful!",
    //     text: "You have Successfully registered on Take Away Food Delivery Application. Thank you for choosing us."
    // };

    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(409).json({ error: "Email already exists." });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: hashedPassword
        });

        res.send("user created successfully")

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //         return res.status(500).send('Error sending email');
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //         return res.status(200).send('Email sent successfully');
        //     }
        // });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const comparePwd = await bcrypt.compare(req.body.password, user.password)

            if (comparePwd) {
                const authToken = jwt.sign({ email: user.email }, jwtSecretKey, { expiresIn: '1d' })
                res.json({ success: true, authToken, user, userId: user._id })
                console.log(authToken);
            } else {
                res.status(400).json({ error: 'Incorrect password!', success: false })
            }
        } else {
            res.status(404).json({ error: 'User not found', success: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'An error occurred' })
    }
};

// const userForgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email: email })
//         if (user) {
//             const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "1d" })
//             var transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'mithunmk4u4ever@gmail.com',
//                     pass: 'lzsi croq brse zrwp'
//                 }
//             });



//             var mailOptions = {
//                 from: 'mithunmk4u4ever@gmail.com',
//                 to: email,
//                 subject: 'Reset Password Link',
//                 text: `http://localhost:3000/reset_password/${user._id}/${token}`
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     return res.send({ Status: "Success" })
//                 }
//             });
//         } else {
//             res.status(404).json({ error: 'User not found', success: false })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: 'An error occurred' })
//     }
// }

const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "1d" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mithunmk4u4ever@gmail.com',
                pass: process.env.GOOGLE_APP_PASSCODE // Replace with the App Password
            }
        });

        const mailOptions = {
            from: 'mithunmk4u4ever@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/resetpassword/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            res.json({ success: true, message: 'Email sent successfully' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const userResetPassword = async (req, res) => {
    
        const {id, token} = req.params
        const {password} = req.body
    
        jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if(err) {
                return res.json({Status: "Error with token"})
            } else {
                bcrypt.hash(password, 10)
                .then(hash => {
                    User.findByIdAndUpdate({_id: id}, {password: hash})
                    .then(u => res.send({Status: "Success"}))
                    .catch(err => res.send({Status: err}))
                })
                .catch(err => res.send({Status: err}))
            }
        })
   
}


const getFoodData = (req, res) => {
    try {
        res.send([global.fooditems, global.foodCategory])
    } catch (error) {
        console.error(error)
        res.send("Server Error")
    }
}

const addToCart = async (req, res) => {
    const { userId, foodItemId, name, price, qty, size, imgUrl, date } = req.body
    // console.log('Request received:', req.body);

    try {
        const user = await User.findOne({ _id: userId });
        // console.log("user", user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        const existingCartitem = await user.cart.find(item => item.foodItemid === foodItemId)

        if (existingCartitem) {
            existingCartitem.qty += qty
            existingCartitem.size = size
        }
        else {
            user.cart.push({ foodItemId, name, price, qty, size, imgUrl, date })
        }
        await user.save()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
const getCartItems = async (req, res) => {
    const userId = req.body.userId
    console.log("req", userId);
    try {
        const user = await User.findOne({ _id: userId });

        // console.log("getcart",user.cart);
        if (!user) {
            return res.status(404).send("User not found")
        }
        const cartItems = user.cart
        res.status(202).send({ success: true, cartItems })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error!")
    }
}

const removeSingleFromCart = async (req, res) => {
    try {
        const { item, userEmail } = req.body.data; // Assuming 'item' object contains properties for identification
        console.log("removing", item, userEmail);
        const user = await User.findOne({ email: userEmail }); // Find user by email

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Implement logic to filter the cart based on item properties (e.g., foodItemId, size, etc.)
        const updatedCart = user.cart.filter(
            (cartItem) =>
                !(cartItem.foodItemId === item.foodItemId && cartItem.size === item.size && cartItem.qty === item.qty) // Assuming foodItemId and size for uniqueness
        );

        user.cart = updatedCart;
        await user.save(); // Save updated cart

        res.status(200).json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const removeSelectedFromCart = async (req, res) => {
    try {
        const { items, email } = req.body.data;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.cart.length) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const updatedCart = user.cart.filter(
            (cartItem) => cartItem && // Check if cartItem is not undefined
                !items.some(
                    (selectedItem) =>
                        selectedItem.name === cartItem.name && selectedItem.size === cartItem.size
                )
        );

        user.cart = updatedCart;
        await user.save(); // Save updated cart

        res.status(200).json({ success: true, message: "Items removed from cart successfully" });
    } catch (error) {
        console.error("Error removing items from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const moveSelectedToMyOrder = async (userId) => {
    try {
        // const { items, email } = req.body;
        if (!items || !items.length) {
            // return res.status(400).json({ success: false, message: "No items selected" });
        }

        // Retrieve user from the database
        const user = await User.findOne({ _id: userId });

        if (!user) {
            // return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add selected items to myOrder
        user.orders.push(...items);

        // Remove selected items from the cart
        user.cart = user.cart.filter(cartItem => !items.some(selectedItem => selectedItem._id === cartItem._id));

        // Save the user object to the database
        await user.save();

        // return res.status(200).json({ success: true, message: "Selected items moved to myOrder successfully" });


    } catch (error) {
        console.error("Error moving selected items to myOrder:", error);
        // return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const myOrderData = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email and return their orders
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, orderData: user.orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};






const moveToMyOrder = async (userId) => {
    try {
        // const { itemsToMove, email } = req.body;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            // return res.status(404).json({ success: false, message: "User not found" });
        }

        // Move items from the cart/orders to the user's orders array
        user.orders.push(...itemsToMove);

        // Remove the moved items from the cart
        await user.cart.deleteMany({ email: { $in: itemsToMove.map(item => item._id) } });

        // Save the updated user document
        await user.save();

        // res.status(200).json({ success: true, message: "Items moved to my orders successfully" });
    } catch (error) {
        console.error("Error moving items to my orders:", error);
        // res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const makePayment = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        })

        const options = req.body

        console.log("pay", req.body);
        const order = await razorpay.orders.create(options)

        if (!order) {
            return res.status(404).send("error")
        }

        res.json(order)


    } catch (error) {
        console.log(error);
    }
}


// {
//     "id": "order_OACutySLglJwzR",
//     "entity": "order",
//     "amount": 50000,
//     "amount_paid": 0,
//     "amount_due": 50000,
//     "currency": "INR",
//     "receipt": "receipt#1",
//     "offer_id": null,
//     "status": "created",
//     "attempts": 0,
//     "notes": [],
//     "created_at": 1715653369
//   }

const validatePayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body


        // const user = await User.findOne({ _id: userId })

        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)

        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)

        const digest = sha.digest("hex")

        if (digest !== razorpay_signature) {
            return res.status(400).json({ message: "Transaction is legit" })
        }
        await moveSelectedToMyOrder(userId)
        await moveToMyOrder(userId)
        res.json({
            message: "success",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        })

    } catch (error) {
        console.log(error);
    }
}

const addAddress = async (req, res) => {
    try {
        const { email, house, street, city, pin, phone } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.address.push({ house, street, city, pin, phone })
        await user.save()
        const userAd = user.address
        res.status(200).json({ message: "success", userAd })
    } catch (error) {
        console.log(error.message);
    }

}

const getAddress = async (req, res) => {
    try {
        const { userEmail } = req.params
        const user = await User.findOne({ email: userEmail })
        console.log("email", userEmail, user.address);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const userAd = user.address
        res.status(200).json({ message: "success", userAd })
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    createUser,
    loginUser,
    userForgotPassword,
    userResetPassword,
    getFoodData,
    addToCart,
    getCartItems,
    removeSingleFromCart,
    removeSelectedFromCart,
    moveSelectedToMyOrder,
    makePayment,
    validatePayment,
    myOrderData,
    addAddress,
    getAddress,
    moveToMyOrder
}