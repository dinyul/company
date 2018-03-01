
	TotalPrice()
//删除商品
	$('.gouwuche-content ul').delegate('.delete','click',function(){
			if($(this).parent().parent().children().length==2){
				$(this).parent().parent().remove()
			}else{
				$(this).parent().remove()
			}
			if($('.gouwuche-content').children().length==0){
				$('.gouwuche-content').html('<p>还没有添加购物车</p>')
			}
			TotalPrice();
		})
//数量减
	$('.gouwuche-content ul').delegate('.minus','click',function() {
	    var t = $(this).parent().find('.am-num-text');
	    t.html(parseInt(t.html()) - 1);
	    if (t.html() <= 1) {
	      t.html(1);
	    }
	    TotalPrice();
	  });
  // 数量加
	$('.gouwuche-content ul').delegate(".plus",'click',function() {
	    var t = $(this).parent().find('.am-num-text');
	    t.html(parseInt(t.html()) + 1);
	    if (t.html() <= 1) {
	      t.html(1);
	    }
	    TotalPrice();
	});
  // 点击商品按钮
    $('.gouwuche-content ul').delegate('.GoodsCheck','click',function() {
	   	$(this).parent().toggleClass('checked')
	    var goods = $(this).closest(".one-shop").find(".GoodsCheck"); //获取本店铺的所有商品
	    var goodsC = $(this).closest(".one-shop").find(".GoodsCheck:checked"); //获取本店铺所有被选中的商品
	    //var Shops = $(this).closest(".one-shop").find(".ShopCheck"); //获取本店铺的全选按钮
	    TotalPrice();
	      // 计算
	});
  	function TotalPrice() {
	    var allprice = 0,aallprice=0,saveprice=0,nums=0; //总价
	    $(".one-shop").each(function() { //循环每个店铺
	      var oprice = 0,aprice=0,num=0; //店铺总价
	      $(this).find(".GoodsCheck").each(function() { //循环店铺里面的商品
	        if ($(this).is(":checked")) { //如果该商品被选中
	          num = parseInt($(this).parents(".one-goods").find(".am-num-text").html()); //得到商品的数量
	          var price = parseFloat($(this).parents(".one-goods").find(".GoodsPrice").text()); //得到商品的单价
	          var a=parseFloat($(this).parents(".one-goods").find(".a").text());
	          var total = price * num; //计算单个商品的总价
	          oprice += total; //计算该店铺的总价
	          var atotal=a*num  //计算单个商品的原价的总价
	          aprice+=atotal    //计算该店铺的原价的总价
	          nums+=num       //计算全部商品的数量
	        }
	      });
	      var oneprice = oprice; //得到每个店铺的总价
	      allprice += oneprice; //计算所有店铺的总价
	
	      var aoneprice=aprice;   //得到每个店铺的原价
	      aallprice+=aoneprice;   //计算所有店铺的原价
	      saveprice=aallprice-allprice;   //计算所有店铺节省的价格
	    });
	    $("#AllTotal").text(allprice.toFixed(2)); //输出全部总价
	    $('#save').text(saveprice.toFixed(2))		//输出全部节省价格
	    $('#selectedTotal').text(nums)
	}
  				
