const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:CHvy3HQze4Avac0Z@cluster0.nz2g2.mongodb.net/roxiler"
);

const productSchema = new mongoose.Schema({
  id: Number,

  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
};
