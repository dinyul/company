		var is_close = "";
		var timeThread = null; //预售商品计时器线程对象


		$(function() {
		    $(window).load(function() {
		        showCartStatus();
		    })

		});

		/**
		 * 加入购物车
		 */
		function addProductinCart(goodsId, goodsPrice, goodsPriceNew, goodsCount, count, childrenGoodsIds) {
		    if (is_close != "") {
		        popShow();
		        return;
		    }
		    var carHelper = new CartHelper();
		    var cart = carHelper.Read();
		    if (Number(count) != Number(-1)) {
		        if (count == 0) {
		            alert("超出库存范围");
		            return false;
		        } else {
		            var index = carHelper.Find(goodsId,childrenGoodsIds);
		            if (index != -1) {
		                var goodCount = cart.Items[index].GoodsCount;
		                if (Number(goodCount) >= Number(count)) {
		                    alert("超出库存范围");
		                    return false;
		                }
		            }
		        }
		    }
		    carHelper.Add(goodsId, goodsPrice, goodsPriceNew, goodsCount, count, childrenGoodsIds);
		    showCartStatus();
		    return true;
		    //	addProduct(event);
		}

		//加入购物车动画
		function addProduct(event) {
		    var offset = $('#end').offset(),
		        flyer = $('<img class="u-flyer del" src="images/profile-80_1.jpg"/>');
		    flyer.fly({
		        start: {
		            left: event.pageX,
		            top: event.pageY - $(document).scrollTop()
		        },
		        end: {
		            left: offset.left + 25,
		            top: $(window).height() - 60,
		            width: 20,
		            height: 20
		        }
		    });
		}

		function plus() {
		    $(this).parent().find('.num-left').css('display', 'block')
		    $(this).parent().find('input').css('display', 'block')
		    $(this).parent().find('input').val(parseInt($(this).parent().find('input').val()) + 1);
		}

		/**
		 * 改变购物车商品数量(减)
		 * @param goodsId
		 */
		function minus(goodsId) {
		    var carHelper = new CartHelper();
		    var cart = carHelper.Read();
		    var index = carHelper.Find(goodsId);
		    if (index != -1) {
		        var goodCount = cart.Items[index].GoodsCount - 1;
		        if (goodCount > 0) {
		            carHelper.Change(goodsId, parseInt(goodCount));
		        } else {
		            carHelper.Del(goodsId);
		        }
		    }
		    showCartStatus();
		}


		/**
		 * 购物车数值状态
		 */
		function showCartStatus() {
		    var carHelper = new CartHelper();
		    var car = carHelper.Read();
		    //car.Total;
		    car.Count;


		    /*if(car.Count > 0){
		    	//$('.cexuanf').css('padding-right','0px'); 
		    	$("#selectedTotal").html(car.Count);
		    	console.log(car.Count)
		    }else{
		    	$('.cexuanf').css('padding-right','10px');
		    	//$("#cartInfo").html('<span id="goodsCount" class="hide">'+car.Count+'</span>');
		    	$("#selectedTotal").html(car.Count);
		    }*/
		    if (car.Count > 0) {
		        //$('.cexuanf').css('padding-right','0px');
		        // $('#totalPrice_2').html(Number(car.Total).toFixed(2) + " 元")
		        $("#selectedTotal").html('<span id="goodsCount">' + car.Count + '</span>');
		        $(".selectedTotal1").html('<span id="goodsCount">' + car.Count + '</span>');
		        $('#save').html((Number(car.Original) - Number(car.Total)).toFixed(2))
		    } else {
		        //$('.cexuanf').css('padding-right','10px');
		        $("#selectedTotal").html('0');
		        $(".selectedTotal1").html('0');
		    }
		}


		//购物车状态显示
		/*
		function showCart(){
			var carHelper = new CartHelper();
			var car = carHelper.Read();
			car.Total;
			car.Count;
			if(car.Count == 0){
				$('.u-flyer').hide();
			}
			$("#cartCount").html("选好了("+car.Count+")");
			$("#price").html("¥"+car.Total+"");
		}
		*/

		/**
		 * 跳转购物车页
		 * @param goodsId
		 */
		function toCart(openId, orgId) {
		    window.location.href = '../wx_fhl/gwc.html';
		}