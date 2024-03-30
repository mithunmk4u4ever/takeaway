const User = require('../models/User')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecretKey = "mithun1234"





const createUser = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025, // Maildev's SMTP port
        ignoreTLS: true
    });

    const mailOptions = {
        from: 'mithunmk4u4ever@gmail.com',
        to: req.body.email,
        subject: "User Registration Successful!",
        text: "You have Successfully registered on Take Away Food Delivery Application. Thank you for choosing us."
    };

    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: hashedPassword
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send('Email sent successfully');
            }
        });
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
                res.json({ success: true, authToken,user, userId: user._id })
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

const addToCart = async (req, res) => {
    const { userId, foodItemId, name, price, qty, size, imgUrl, date } = req.body
    console.log('Request received:', req.body);

    try {
       const user = await User.findOne({ _id: userId });
        console.log("user", user);

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


const orderData = async (req, res) => {
    try {
        const { email, order_data, img } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Push the new order data into the orders array
        user.orders.push({ order_data, image: img });

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
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

const removeFromCart = async (req, res) => {
    try {
        const { itemsToRemove, email } = req.body;
        // console.log("remove", itemsToRemove, email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Remove items from the orders array based on indices
        user.orders = user.orders.filter((order, index) => {
            // Check if the index is included in itemsToRemove
            return !itemsToRemove.includes(index);
        });
        // console.log("orders", user.orders);

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: "Items removed from cart successfully" });
    } catch (error) {
        console.error("Error removing items from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// const removeFromCart = async (req, res) => {
//     try {
//         const { itemsToRemove, email } = req.body;
//         console.log("remove", itemsToRemove, email);

//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Remove items from the orders array based on order IDs
//         user.orders = user.orders.filter(order => {
//             // Check if the order ID is not included in itemsToRemove
//             return !(itemsToRemove.includes(order._id.toString()));
//         });

//         // Save the updated user document
//         await user.save();

//         res.status(200).json({ success: true, message: "Items removed from cart successfully" });
//     } catch (error) {
//         console.error("Error removing items from cart:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };


const moveToMyOrder = async (req, res) => {
    try {
        const { itemsToMove, email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Move items from the cart/orders to the user's orders array
        user.orders.push(...itemsToMove);

        // Remove the moved items from the cart
        await user.cart.deleteMany({ email: { $in: itemsToMove.map(item => item._id) } });

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: "Items moved to my orders successfully" });
    } catch (error) {
        console.error("Error moving items to my orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



module.exports = {
    createUser,
    loginUser,
    addToCart,
    getCartItems,
    orderData,
    myOrderData,
    removeFromCart,
    moveToMyOrder
}