 const express = require('express');

 const newCategoryController = require('../controllers/controller');

 const router = express.Router();

 router.post('/category/cid', newCategoryController.newCategory);
 router.get('/:cid', newCategoryController.getCategoryByCid );
 router.patch('/:cid', newCategoryController.updateCategory );
 
 module.exports = router;