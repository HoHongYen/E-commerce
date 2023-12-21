import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
	const newOrder = new Order({
		orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
		shippingAddress: req.body.shippingAddress,
		paymentMethod: req.body.paymentMethod,
		itemsPrice: req.body.itemsPrice,
		shippingPrice: req.body.shippingPrice,
		taxPrice: req.body.taxPrice,
		totalPrice: req.body.totalPrice,
		user: req.user._id, // lay tu isAuth
	});
	const order = await newOrder.save();
	res.status(201).send({ message: 'New Order Created', order });
}));

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.send(orders);
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		res.send(order);
	} else {
		res.status(404).send({ message: 'Order not found' });
	}
}));

export default orderRouter;
