const express = require('express');
const router = express.Router();
const cartController = require('../controller/carts');

router.get('/', cartController.get);
router.get('/:id', cartController.getById);
router.post('/', cartController.post);
router.put('/:id', cartController.put);
router.delete('/:id', cartController.delete);
router.post("/add-product/:id", cartController.addProductToCart);
router.patch('/:userId/product/:productId', cartController.updateProductQuantity);
router.delete('/:userId/product/:productId', cartController.removeProductFromCart);

module.exports = router;
