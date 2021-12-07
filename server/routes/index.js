const express = require('express');
const router = express.Router();
const { pollFunc, callApis } = require('./routeUtil.js');

router.post('/', async (req, res) => {
  const response = await pollFunc(callApis, 300, 15, req);
  
  res.json(response);
});

module.exports = router;
