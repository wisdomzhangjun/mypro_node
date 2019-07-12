const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const UserModel = require('../dbModel/userModel');
const ArticleModel = require('../dbModel/articleModel');
const CollectionModel = require('../dbModel/collectionModel');
const multer = require('koa-multer');
const upload = multer({
      dest: 'public/uploads/'
});
const router = new Router();

// 登陆验证
router.post('/logcheck', async (ctx, next) => {
      
      
      let info = await UserModel.findOne({
            uname: ctx.request.body.uname
      });

      if (info != null) {
            if (info.pwd == ctx.request.body.pwd) {
                  // 记录登陆状态
                  ctx.session.islogin = "success";
                  // 记录用户id
                  ctx.session.uid = info._id;
                  // ctx.render('logcheck', {
                  //       result: "登陆成功!!!",
                  //       msg: "恭喜！登陆成功。",
                  //       mainpage: "前往首页"
                  // });
                  ctx.body = "登陆成功";
            } else {
                  // ctx.render('logerr', {
                  //       result: "密码错误!!!",
                  //       msg: "卧槽！密码怎么忘记了。",
                  //       backlog: "前往登陆页"
                  // });
                  ctx.body = "密码错误";
            }
      } else {
            // ctx.render('logerr', {
            //       result: "用户不存在!!!",
            //       msg: "卧槽！查无此人",
            //       backlog: "前往登陆页"
            // });
            ctx.body = "用户不存在";
      }
});

// 注册验证
router.post('/adduser', async (ctx, next) => {

      let exist = await UserModel.find({
            uname: ctx.request.body.uname
      });

      if (exist.length == 0) {
            let UserEntity = new UserModel({
                  uname: ctx.request.body.uname,
                  pwd: ctx.request.body.pwd,
            });
            await UserEntity.save((err, data) => {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log('插入数据成功！');
                  }
            })
            // ctx.render('regmsg', {
            //       msg: "注册成功",
            //       backreg: "前往登陆页",
            //       result: "注册成功,开心不"
            // });
            ctx.body = "注册成功";
      } else {
            // ctx.render('regmsg', {
            //       msg: "用户已存在",
            //       backreg: "前往登陆页",
            //       result: "卧槽！你居然已经注册了。"
            // });
            ctx.body = "用户已存在";
      }
});

// 退出
router.get('/exit', (ctx, next) => {
      ctx.session.islogin = null;
      // ctx.render('regmsg', {
      //       msg: "我在做清理工作",
      //       backreg: "前往首页",
      //       result: "希望下次在能见到你！！"
      // })
      ctx.body = "退出成功";
})


// 添加文章是否成功验证
router.post('/addarticle', upload.single('thumb'), async (ctx, next) => {
      console.log("收到添加文章请求....");
      // 设置上传目录的绝对路径
      const uploadroot = path.resolve(__dirname, '../', ctx.req.file.destination)
      // 组合缓存目录的绝对路径
      const temfilepath = path.resolve(uploadroot, ctx.req.file.filename);
      // 组合最终的文件名字
      const distfilename = temfilepath + path.extname(ctx.req.file.originalname);

      fs.rename(temfilepath, distfilename);

      // 获取最终的路径
      const thumburl = distfilename.replace(path.resolve(__dirname, '../public'), ' ');

      let ArticleEntity = new ArticleModel({
            title: ctx.req.body.title,
            content: ctx.req.body.content,
            thumb: thumburl,
            uid: ctx.session.uid,
            ctime: new Date()
      });

      await ArticleEntity.save((err, data) => {
            if (err) {
                  console.log(err);
            } else {
                  console.log('添加文章成功');
            }
      });
      ctx.response.redirect('/');
})

// 收藏文章
router.post('/collection', async (ctx, next) => {
      let iscollection = await CollectionModel.findOne({
            uid: ctx.session.uid,
            aid: ctx.request.body.aid
      });

      if(ctx.session.islogin != "success"){
            ctx.body = JSON.stringify({
                  // 返回1表示未登陆
                  stu:"1"
            });
      }else{
            if (iscollection) {
                  await CollectionModel.remove({
                        uid: ctx.session.uid,
                        aid: ctx.request.body.aid
                  });
                  ctx.body = JSON.stringify({
                        // 返回1表示之前已经收藏过
                        stu:"2"
                  })
            }else{
                  let CollectionEntity = new CollectionModel({
                        uid: ctx.session.uid,
                        aid: ctx.request.body.aid
                  });
                  await CollectionEntity.save((err,data)=>{
                        if(err){
                              console.log(err);
                        }
                  });
                  ctx.body = JSON.stringify({
                        // 返回3表示之前没收藏过
                        stu:"3"
                  }) 
            }
      }
})


// 删除文章
router.get('/del/:id', async (ctx, next) => {
      await ArticleModel.remove({_id:ctx.params.id});
      ctx.render('delartmsg',{
            msg: "删除文章成功",
            backreg: "返回个人中心",
            result: "文章已经删除成功"
      });
      // ctx.body = "删除文章成功";
})

// 更新文章
router.post('/updateart', upload.single('thumb'), async (ctx, next) => {
     
      if(ctx.req.file){
            // 设置上传目录的绝对路径
            const uploadroot = path.resolve(__dirname, '../', ctx.req.file.destination)
            // 组合缓存目录的绝对路径
            const temfilepath = path.resolve(uploadroot, ctx.req.file.filename);
            // 组合最终的文件名字
            const distfilename = temfilepath + path.extname(ctx.req.file.originalname);

            fs.rename(temfilepath, distfilename);

            // 获取最终的路径
            const thumburl = distfilename.replace(path.resolve(__dirname, '../public'), ' ');
            await ArticleModel.update({
                  _id:ctx.req.body.aid
            },{
                  $set:{
                        title:ctx.req.body.title,
                        content:ctx.req.body.content,
                        thumb: thumburl
                  }
            })
      }else{
            await ArticleModel.update({
                  _id:ctx.req.body.aid
            },{
                  $set:{
                        title:ctx.req.body.title,
                        content:ctx.req.body.content
                  }
            })
      }

      ctx.render('updateartmsg',{
            msg: "更新文章成功",
            backreg: "返回个人中心",
            result: "文章已经更新成功"
      });
})

module.exports = router;