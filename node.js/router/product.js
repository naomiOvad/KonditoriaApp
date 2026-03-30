const express = require('express');
// noop: fifth PR agent smoke test
const router = express.Router();
const controllerProduct = require('../controller/product')


router.get("/", controllerProduct.get);
router.get("/:id", controllerProduct.getById);
router.post("/", controllerProduct.post);
router.put('/:id', controllerProduct.put);
router.delete('/:id', controllerProduct.delete);

module.exports = router;