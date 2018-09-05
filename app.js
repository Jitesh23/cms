const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const {mongoDBUrl} = require('./config/database');


mongoose.connect(mongoDBUrl, { useNewUrlParser: true }).then(db => {
    console.log('Conected');
}).catch((err)=>{
    console.log(err);
})

app.use(express.static(path.join(__dirname, 'public')));

const {select, datePicker} = require('./helpers/helper-handlebars');

//Set View Engine

app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: { select : select, datePicker: datePicker },  }));
app.set('view engine', 'handlebars');

app.use(upload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'jiteshilovecoding',
    resave: true,
    saveUninitialized: true

}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {

    res.locals.user = req.user || null;
    
    res.locals.success_message = req.flash('success_message');

    res.locals.error_message = req.flash('error_message');

    res.locals.error = req.flash('error');

    next();
});

//Loads Routes

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//Use Routes
 
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);



app.listen('4000', ()=> {
    console.log(`Server is listenin on port 4000`);
});