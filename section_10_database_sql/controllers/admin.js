const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const editMode = false;
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    editing: editMode
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
  
};

exports.postEditProduct = (req, res, next) =>{
  //fetch info for the product
  const prodId = req.body.productId;
  const utitle = req.body.title;
  const uprice = req.body.price;
  const uimageurl = req.body.imageUrl;
  const udescritpion = req.body.description;

  const updatedProduct = new Product(prodId, utitle, uimageurl, udescritpion, uprice);
  updatedProduct.save()
    .then(()=>{
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err);
    });
};
exports.postDeleteProduct = (req, res, next) => {
  const productId=req.body.productId;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
