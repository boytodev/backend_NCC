const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userRegister");
const { authenticateToken } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
});
// ✅ Register
userRouter.post("/register", async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        const isMatch = await User.findOne({ $or: [{ email }, { username }] });
        if (isMatch) {
            return res.status(400).json({ message: "❌ Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "✅ Registration Successful" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
});

// ✅ Login
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "❌ Invalid Username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid Password" });

        const accessToken = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
    
        res.json({ 
          accessToken, 
          message: "✅ Login Successful",
          Role: user.role,
          User: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
});
// ✅ Logout
userRouter.post("/logout", (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
    });

    res.status(200).json({ message: "✅ Logout Successful" });
});

// edit user

userRouter.route('/edit/:id').get(async (req, res, next) => {
    try {
        const data = await User.findById(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

//update user
userRouter.route('/update/:id').put(async (req, res, next) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }); // ค่าที่อัปเดตจะถูกส่งกลับ
        res.json(data);
        console.log('User successfully updated');
    } catch (error) {
        next(error);
    }
});

// chengpassword

userRouter.put("/change-password/:id", async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // ตรวจสอบว่ามีการส่งค่า oldPassword และ newPassword มาหรือไม่
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "⚠️ กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่" });
        }

        // ค้นหาผู้ใช้จาก ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "❌ ไม่พบผู้ใช้" });
        }

        // ตรวจสอบว่ารหัสผ่านเก่าถูกต้องหรือไม่
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ รหัสผ่านเก่าไม่ถูกต้อง" });
        }

        // เข้ารหัสรหัสผ่านใหม่
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // อัปเดตรหัสผ่านในฐานข้อมูล
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "✅ เปลี่ยนรหัสผ่านสำเร็จ" });

    } catch (error) {
        next(error);
    }
});

// ✅ Delete User
userRouter.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        console.log("🔹 ผู้ใช้ที่ทำการลบ:", req.user);

        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "❌ ไม่พบ ID ของผู้ใช้ที่ต้องการลบ" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "❌ ไม่พบผู้ใช้ที่ต้องการลบ" });
        }

        res.status(200).json({ message: "✅ ลบผู้ใช้สำเร็จ!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
});


module.exports = userRouter;
