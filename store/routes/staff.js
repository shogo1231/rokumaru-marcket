let express = require('express');
let router = express.Router();
let staff_check = require('../models/staff')

router.post('/', function (req, res) {
  let data = staff_check.index(req,res);
  res.render('staff/staff_check', { title: 'ろくまる農園', data,});
});

router.get('/', function (req, res) {
  res.render('staff/staff', { title: 'ろくまる農園'});
});

router.post('/staff_add_done', function (req, res) {
  let addData = staff_check.staff(req,res);
  res.render('staff/staff_add_done', { title: 'ろくまる農園', addData});
});

router.get('/reference', async function(req,res) {
  let code = req.query.code;
  let data = await staff_check.ref(req,res,code);
  res.render('staff/staff_reference',{ title: 'ろくまる農園', data});
})

module.exports = router;