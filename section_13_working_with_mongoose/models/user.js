const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
        return i.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

/* userSchema.methods.addOrder = function() {
    return this.cart.items
        .then(products => {
            const order = {
                items: products,
                user: this
            };
            return db.collection('orders')
                .insertOne(order);
        })
        .then(result => {
            this.cart = { items: [] };

            return db.collection('users')
                .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
        }).catch(err => console.log("Error adding an order."));
} */
module.exports = mongoose.model('User', userSchema);

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class User {
//     constructor(username, email, cart, userid) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; //An object with items: cart = {items:[]}
//         this._id = userid;
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection("users")
//             .findOne({ _id: new mongodb.ObjectId(userId) })
//             .then((user) => {
//                 console.log(user);
//                 return user;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {
//         //check the cart object to see if the product exists in it
//         const cartProductIndex = this.cart.items.findIndex((cp) => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }

//         const updatedCart = {
//             items: updatedCartItems
//         };

//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     }
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });


//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 })
//             })
//             .catch(err => console.log(err));
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(i => {
//             return i.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
//     }
//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongodb.ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders')
//                     .insertOne(order);
//             })
//             .then(result => {
//                 this.cart = { items: [] };

//                 return db.collection('users')
//                     .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
//             }).catch(err => console.log("Error adding an order."));
//     }
//     getOrders() {
//         const db = getDb();
//         console.log("this._id = " + this._id);
//         return db.collection('orders')
//             .find({ 'user._id': new mongodb.ObjectId(this._id) })
//             .toArray();

//     }
//     save() {
//         const db = getDb();
//         return db.collection("users").insertOne(this);
//     }
// }

// module.exports = User;