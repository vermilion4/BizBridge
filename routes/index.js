const express = require('express');
const router = express.Router();

const Artisan = require('../model/Artisan');

router.get('/', (req,res)=>{
    res.render('index');
})

router.post('/', (req,res)=>{
    let what = req.body.what;
    let where = req.body.where;

        Artisan.find({industry:what, city:where}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                res.render('search', {record:result,what:what,where:where})
            }
        })

})

router.get('/price', (req,res)=>{
    res.render('price');
})

router.get('/search', (req,res)=>{
    res.render('search');
})


module.exports = router;
