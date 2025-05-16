const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    fullname: { type: String, required: false },
    phone: { type: String, required: false },
    country: { type: String, default: 'Việt Nam' },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    address: { type: String },
    type: { type: String, enum: ['home', 'company'] }
});

const userSchema = new mongoose.Schema({
    fullname: String,
    phone: String,
    birthday: Date,
    address: addressSchema,
    gender: { type: String, enum: ['male', 'female'] },
    username: { type: String, unique: true, trim: true, required: true },
    email: { type: String, unique: true, trim: true, required: true },
    password: { type: String, trim: true, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('User', userSchema);