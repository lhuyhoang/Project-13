const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Vui lòng nhập email hợp lệ'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false,
    },
    avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        maxlength: [200, 'Tiểu sử không được vượt quá 200 ký tự'],
        default: '',
    },
}, { timestamps: true });

// Hash mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) { 
    return await bcrypt.compare(candidatePassword, this.password);    
};

module.exports = mongoose.model('User', userSchema);