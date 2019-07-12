const Router = require('koa-router');
const UserModel = require('../dbModel/userModel');
const ArticleModel = require('../dbModel/articleModel');
const CollectionModel = require('../dbModel/collectionModel');
const xss = require('xss'); 
const router = new Router();


// 添加文章
router.get('/addarticleshow', async (ctx, next) => {
    console.log(ctx.session.islogin);

    if(ctx.session.islogin != "success"){
        ctx.render('permsg',{
            result: "快去登陆啊，不登陆怎么写文章",
            backreg: "前往登陆页",
            msg: "别捣乱啊！"
        });
    }else{
        ctx.render('addarticle',{
            islogin:ctx.session.islogin
        });
    }
});


// 个人中兴
router.get('/mycenter', async (ctx, next) => {
    let arts = await ArticleModel.find({uid:ctx.session.uid});
    arts = arts.map(x=>{
        x.id = x._id.toString().slice(1,-1);
        return x
    })
    
    // 获取当前用户所有收藏文章的id
    let collectionids = await CollectionModel.find({uid:ctx.session.uid})
    
    // 将用户收藏文章id整理成一个数组
    let aidarr = [];
    collectionids.forEach(x=>{
        aidarr.push(x.aid);
    })

    // 查询具体的文章数据
    let collarts = await ArticleModel.find({_id:{$in:aidarr}});
    collarts = collarts.map(x=>{
        x.id = x._id.toString().slice(1,-1);
        x.content = xss(x.content, {
            whiteList: [], // 白名单为空，表示过滤所有标签
            stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
            stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
      }).slice(0, 100);
        return x;
    })
    
    // 获取用户名
    let userinfo = await UserModel.findOne({_id:ctx.session.uid}); 

    ctx.render('mycenter',{
        islogin:ctx.session.islogin,
        arts: arts,
        collarts: collarts,
        userinfo: userinfo 
    })
});

// 显示编辑文章页面
router.get('/edit/:id', async (ctx, next) => {
    let data = await ArticleModel.findOne({_id:ctx.params.id});
    ctx.render('edit',{
        islogin:ctx.session.islogin,
        data: data,
        aid: ctx.params.id
    });
});


module.exports = router;