const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { connectPage, disconnectPage, getList, getInfo} = require('../controllers/fbController');

router.post('/connect', auth, connectPage);
router.post('/getlist', auth, getList);
router.get('/getinfo', auth, getInfo)
// router.post('/longtoken', auth, makeLongToken);
router.get('/disconnect', auth, disconnectPage);

module.exports = router;
