const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');


mongoose.connect("mongodb://localhost:27017/cms", { useNewUrlParser: true }).then(db => {
    console.log('Conected');
}).catch((err)=>{
    console.log(err);
})

app.use(express.static(path.join(__dirname, 'public')));

const {select} = require('./helpers/helper-handlebars');

//Set View Engine

app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: { select : select}}));
app.set('view engine', 'handlebars');

app.use(upload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


//Loads Routes

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

//Use Routes
 
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);



app.listen('4000', ()=> {
    console.log(`Server is listenin on port 4000`);
});