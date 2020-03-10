var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserControl = require ("../controllers/User");

/* GET users listing. */
router.post('/login', UserControl.Login);

router.all("*",checkAuth);

router.get('/', UserControl.List)
        .post('/', UserControl.Insert)
        .put('/', UserControl.Update)
        .delete('/', UserControl.Delete);
//router.post('/', UserControl.Insert);



module.exports = router;
