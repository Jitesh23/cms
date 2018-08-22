const express = require('express');

const router = express.Router();

const {isEmpty} = require('../../helpers/helper-upload');

const Post = require('../../models/Post');

router.all('/*', (req,res,next) =>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res) => {

    Post.find({}).then(posts=>{
        res.render('admin/posts', {posts: posts});


    }).catch(err=>{
        res.send(`Error while fetching the dat ${err}`);
    })
})

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
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
        let filename = Date.now() + '-' + file.name;

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
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename
    });

    newPost.save().then(savedData=>{

        res.redirect('/admin/posts');
    }).catch(err =>{
        res.send(err);
    })
    }
    })
    

    

router.get('/edit/:id', (req, res)=>{

    console.log(req.params.id);

    Post.findOne({_id: req.params.id}).then((post) =>{
        
        res.render('admin/posts/edit', {post:post});

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

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;

        post.save().then((updatedPost)=>{
            
            res.redirect('/admin/posts');
    })
            
    })

});

router.delete('/:id', (req, res)=> {
    Post.remove({_id : req.params.id}).then(result => {
        res.redirect('/admin/posts');
    })
});



module.exports = router;