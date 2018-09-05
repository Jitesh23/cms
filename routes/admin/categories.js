const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
// const {userauthenticate} = require('../../helpers/authentication');

router.all('/*', (req,res,next) =>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{

    Category.find({}).then(category=> {
        res.render('admin/categories/index',  {category:category});

    })

});

router.post('/create', (req, res)=> {
    
    let newCategory = new Category({
        name: req.body.name
    })

    newCategory.save().then(category=> {
        res.redirect('/admin/categories');
    })

});

router.get('/edit/:id', (req, res)=> {

    Category.findOne({_id: req.params.id}).then(category => {
        res.render('admin/categories/edit', {category:category});
    })

    
})

router.put('/edit/:id', (req, res) => {

    Category.findById({_id: req.params.id}).then(category=>{
        category.name = req.body.name

        category.save().then(updateDate=>{
            res.redirect('/admin/categories');
        })
    })



})

router.delete('/:id', (req, res)=> {
    Category.remove({_id: req.params.id}).then(result=> {
        res.redirect('/admin/categories');
    })
})

// router.get('/dashboard', (req, res)=>{
//     res.render('admin/dashboard');
// }); 



module.exports = router;