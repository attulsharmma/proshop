import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc  Fetch all Products
// @route  GET /api/products
// @access Public Route
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const prev = page - 1;
  const next = page + 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, prev, next, pages: Math.ceil(count / pageSize) });
});

// @desc  Fetch single Product
// @route  GET /api/products/:id
// @access Public Route
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) return res.json(product);
  else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc  Delete single Product
// @route  DELETE /api/products/:id
// @access Private/Admin Route
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if(req.user._id === product.user._id){ await product.remove(); } // NOTE IMPORTANT  This is used for only certain admin who create the product  in this project app any user(Admin) can delete any product but later on in bigger applications if we sell the ecommerce app to certain seller then we can use this functionality to delete only product that were added by the user
  if (product) {
    await product.remove();
    res.json({ message: 'Product Removed Successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc  Create a Product
// @route  POST /api/products/
// @access Private/Admin Route
const createProduct = asyncHandler(async (req, res) => {
  //This is the main code that i have to implement
  // const {
  //   name,
  //   price,
  //   image,
  //   brand,
  //   category,
  //   countInStock,
  //   description,
  // } = req.body;
  // const product = await Product.create({
  //   name,
  //   price,
  //   user: req.user._id,
  //   image,
  //   brand,
  //   category,
  //   countInStock,
  //   description,
  // });
  // if (product) {
  //   res.status(201).json({
  //     _id: product._id,
  //     price: product.name,
  //     image: product.image,
  //     brand: product.brand,
  //     user: req.user._id,
  //     category: product.category,
  //     countInStock: product.countInStock,
  //     description: product.description,
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error(`Product not created`);
  // }
  const product = new Product({
    name: 'Sample Product',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc  Update a Product
// @route  POST /api/products/:id
// @access Private/Admin Route
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc  Create new review
// @route  POST /api/products/:id/reviews
// @access Private Route
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      //r denotes review
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error(`Product already Reviewed`);
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc  Get Top Rated Products
// @route  POST /api/products/top
// @access Public Route
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getTopProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
