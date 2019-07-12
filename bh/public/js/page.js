$(function(){
    $(".container .star").click(function () {
        var _this = $(this);
        $.ajax({
            url:"/collection",
            type:"post",
            data:{aid:aid},
            dataType:"json",
            success:function(data){
                console.log(data);
                var jqthis = $(this);
                if(data.stu == 1){
                    alert("未登陆,不能进行收藏操作!!!");
                }else{
                    if(data.stu == 2){
                        alert("取消收藏成功");                    
                        _this.removeClass("cur");
                    }else{
                        alert("收藏文章成功");
                        _this.addClass("cur");
                    }
                }  
            }
        })
    })
})