import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import express from 'express';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';


const productRouter = express.Router();

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        // get ข้อมูลจาก url ชื่อคีย์
        const seller = req.query.seller || '';
        const name = req.query.name || '';

        // ถ้ามีให้ค่าเท่าค่าที่ส่งมา ถ้าไม่มีให้เป็นออบเจ็ตว่างๆ
        const sellerFilter = seller ? { seller } : {};
        // ค้นหาแบบ LIKE ..$regex: name, $options: 'i'
        const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};

        // นำค่ามี filter
        const product = await Product.find({ ...sellerFilter, ...nameFilter }).populate(
            'seller', 'seller.name seller.logo'
        );
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

productRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id).populate(
            'seller',
            'seller.name seller.logo seller.rating seller.numReviews'
        );
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.post(
    '/',
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = new Product({
            name: 'samle name ' + Date.now(),
            seller: req.user._id,
            image: '/images/product-1.jpg',
            price: 0,
            category: 'sample category',
            brand: 'sample brand',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
            description: 'sample description',
        });
        const createdProduct = await product.save();
        res.send({ message: 'Product Created', product: createdProduct });
    })
);

productRouter.put(
    '/:id',
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId)
        if (product) {
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;

            const updateProduct = await product.save();

            res.send({ message: 'Product Updated', product: updateProduct })
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    }))

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            const deleteProduct = await product.remove();
            res.send({ message: 'Product Deleted', product: deleteProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

export default productRouter;