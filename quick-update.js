require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  image_url: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function update() {
  await mongoose.connect(process.env.MONGO_URI);
  
  await Product.updateOne(
    { name: 'Mineral Water', is_deleted: false },
    { 
      $set: { 
        images: [
          'https://compressedv2.s3.ap-south-1.amazonaws.com/4c474d3b2550555f333f77635935743678625368333f4a362e6d454d_1774593693750',
          'https://compressedv2.s3.ap-south-1.amazonaws.com/4c584b425178385e31595f4e742a6b52656e6b4430646f7a5758492e_1774593693427',
          'https://compressedv2.s3.ap-south-1.amazonaws.com/4c394c42554b3068506f4f6d332d78497d594e4b3f757856332e3b51_1774593694088'
        ],
        image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c474