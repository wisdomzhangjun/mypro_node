$(".container .top .tabtitle p").click(function () {
    // alert($(this).index())
    $(this).addClass('cur').siblings().removeClass('cur');
    $(".container .tab>div").eq($(this).index()).show()
    .siblings('div').hide();
})


// $(".container .tab .articles ul li .r .btn.del").click(function(){
//     layer.confirm('你确定要删除吗？', {
//         btn: ['确定', '取消'] //按钮
//     }, function () {
//         // layer.msg('删除', { icon: 1 });
//         location.href = "./del/dfadafaf"
//     }, function () {
//         layer.msg('已取消', { icon: 1 });
//     });
// })