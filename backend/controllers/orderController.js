import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";


//Gloabal Variables
const currency = "inr"
const deliveryCharges = 10

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
})

// Placing orders using COD
const placeOrder = async (req, res) => {

    try {
        const { userId, items, amount, address } = req.body;

        // Create new order
        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false, // Payment not yet made for COD
            date: new Date(),
        });

        // Save order
        const newOrder = await orderModel(order);
        await newOrder.save()

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.status(201).json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Placing orders using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;


        //Create order
        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false, // Payment not yet made 
            date: new Date(),
        });


        // Save order
        const newOrder = await order.save();


        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment"
        })

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Placing orders using razorpay
const placeOrderRazorPay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;


        //Create order
        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false, // Payment not yet made 
            date: new Date(),
        });


        // Save order
        const newOrder = await order.save();

        const options = {
            amount: amount * 100, // Convert to paisa
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


//Verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });

    }
}

// All Orders Data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Order Data for Frontend
const userOrders = async (req, res) => {

    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        //Validate request body
        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        // Update order and get the updated document

        const updateOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true } // Returns the updated order
        )
        // await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated", order: updateOrder });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}
export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorPay, allOrders, userOrders, updateStatus }