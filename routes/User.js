var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserControl = require ("../controllers/User");

/*var connection = require('../middleware/connection');
router.all("*",connection);*/

router.post('/login', UserControl.Login);

router.all("*",checkAuth);

router.get('/', UserControl.List)
        .post('/', UserControl.Insert)
        .put('/', UserControl.Update)
        .delete('/', UserControl.Delete);

router.post('/logSettings', UserControl.LogSettings);
//router.post('/', UserControl.Insert);



module.exports = router;
