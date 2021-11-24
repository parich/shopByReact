import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';

dotenv.config();


const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/* fuction เดิมเริ่มต้นที่เรียกผ่าน ไฟล์ data.js ทีมี id ในไฟล์  #เปลีนนไปเรียกผ่าน productRouter แทน
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((x) => x._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
});

app.get('/api/products', (req, res) => {
    res.send(data.products);
});
*/

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);


app.get('/', (req, res) => {
    res.send('Server is Ready');
});


//Middleware แสดง err ทุกอย่างที่เกิดขึ้นกับ app
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
