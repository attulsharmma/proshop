import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import ConnectDB from './config/db.js';

dotenv.config();

ConnectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    // console.log(createdUsers[0].name);
    // console.log(adminUser);
    const sampleProducts = products.map(product => {
      console.log({ ...product, user: adminUser });
      return { ...product, user: adminUser };
    });
    await Product.insertMany(sampleProducts);
    console.log('Data import Successfully'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed Successfully'.cyan.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};
// console.log(process.argv[2]);
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
