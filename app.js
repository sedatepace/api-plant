const express = require('express');
const cookieParser = require('cookie-parser');
const morgan  = require('morgan');
const path = require('path');
const flash = require('connect-flash');
var requestIp = require('request-ip');
require('dotenv').config();


const checkingRouter  = require('./routes/checking');
const plantRouter  = require('./routes/plant');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 8002);


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.NAVER_CLIENT_ID));
app.use(cookieParser(process.env.NAVER_CLIENT_SECRET));

app.use(flash());

app.use('/checking', checkingRouter);
app.use('/plant', plantRouter);


app.use('/', (req, res)=>{
    var result = {
        code: 500,
        rows: -1,
        output: "Not Found api"
    }
   res.send(result)
})

app.use((req, res, next)=>{
    console.log("client IP: " +requestIp.getClientIp(req));
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err,req, res)=>{
   
    res.locals.messge = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});
