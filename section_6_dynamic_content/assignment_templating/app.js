const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const userInRoutes = require('./routes/register');
const userOutRoutes = require('./routes/users');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/user', userInRoutes);
app.use(userOutRoutes);

app.use('/', (req, res, next)=>{
    res.status(404).render('404',{
        pageTitle: '404 Error!',
        active: '404'
    });
});

app.listen(3000);