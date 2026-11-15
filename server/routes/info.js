const router = require('express').Router();
const { sources, guides } = require('../data/info');

router.get('/sources', (req, res) => {
  res.json({ sources });
});

router.get('/guides', (req, res) => {
  res.json({ guides });
});

module.exports = router;
