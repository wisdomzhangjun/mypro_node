const Router = require('koa-router');
const ArticleModel = require('../dbModel/articleModel');
const CollectionModel = require('../dbModel/collectionModel');
const webconfig = require('../web.config');
const xss = require('xss');
const router = new Router();


// 时间格式化 
let formatDate = (time, format = "YY-MM-DD hh:mm:ss") => {
      var date = new Date(time);
      var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
      var preArr = Array.apply(null, Array(10)).map(function (el, index) {
            return "0" + index;
      });

      var newTime = format.replace(/YY/g, year)
            .replace(/MM/g, preArr[month] || month)
            .replace(/DD/g, preArr[day] || day)
            .replace(/hh/g, preArr[hour] || hour)
            .replace(/mm/g, preArr[min] || min)
            .replace(/ss/g, preArr[sec] || sec);

      return newTime;
};


// 首页
router.get('/', async (ctx, next) => {

      // 关联用户集合填充uid
      let list = await ArticleModel.find({}, {}, {
            limit: webconfig.eapag
      }).sort({
            ctime: -1
      }).populate('uid');

      let total = await ArticleModel.count();

      // 计算总数
      let pages = Math.ceil(total / webconfig.eapag);

      let pagelistarr = [];
      for (let i = 1; i <= pages; i++) {
            pagelistarr.push(i);
      }

      // 进行标签过滤处理
      list = list.map((x) => {
            x.id = x._id.toString().slice(1, -1);
            x.ct = formatDate(x.ctime, format = "YY年MM月DD日");
            x.content = xss(x.content, {
                  whiteList: [], // 白名单为空，表示过滤所有标签
                  stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
                  stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
            }).slice(0, 100);
            return x;
      })

      ctx.render('index', {
            islogin: ctx.session.islogin,
            list: list,
            webname: webconfig.webname,
            curpage: 1,
            pagelistarr: pagelistarr
      });
});


// 分页
router.get('/pagelist/:id', async (ctx, next) => {

      // 关联用户集合填充uid
      let list = await ArticleModel.find({}, {}, {
            skip: (ctx.params.id - 1) * webconfig.eapag,
            limit: webconfig.eapag
      }).sort({
            ctime: -1
      }).populate('uid');

      // 计算总条数
      let total = await ArticleModel.count();

      // 计算分页数量
      let pages = Math.ceil(total / webconfig.eapag);

      let pagelistarr = [];
      for (let i = 1; i <= pages; i++) {
            pagelistarr.push(i);
      }

      // 进行标签过滤处理
      list = list.map((x) => {
            x.id = x._id.toString().slice(1, -1);
            x.ct = formatDate(x.ctime, format = "YY年MM月DD日");
            x.content = xss(x.content, {
                  whiteList: [], // 白名单为空，表示过滤所有标签
                  stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
                  stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
            }).slice(0, 100);
            return x;
      })

      ctx.render('index', {
            islogin: ctx.session.islogin,
            list: list,
            webname: webconfig.webname,
            curpage: ctx.params.id,
            pagelistarr: pagelistarr
      });
});


// 登陆
router.get('/login', (ctx, next) => {
      ctx.render('login');
});

// 注册
router.get('/reg', (ctx, next) => {
      ctx.render('reg');
});


// 详情页
router.get('/news/:id', async (ctx, next) => {

      // 获取文章详情数据
      let date = await ArticleModel.findOne({
            _id: ctx.params.id
      }).populate('uid');

      date.ct = formatDate(date.ctime, format = "YY年MM月DD日");

      let iscollection = await CollectionModel.findOne({
            uid: ctx.session.uid,
            aid: ctx.params.id
      })

      ctx.render('page', {
            islogin: ctx.session.islogin,
            date: date,
            aid: ctx.params.id,
            iscollection: iscollection?'cur':''
      });
});

module.exports = router;