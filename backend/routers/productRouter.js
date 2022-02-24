import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import express from 'express';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import User from '../models/userModel.js';


const productRouter = express.Router();

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        // get ข้อมูลจาก url ชื่อคีย์
        const seller = req.query.seller || '';
        const order = req.query.order || '';
        const name = req.query.name || '';
        const category = req.query.category || '';
        const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
        const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
        const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

        // ถ้ามีให้ค่าเท่าค่าที่ส่งมา ถ้าไม่มีให้เป็นออบเจ็ตว่างๆ
        const sellerFilter = seller ? { seller } : {};
        // ค้นหาแบบ LIKE ..$regex: name, $options: 'i'
        const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
        // ถ้าไม่มีค่าที่ส่งมาจาก Url ให้มีค่าเท่ากับค่าออบเจคว่างๆ
        const categoryFilter = category ? { category } : {};
        //  $gte เปรียบเทียบคอลัมน์ที่มีค่าที่มากกว่าหรือเท่ากับ , lte เปรียบเทียบคอลัมน์ที่มีค่าน้อยกว่า
        const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {}
        const ratingFilter = rating ? { rating: { $gte: rating } } : {}
        const sortOrder =
            order === 'lowest' ? { price: 1 } :
                order === 'highest' ? { price: -1 } :
                    order === 'toprated' ? { rating: -1 } : { _id: -1 };

        // นำค่ามี filter
        const product = await Product.find({
            ...sellerFilter,
            ...nameFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        })
            .populate('seller', 'seller.name seller.logo')
            .sort(sortOrder);
        res.send(product);
    })
);

productRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories);
}));

productRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        // await Product.remove({});
        const seller = await User.findOne({ isSeller: true });
        if (seller) {
            const products = data.products.map((product) => ({
                ...product,
                seller: seller._id,
            }));
            const createdProducts = await Product.insertMany(products);
            res.send({ createdProducts });
        } else {
            res
                .status(500)
                .send({ message: 'No seller found. first run /api/users/seed' });
        }
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


productRouter.post(
    '/:id/reviews',
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        //ค้นหา product = mongoose.Schema 
        const product = await Product.findById(productId)
        if (product) {
            if (product.reviews.find((x) => x.name === req.body.name)) {
                return res
                    .status(400)
                    .send({ message: 'You already submitted a review' });
            }
            // สร้างออกเจ็ค mongoose.Schema
            const review = {
                name: req.body.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            // เอาค่าที่ได้ไปต่อท่้าย
            product.reviews.push(review)
            product.numReviews = product.reviews.length;
            //หาค่าเฉลีย แบบ reduce
            //console.log(product.reviews);
            product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
            //console.log(product.rating)
            //บันทึก
            const updateProduct = await product.save();

            res.status(201).send({
                message: 'Review Created',
                product: updateProduct.reviews[updateProduct.reviews.length - 1]
            });
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    }))

export default productRouter;