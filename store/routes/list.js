let express = require('express');
let router = express.Router();
let staff_check = require('../models/staff')
let staff_list = require('../models/staff_list');

router.post('/staff_edit', async function (req, res) {
  let row = await staff_list.getStaffOneData(req,res);
  res.render('staff/staff_edit', { title: 'ろくまる農園', row});
});

// スタッフ一覧画面リンク押したとき
router.get('/', async function (req, res) {
  if (req.session.user) {
    let rows = await staff_list.getStaffData(req,res);
    res.render('staff/staff_list', { title: 'ろくまる農園', rows});
  }
  else {
    res.redirect('/');
  }
});

router.post('/staff_edit_check', function (req, res) {
  let data = staff_check.edit(req,res);
  res.render('staff/staff_edit_check', { title: 'ろくまる農園', data});
});

router.post('/staff_edit_done', function (req, res) {
  let updateData = staff_check.update(req,res);
  res.render('staff/staff_edit_done', { title: 'ろくまる農園', updateData});
});

router.get('/staff_edit_done', async function (req, res) {
  if (req.session.user) {
    let rows = await staff_list.getStaffData(req,res);
    res.render('staff/staff_list', { title: 'ろくまる農園', rows});
  }
    else {
    res.redirect('/');
  }
});

router.delete('/delete', function(req, res) {
  if (req.session.user) {
    let data = staff_check.deleteData(req, res);
    res.send(data);
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;