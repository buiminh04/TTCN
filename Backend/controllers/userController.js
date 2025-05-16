const User = require('../models/userModel');

const getUserProfile = async (req, res, returnOnly = false) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      if (returnOnly) return null;
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    if (returnOnly) return user;
    res.json(user);
  } catch (error) {
    console.log(error);
    if (returnOnly) throw error;
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, gender, birthday } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return false;

    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.email = email;
    user.gender = gender;
    user.birthday = birthday;

    await user.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('Không tìm thấy người dùng');

    user.address = {
      country: req.body.country,
      city: req.body.city,
      district: req.body.district,
      ward: req.body.ward,
      detail: req.body.address,
      type: req.body.addressType
    };

    await user.save();
    res.redirect('/customer/address');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi cập nhật địa chỉ');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    await user.deleteOne();
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getUserProfile,
  updateUser,
  updateAddress,
  deleteUser,
  getAllUsers
};
