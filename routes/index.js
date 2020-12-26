const express = require('express');
const router = express.Router();

const Artisan = require('../model/Artisan');

router.get('/', (req,res)=>{
    res.render('index');
})

router.post('/', (req,res)=>{
    console.log(req.body)
    let what = req.body.what;
    let where = req.body.where;

    
    if(where == 'All' && what != 'All'){
           Artisan.find({industry:what}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                res.render('search', {record:result,what:what,where:'All Locations'})
            }
        })
    }
    else if(what == 'All' && where != 'All'){
           Artisan.find({city:where}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                res.render('search', {record:result,what:'All Services',where:where})
            }
        })
    }
    else if(what == 'All' && where=='All'){
           Artisan.find({}, function(err, result){
               console.log(result)
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                res.render('search', {record:result,what:'All Services',where:'All Locations'})
            }
        })
    }
    else {
        Artisan.find({industry:what, city:where}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                res.render('search', {record:result,what:what,where:where})
            }
        })
    }

})

router.get('/price', (req,res)=>{
    res.render('price');
})

router.get('/search', (req,res)=>{
    res.render('search');
})


module.exports = router;
