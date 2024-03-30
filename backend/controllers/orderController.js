// const Order = require('../models/Orders')
// const User=require('../models/User')



// const orderData = async (req, res) => {

//     let data = req.body.order_data
//     await data.splice(0, 0, { Order_date: req.body.order_date })

//     let eId = await Order.findOne({ "email": req.body.email })
//     console.log("eId", eId);
//     console.log(req.body.img);
//     if (!eId) {
//         try {
//             await Order.create({
//                 email: req.body.email,
//                 order_data: [data],
//                 image: data.img
//             }).then(() => {
//                 res.json({ success: true })
//             })
//         } catch (error) {
//             console.log(error.message);
//             res.status(404).send(error.message)
//         }
//     }
//     else {
//         try {
//             await Order.findOneAndUpdate({ email: req.body.email },
//                 {
//                     $push: { order_data: data }
//                 }).then(() => {
//                     res.json({ success: true })
//                 })
//         } catch (error) {
//             res.send("server error", error.message)
//         }
//     }

// }

// const myOrderData = async (req, res) => {
//     try {
//         const myData = await Order.findOne({ "email": req.body.email })
//         res.json({ orderData: myData })
//     } catch (error) {
//         res.send("server error", error.message)

//     }
// }

// const removeFromCart = async (req, res) => {
//     const { itemsToRemove, userId } = req.body
//     console.log("delete", userId, itemsToRemove);

//     try {
//         await Order.deleteMany({ userId: userId, foodItemId: { $in: itemsToRemove.map(item => item.foodItemId) } })
//         res.json("deleted successfully!")
//     } catch (error) {
//         console.log("error removing items from the cart", error);
//     }
// }// Import necessary modules and models




// const moveToMyOrder = async (req, res) => {
//     try {
//         const { itemsToMove, userId,email} = req.body;
//         console.log("itemstomove", itemsToMove,userId,email);

//         const user=await User.findOne({email:email})
//         if (!user) {
//             return res.status(404).send("User not found")
//         }
//         const myorders = user.orders
//         await Order.deleteMany({ userId: userId, foodItemId: { $in: itemsToMove.map(item => item.foodItemId) } })
//         await Order.insertMany(myorders)
//         // Assuming you have a model for orders and a corresponding schema
//         const order = new Order({
//             email: email,
//             order_data: itemsToMove,
//             orderDate: new Date(),
//             // Replace with the actual email or retrieve it from the request
//           });

//         // Save the order to the 'myorder' collection
//         await order.save();

//         // Optionally, you may want to remove the purchased items from the cart
//         // This depends on your data structure and logic
//         // Example: await Cart.deleteMany({ userId: userId, foodId: { $in: itemsToMove.map(item => item.foodId) } });

//         res.status(200).json({ message: 'Items moved to myorder successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error.', details: error.message });
//       }
// };



// module.exports = { orderData, myOrderData, removeFromCart, moveToMyOrder }