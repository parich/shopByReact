import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

//#expressAsyncHandler ยกเว้นการ async ตัวอย่างหน้าเว็บจะหมุนอยู่ตลอดเวลา เหมือนโหลดข้อมูลไม่เสร็จ
userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    await User.remove({}); //#ลบทั้งหมดก่อน

    // insertMany คือเพิ่มข้อมูลแบบ object #จากโครงสร้าง userModel.js ข้อมูล data.users
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
}));

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isSeller: user.isSeller,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.status(401).send({ message: 'Invalid email or password' });
    })
);

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: createdUser.isSeller,
        token: generateToken(createdUser),
    });
})
);

export default userRouter;