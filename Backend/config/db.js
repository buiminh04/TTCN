const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Kết nối MongoDB thành công');
    } catch (err) {
        console.error('Kết nối MongoDB thất bại', err);
        process.exit(1);  // Dừng server nếu kết nối thất bại
    }
};

module.exports = connectDB;