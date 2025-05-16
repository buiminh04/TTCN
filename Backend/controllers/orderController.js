const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

async function generateOrderCode() {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  let nextNumber = 1;

  if (lastOrder && lastOrder.orderCode) {
    const match = lastOrder.orderCode.match(/OD(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  return `#OD${String(nextNumber).padStart(2, '0')}`;
}

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, note } = req.body;
    const user = req.user;

    if (!req.body.paymentMethod) {
      return res.status(400).send('Phải chọn phương thức thanh toán');
    }

    const userAddress = user.address || {};
    const fullname = userAddress.fullname || 'Ẩn danh';
    const phone = userAddress.phone || '';
    const address = userAddress.address || '';

    const formattedItems = Object.values(items).map(item => ({
      book: item.book,
      quantity: parseInt(item.quantity),
      price: parseFloat(item.price)
    }));

    const order = new Order({
      orderCode: await generateOrderCode(),
      user: user._id,
      items: formattedItems,
      totalPrice: parseFloat(totalPrice),
      address: { fullname, phone, address },
      note: note || '',
    });

    await order.save();

    await Cart.deleteOne({ userId: user._id });

    res.redirect('/?order=success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tạo đơn hàng');
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.book');
    res.render('customer/order/order', {
      orders,
      success: req.flash('success')
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Không thể tải đơn hàng của bạn');
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('items.book');

    res.render('admin/orders', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Không thể tải tất cả đơn hàng');
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi xóa đơn hàng');
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, deleteOrder };
