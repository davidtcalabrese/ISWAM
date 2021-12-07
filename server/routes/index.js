const express = require('express');
const router = express.Router();
const { callApis } = require('../routes/routeUtil.js');

router.post('/', async (req, res) => {
  const response = await callApis(req);
  
  res.json(response);
});

module.exports = router;
