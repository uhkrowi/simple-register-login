var express = require('express');
var router = express.Router();
var db = require('../server/db.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Defining error codes
var errCode = {
  unknown: 101,
  duplicate: 102
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('register/index', { title: 'Registration' });
});

router.post('/submitForm', function(req, res){
  db.registrant.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDateString,
    gender: req.body.gender,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email
  }).then(registrant => {
    res.send({errCode: 200, message: 'Successfully created data.'});
  }).catch(err => {
    let errNo = err.original.errno;
    let errMessage = 'Unknown error'; 
    if(errNo == 1062) {
      // Modifying errMessage
      errMessage = err.errors[0].message
      if(errMessage.includes('mobileNumber')) 
        errMessage = "Mobile number is used by other registrant"
      else if(errMessage.includes('email')) 
        errMessage = "Email is used by other registrant"

      res.send({errCode: errCode.duplicate, message: errMessage});
    } else {
      res.send({errCode: errCode.unknown, message: errMessage});
    }
  })

});

module.exports = router;
