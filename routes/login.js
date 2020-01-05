var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
//   res.render('register/index', { title: 'Registration' });
    res.send('Will be a login page');
});

module.exports = router;
