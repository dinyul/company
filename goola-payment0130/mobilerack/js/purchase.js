


//购物车
var Cart = function() {
	this.Count = 0;
	this.Total = 0;
	this.Original = 0;
	this.Items = new Array();
};
// 购物车项
var CartItem = function() {
	this.GoodsId = 0;//商品id
	this.GoodsCount = 0;//购买数量
	this.RepertoryCount = 0;//库存量
	
	//2016年3月1日11:56:24注释
	//this.GoodsName = "";//商品名字
	//this.GoodsPhoto = "";//商品图片名字
	//this.ProviderId = 0;//供应商id
	//this.CategoryId = 0;//类别id
};
// 购物车操作
var CartHelper = function(shopId,operId) {
	
	var name = 'purchase'+shopId+"&"+operId;
	
//	alert(name);
	this.cookieName = name;
	
	//初始化一个购物车
	this.Clear = function() {
		var cart = new Cart();
		this.Save(cart);
		return cart;
	};
	// 向购物车添加
	//this.Add = function(goodsId, goodsName, goodsPhoto, goodsPrice, goodsPriceNew, goodsCount, providerId, repertoryCount, categoryId) {
	this.Add = function(goodsId, goodsCount, repertoryCount) {
		setCookie('purchase','true',60/24/60)
//		console.log(goodsId+"   "+ goodsName+"   "+ goodsPhoto+"   "+goodsPrice+"   "+goodsCount+"   "+ providerId+""+goodsPriceNew+""+repertoryCount);
//		console.log(goodsId+"   "+ goodsPrice+"   "+ goodsPriceNew+"   "+goodsCount+"   "+repertoryCount);
		//得到购物车
		var cart = this.Read();
		cart.Count++;
		//index 为此商品在购物车项中的下标
		var index = this.Find(goodsId);
		// 如果ID已存在，覆盖数量
		if (index > -1) { //说明该商品已经存在于购物车
			//先将此项商品的价钱从总数中删除
			//cart.Total -= (((cart.Items[index].GoodsCount * 100) * (cart.Items[index].GoodsPrice * 100)) / 10000);
			//cart.Total -= accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPrice);
			//cart.Total = accSub(cart.Total,accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPriceNew));
			//cart.Original=accSub(cart.Original,accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPrice));
			//将此商品总条数改变
			//cart.Items[index].Count = count;
			//cart.Items[index].GoodsCount=parseInt(cart.Items[index].GoodsCount)+parseInt(goodsCount);
			//cart.Items[index].RepertoryCount=parseInt(cart.Items[index].RepertoryCount)+parseInt(repertoryCount);
			//console.log(cart.Items[index].GoodsCount+'  '+goodsCount)
			//重新将此商品的小计  加入总价格里面
			//cart.Total += (((cart.Items[index].GoodsCount * 100) * (cart.Items[index].GoodsPrice * 100)) / 10000);
			//cart.Total += accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPrice);
			//cart.Total = accAdd(cart.Total,accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPriceNew));
			//cart.Original=accAdd(cart.Original,accMul(cart.Items[index].GoodsCount,cart.Items[index].GoodsPrice));
		} else {//购物车中没有此类商品
			//新定义了一个购物车项
			var item = new CartItem();
			item.GoodsId = goodsId;
			//item.GoodsPrice = goodsPrice;
			//item.GoodsPriceNew = goodsPriceNew;
			item.GoodsCount = goodsCount;
			item.RepertoryCount = repertoryCount;
			
			//2016年3月1日12:01:46注释
			//item.GoodsName = goodsName;
			//item.GoodsPhoto = goodsPhoto;
			//item.ProviderId = providerId;
			//item.CategoryId = categoryId;
			//将商品加入到购物车项中
			cart.Items.push(item);
			//购物车中的商品数量加1
			//cart.Count++;
			//重新计算总价
			//cart.Total += (((item.GoodsCount * 100) * (item.GoodsPrice * 100)) / 10000);
			//cart.Total += accMul(item.GoodsCount,item.GoodsPrice);
			//cart.Total = accAdd(cart.Total,accMul(item.GoodsCount,item.GoodsPriceNew));
			//cart.Original=accAdd(cart.Original,accMul(item.GoodsCount,item.GoodsPrice));
		}
		//操作cookie保存购物车
		this.Save(cart);
		return cart;
	};

	// 改变数量
	this.ChangeGoodsCount = function(goodsId, goodsCount, repertoryCount) {
		//从cookie 中读取了购物车
		var cart = this.Read();
		//查询出购物车中 id所对应的订单项的下标
		var index = this.Find(goodsId);
		//将订单项的的数量替换
		cart.Items[index].GoodsCount = goodsCount;
		if(repertoryCount!=''&& repertoryCount!=undefined && repertoryCount!=null){
			cart.Items[index].RepertoryCount = repertoryCount;
		}
		//将购物车  重新存入cookie中
		this.Save(cart);
		return cart;

	};
	// 移出购物车
	this.Del = function(goodsId) {
		//从cookie中取出购物车
		var cart = this.Read();
		//检查此商品是否存在于购物车
		var index = this.Find(goodsId);
		if (index > -1) { //存在
			//从购物车项中得到购物车项
			var item = cart.Items[index];
			//将其购物车的数量减1
			cart.Count--;
			//计算总价
			//cart.Total = cart.Total - (((item.GoodsCount * 100) * (item.GoodsPrice * 100)) / 10000);
			//cart.Total = cart.Total - accMul(item.GoodsCount,item.GoodsPrice);
			//cart.Total = accSub(cart.Total,accMul(item.GoodsCount,item.GoodsPriceNew));
			//cart.Original=accSub(cart.Original,accMul(item.GoodsCount,item.GoodsPrice));
			//将 index的这个商品从集合中删除   
			cart.Items.splice(index, 1);
			//保存购物车到cookie
			this.Save(cart);
		}
		return cart;
	};
	// 根据ID查找
	this.Find = function(goodsId) {
		//将购物车从cookie中读取
		var cart = this.Read();
		//先定义 index 为-1 表示没有该数据
		var index = -1;
		//遍历购物车检查是否存在 id 的商品
		for (var i = 0; i < cart.Items.length; i++) {
			if (cart.Items[i].GoodsId == goodsId) {
				//如果有则将 将其下标付给 index
				index = i;
			}
		}
		return index;
	};

	// COOKIE操作

	this.Save = function(cart) {
		var source = "";
		//遍历购物车的购物车项
		for (var i = 0; i < cart.Items.length; i++) {
			if (source != "") {
				//用 |$| 将购物车项分隔开来
				source += "|$|";
			}
			//将购物车项加入到 sourse中
			source += this.ItemToString(cart.Items[i]);
		}
		//重新存入cookie
		//$.cookie(this.cookieName, source,{path: '/' });
//		$.cookie(this.cookieName, source, {expires:1});
		localStorage.setItem(this.cookieName, source)
	};

	this.Read = function() {
//		alert(this.cookieName)
		// 读取COOKIE中的集合
		//var source = $.cookie(this.cookieName);
		var source = localStorage.getItem(this.cookieName)
		//新建一个购物车 用来接收cookie里面的东西
		var cart = new Cart();
		//判断cookie里的购物车是否为空 为空则返回 一个新new 的购物车
		if (source == null || source == "") {
			return cart;
		}
		//将cookie中的东西用 |$| 分隔开 得到物车项数组
		var arr = source.split("|$|");
		//将数组的长度付给购物车的数量
		cart.Count = 0;
		//遍历数组 得到每个购物车项
		for (var i = 0; i < arr.length; i++) {
			// 用itemToObject将每个购物车项合成对象
			var item = this.ItemToObject(arr[i]);
			//再将购物车项装入购物车的items
			cart.Items.push(item);
			//cart.Total += (((item.GoodsCount * 100) * (item.GoodsPrice * 100)) / 10000);
			//cart.Total +=accMul(item.GoodsCount,item.GoodsPrice);
			//cart.Total = accAdd(cart.Total,accMul(item.GoodsCount,item.GoodsPriceNew));
			//cart.Original=accAdd(cart.Original,accMul(item.GoodsCount,item.GoodsPrice));
			cart.Count = Number(cart.Count) + Number(item.GoodsCount);
			cart.RepertoryCount = Number(cart.RepertoryCount) + Number(item.RepertoryCount);
		}
		return cart;
	};

	this.ItemToString = function(item) {
		//将购物车项 对象 转化为字符串
//		return item.GoodsId + "||" + escape(item.GoodsName) + "||"+ escape(item.GoodsPhoto) + "||" + item.GoodsPrice + "||"+item.GoodsPriceNew + "||" + item.GoodsCount + "||" + item.ProviderId + "||" +item.RepertoryCount + "||" +item.CategoryId;
		return item.GoodsId + "||" +  item.GoodsCount + "||" +item.RepertoryCount;
	};

	this.ItemToObject = function(str) {
		//将str字符串拆分得到一个数组 数组转成对象
		var arr = str.split('||');
		var item = new CartItem();
		item.GoodsId = arr[0];
		//item.GoodsPrice = arr[1];
		//item.GoodsPriceNew = arr[2];
		item.GoodsCount = arr[1];
		item.RepertoryCount = arr[2];
		
		//item.GoodsId = arr[0];
		//item.GoodsPrice = arr[3];
		//item.GoodsPriceNew = arr[4];
		//item.GoodsCount = arr[5];
		//item.RepertoryCount = arr[7];
		//item.GoodsName = unescape(arr[1]);
		//item.GoodsPhoto = unescape(arr[2]);
		//item.ProviderId = arr[6];
		//item.CategoryId = arr[8];
		// 返回
		return item;
	};
};