let express = require('express');
let router = express.Router();
const geneController = require('../controllers/geneController');

router.get('/:id(\\d+)', geneController.detail);

module.exports = router;
