import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import express from 'express';


const productRouter = express.Router();

productRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    }));

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.find({});
        res.send(product);
    })
);

productRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        //await Product.remove({}); //#ลบทั้งหมดก่อน
        const createdProducts = await Product.insertMany(data.products);
        res.send({ createdProducts });
    })
);

export default productRouter;