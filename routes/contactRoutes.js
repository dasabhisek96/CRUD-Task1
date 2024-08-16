const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/createContact', contactController.createContact);
router.get('/getContact', contactController.getContact);
router.post('/updateContact', contactController.updateContact);
router.post('/deleteContact', contactController.deleteContact);

module.exports = router;
