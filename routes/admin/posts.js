const express = require('express');

const router = express.Router();

const {isEmpty} = require('../../helpers/helper-upload');

const Post = require('../../models/Post');
const Category = require('../../models/Category');
const fs = require('fs');

// const {userauthenticate} = require('../../helpers/authentication');

router.all('/*', (req,res,next) =>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res) => {

    Post.find({})
    .populate('category')
    
    .then(posts=>{
        res.render('admin/posts', {posts: posts});


    }).catch(err=>{
        res.send(`Error while fetching the dat ${err}`);
    })
})

router.get('/my-posts', (req, res) => {

    Post.find({user: req.user})
    .populate('category')
    
    .then(posts=>{
        res.render('admin/posts/my-posts', {posts: posts});


    }).catch(err=>{
        res.send(`Error while fetching the dat ${err}`);
    })
})



router.get('/create', (req, res) => {
    Category.find({}).then(categories =>{
        res.render('admin/posts/create', {categories: categories});
    })
    
})



router.post('/create', (req, res) => {

    let errors = [];

    if (!req.body.title){
        errors.push({
            message: 'Please enter the title for post'
        });     
    }

    if (!req.body.body){
        errors.push({
            message: 'Please add the discription'
        });     
    }

    if (errors.length > 0){
        res.render('admin/posts/create', {
            errors: errors
        });
    }else{
        
        let filename = 'NPM.jpg';

    if (!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + '-' + file.name;

    file.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
    });

    console.log('Is not empty');
    }else{
        console.log('Is empty');
    }


    let allowComments = true;

    if (req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false
    }

    console.log(req.body);
    console.log(req.body.allowComments);
    
   let newPost = new Post({
        user: req.user.id,
        title: req.body.title,
        category: req.body.category,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename
    });

    newPost.save().then(savedData=>{

        req.flash('success_message', `Post was created succussfully for title ${savedData.title}`);

        res.redirect('/admin/posts');
    }).catch(err =>{
        res.send(err);
    })
    }
    })
    
    
    

router.get('/edit/:id', (req, res)=>{

    console.log(req.params.id);

    Post.findOne({_id: req.params.id}).then((post) =>{
        
        Category.find({}).then(categories =>{
            res.render('admin/posts/edit', {post:post,categories: categories});
        })
        
    })

});

router.put('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id}).then(post=> {


        let allowComments = true;

        if (req.body.allowComments){
            allowComments = true;
         }else{
            allowComments = false
        }
        post.user = req.user.id,
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if (!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             post.file = filename;
            file.mv('./public/uploads/' + filename, (err) => {
            if (err) throw err;
        });
    
        console.log('Is not empty');
        }else{
            console.log('Is empty');
        }


        post.save().then((updatedPost)=>{

            req.flash('success_message', `Post was edited succussfully for title ${updatedPost.title}`);
            
            res.redirect('/admin/posts');
    })
            
    })

});

router.delete('/:id', (req, res)=> {

    Post.findOne({_id : req.params.id})
    .populate('comments')
    .then(post=>{

        fs.unlink('./public/uploads/' + post.file, (err)=>{

            if (!post.comments.length < 1){

                post.comments.forEach(comment=>{
                    comment.remove();
                })
            }
            post.remove().then(removedPost =>{
                req.flash('success_message', `Post was deleted succussfully`);
                res.redirect('/admin/posts');
            });
            
        })
        
    })

});



module.exports = router;