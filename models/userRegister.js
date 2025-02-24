const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define collection and schema for UserRegister
let UserRegisterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // ป้องกัน email ซ้ำ
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true, // ป้องกัน username ซ้ำ
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // จำกัดค่า role
        default: 'user'
    }
}, {
    collection: 'userRegister',
    timestamps: true // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});

module.exports = mongoose.model('UserRegister', UserRegisterSchema);
