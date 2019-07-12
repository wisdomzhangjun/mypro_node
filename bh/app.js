const path = require('path');
const Koa = require('koa');
const render = require('koa-art-template');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session'); 
const indexRouters = require('./routers/indexRouters');
const doRouters = require('./routers/doRouters');
const mycenterRouters = require('./routers/mycenterRouers');
const db = require('./dbModel/dbconnect');

var app = new Koa();

// session处理
app.keys = ['some secret hurr'];


const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: false, 
  renew: false
};

//sesson中间件
app.use(session(CONFIG, app));


//静态资源中间件
app.use(static(path.join(__dirname,'./public')));


//post数据处理中间件
app.use(bodyParser());


//路由中间模块的处理
app.use(indexRouters.routes(),indexRouters.allowedMethods());
app.use(doRouters.routes(),doRouters.allowedMethods());
app.use(mycenterRouters.routes(),mycenterRouters.allowedMethods());


// 模板引擎配置
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});


app.listen(4000,()=>{
    console.log("Server Start Successful Listening Port 4000");
});