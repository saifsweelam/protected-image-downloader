const express = require('express');
const router = express.Router();
const scrapper = require('../scrapper');


/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Protected Image Downloader | Download images from Facebook & Instagram' });
});

router.get('/img-page', ({ query }, res) => {
    scrapper.scrapeProduct(query.url, query.path, result => res.status(200).send(result), err => res.status(404).send(err));
})


router.get('/id', ({ query }, res) => {
    scrapper.scrapeID(query.url, result => res.status(200).send(result), err => res.status(404).send(err));
})


module.exports = router;
