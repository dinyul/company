(function(api, util, ajax) {

    var goodsId = util.getUrlParams("goodsId"), //商品Id
        id = util.getUrlParams("id"),
        goolas, //商品信息
        selectCount = 1, //计商品数量
        price = 0,
        newPrice = 0,
        isGroup = util.getUrlParams("isgroup"),
        activityId = util.getUrlParams("activityId"),
        groupCount = "",
        priceAttribute = "",
        bottomItem = "";
    
        

    var interfaceName = api.baseServerUrl + (isGroup ? "/goods/findGroupBuyingGoods" : "/goods/findGoods"),
        interfaceParams = {
            "goodsId": goodsId,
            "lat": getCookie('lat'),
            "lng": getCookie('lng'),
            "locationType": 1
        };
        activityId ? interfaceParams.activityId = activityId : "" ;
        
    ajax.post(interfaceName, interfaceParams, function(response) {
        priceAttribute = isGroup ? "data-ptprice" : "data-price";
        if(isGroup){
            groupCount = response.groupBuying.groupBuyingPeopleNumber
        }
        
        bottomItem = isGroup == "kaituan" ? groupCount + "人团" : "立即参团"
        if(response.comboGoods){
            $(response.comboGoods).each(function(i,item){
                sizeSort(item)
            })
        }else{
            sizeSort(response)
        }
        $(response.comboGoods).each(function(i, v) { price += v.goods.preferentialPrice; })
        goolas = response
        newPrice = response.goods.preferentialPrice
        response.picUrl = api.picUrl
        util.render("#zuhe-select", response, ".select-area")

        if(isGroup){
            $(".bottom>p").css({"line-height":"0.53rem",paddingTop: "0.1875rem",paddingBottom: "0.1875rem"})
            $(".bottom .addgwc").html("单独购<br/>￥"+response.goods.preferentialPrice)/*.css({background: "#4a4a4a"})*/
            $(".bottom .payment1").html(bottomItem + "<br/>￥" + response.groupBuying.groupBuyingPrice)
            $(".bottom-slide-num").hide()
            $(".bottom p").eq(0).addClass("tuan-addgwc")
            $(".bottom p").css("font-size","0.40625rem")
        }else{
            $(".bottom .addgwc").html("加入购物车")/*.css({background: "#4a4a4a"})*/
            $(".bottom .payment1").html("立即购买")
        }

        //设置默认选中
        $(".select-area ul").each(function(i) {
            $(this).find("li").eq(0).addClass("active")
            if( /relation/.test( $(this).attr("class") ) ){

                $(this).parents(".choise").find(".specs .type1").html($(this).find("li").eq(0).html())
            }else{
                if($(this).find("li").eq(0).attr("data-stock") != "undefined" && Number($(this).find("li").eq(0).attr("data-stock")) >= 0){
                    $(this).parents(".choise").find(".specs .type2").html($(this).find("li").eq(0).attr("data-stock"))
                }  
            }
        })

        //设置默认显示
        $(".choise").each(function() {
            $(this).find(".spec .goolasId").first().addClass("selected").show().find(".active").trigger("click")
        })
        

        $(".choise").delegate("li", "click", function() {

            if($(this).attr("data-stock") == "undefined" || Number( $(this).attr("data-stock") <= 0)){
                $(".bottom .addgwc").removeClass().addClass("addgwc_gray").off("click")
                $(".bottom .payment1").removeClass().addClass("payment1_gray").off("click")
                $(".bottom").css("background","#000") 
                $(this).siblings().removeClass("active");
                $(this).parents(".choise").find(".specs .type2").html("")
                $(this).parents(".choise").find(".stockElement .stocks").html(0)
                if(isGroup == "kaituan"){
                    $(".bottom .addgwc").html("单独购<br/>￥0.00")
                }

                return false
            }else{
                $(".bottom .addgwc_gray").off("click").removeClass("addgwc_gray").addClass("addgwc").on("click",addGwc)
                $(".bottom .payment1_gray").off("click").removeClass("payment1_gray").addClass("payment1").on("click",payment1)    
            } 
            $(this).addClass("active").siblings().removeClass("active");
            if(/goolasId/.test($(this).parent().attr("class"))){
                $(this).parents(".choise").find(".specs .type2").html($(this).html())
                $(this).parents(".choise").find(".stockElement .stocks").html($(this).attr("data-stock"))
                $(this).parents(".choise").find("dl dt>img").attr("src",$(this).attr("data-imgpath"))
                $(this).parents(".choise").find(".price").html("￥<span>"+$(this).attr(priceAttribute)+"</span>")
                $(".amount").html("1")
                selectCount = 1    
                if(isGroup){
                    $(".bottom .payment1").html(bottomItem + "<br/>￥"+$(this).attr("data-ptprice"))
                    $(".bottom .addgwc").html("单独购<br/>￥" + $(this).attr("data-price"))
                }
            }
            if(goolas.goods.repertoryTotalNum == 0){
                $(".bottom .addgwc").removeClass().addClass("addgwc_gray").off("click")
                $(".bottom .payment1").removeClass().addClass("payment1_gray").off("click")
                $(".bottom").css("background","#000") 
            }
        })


        $(".goolasId").each(function(){
            $(this).find("li").each(function(){
                if($(this).attr("data-stock") == "undefined" || Number( $(this).attr("data-stock") <= 0)){
                    $(this).removeClass().addClass("not_stock");
                }
            })
        })

        //点击显示对应的规格列表
        $(".choise").delegate(".relation>li", "click", function() {
            var ind = $(this).index();
            $(this).parents(".choise").find(".stockElement .stocks").html(0);
            $(this).parents(".spec").next().find(".goolasId").hide().removeClass("selected").eq(ind).show().addClass("selected");
            $(this).parents(".choise").find(".specs .type1").html($(this).html()) 
            $(this).parents(".choise").find("dl dt>img").attr("src",$(this).parents(".spec").next().find(".selected li.active").attr("data-imgpath"))
            $(this).parents(".choise").find(".price").html("￥<span>"+$(this).parents(".spec").next().find(".selected li.active").attr(priceAttribute)+"</span>") 
            if(isGroup){
                $(".bottom .addgwc").html("单独购<br/>￥" + $(this).parents(".spec").next().find(".selected li.active").attr("data-price"))                
                $(".bottom .payment1").html(bottomItem + "<br/>￥"+$(this).parents(".spec").next().find(".selected li.active").attr("data-ptprice"))
            }           
            if($(this).parents(".spec").next().find(".selected li.active").eq(0).attr("data-stock") == "undefined"){
                $(this).parents(".choise").find(".stockElement .stocks").html(0)
            }else{
                $(this).parents(".choise").find(".stockElement .stocks").html($(this).parents(".spec").next().find(".selected li.active").eq(0).attr("data-stock"))
            }
            if($(this).parents(".spec").next().find(".selected li.active").length == 1){
                 $(this).parents(".choise").find(".specs .type2").html($(this).parents(".spec").next().find(".selected li.active").eq(0).html())
            }else{
                 $(this).parents(".choise").find(".specs .type2").html(" ");
                 if(isGroup){
                    $(".bottom .addgwc").html("单独购<br/>￥0.00")
                    $(".bottom .payment1").html(bottomItem + "<br/>￥0.00")    
                } 
                 $(this).parents(".choise").find(".price").html(" ");
            }
            $(".amount").html("1")
            selectCount = 1          
        })

        //默认触发一次一级规格单击事件
        $(".relation").each(function(){
            $(this).find("li.active").trigger("click")
        })


        

        $(".stocks").each(function(){
            $(this).html( $(this).parents("dl").next().next().find("ul li").eq(0).attr("data-stock") == "undefined" ? 0 : $(this).parents("dl").next().next().find("ul li").eq(0).attr("data-stock"))    
        })

        $(".slide-btn").delegate(".minus", "click", function() {
            selectCount--;
            if (selectCount <= 1) {
                selectCount = 1;
                $(this)
                    .css('background', '#fff url(/imgs/shangpin/gouwuchemin.png?t=20161117) no-repeat center center')
                    .css('background-size', '0.375rem 0.375rem')
            }
            $(this).next().html(selectCount);


        }).delegate(".add", "click", function() {
            if( !idJudge(goolas,goodsId) ){
                alert("库存不足！")
                return false;
            }
            selectCount++;
            var selectRepotry = idJudge(goolas,goodsId).goolasRepotry[0];
            if(selectCount > selectRepotry){
                selectCount = selectRepotry == 0 ? 1 : selectRepotry;
                alert("库存不足")
            }
            if (selectCount > 1) {
                $(".minus")
                    .css('background', '#fff url(/imgs/shangpin/gouwuchemin1.png?t=20161117) no-repeat center center')
                    .css('background-size', '0.375rem 0.375rem')
            }
            $(this).prev().html(selectCount);
        })

        var addGwcFlag = 1;

        $('.addgwc').off("click").on("click",addGwc)
        function addGwc() {
            var idJudgeObj = idJudge(goolas,goodsId)
            if(!idJudgeObj){
                alert("请选择"+response.type2+"！")
                return false
            }
            //添加进购物车
            if(addGwcFlag == 1){
                addGwcFlag++;
                if (addProductinCart(idJudgeObj.goodsId, price, newPrice, selectCount, idJudgeObj.goolasRepotry[0], idJudgeObj.goolasId)) {
                    //退回详情页
                    var temp = isGroup ? "&tuan=" + isGroup + "&activityId=" + activityId : "" ;
                    window.location.href="/shangpin/shangpinxiangqing.html?goodsId=" + goodsId + temp;
                }   
            }    
        }

        $('.payment1').off("click").on("click",payment1)
        function payment1() {
            var idJudgeObj = idJudge(goolas,goodsId);
            if(!idJudgeObj){
                alert("请选择"+response.type2+"！")
                return false
            }
            var goolasIdParams = "&goolasId=" + idJudgeObj.goolasId;
            if(!idJudgeObj.goolasId){
                goolasIdParams = ""
            } 
            if(isGroup){
                window._hmt && window._hmt.push(['_trackEvent', "开团", idJudgeObj.goodsId]);
                window.location.href = "../../tuan/payment.html?goodsId=" + idJudgeObj.goodsId + "&tuan="+isGroup+"&activityId=" + response.groupBuying.activityId + "&id=" + id       
            }else{
                window.location.href = "../../payment/payment.html?goodsId=" + idJudgeObj.goodsId + "&buyCount=" + selectCount + goolasIdParams;
            }
        }


        //处理单品和组合商品购买及加入购物车时的商品id及库存
        function idJudge(goolas, goodsId) {

            var obj = {
                goodsId: "",
                goolasId: "",
                goolasRepotry: []
            }
            obj.goodsId = goodsId
            $(goolas.comboGoods).each(function(i, v) {
                if (v.ifSelectFlag == 0) {
                    obj.goolasId += v.goods.goodsId + ","
                    obj.goolasRepotry.push(v.goods.repertoryNum)
                }
            })
            //获取用户选择规格的单品ID
            $(".selected").each(function() {
                obj.goolasId += $(this).find(".active").attr("id") + ","
                obj.goolasRepotry.push(Number($(this).find(".active").attr("data-stock")))
            })
            obj.goolasId = obj.goolasId.substr(0, obj.goolasId.length - 1); //拼接成参数

            if(/undefined/.test(obj.goolasId)){
                return false;
            }else{
                if(goolas.goods.goodsType == 1){
                    obj.goodsId = obj.goolasId
                    obj.goolasRepotry.push(goolas.goods.repertoryTotalNum)
                }
                obj.goolasRepotry = obj.goolasRepotry.sort(function(i,v){ return i - v})
                if(obj.goodsId == obj.goolasId){
                    obj.goolasId = "";
                }
                return obj
            }
            
        }



        //库存不足禁用底部按钮
        if(!goolas.goods.repertoryTotalNum || goolas.goods.repertoryTotalNum <= 0 ){
            $(".bottom .addgwc").removeClass().addClass("addgwc_gray").off("click")
            $(".bottom .payment1").removeClass().addClass("payment1_gray").off("click")
            $(".bottom").css("background","#000") 
        }
        
    })


    //规格排序
    function sizeSort(response){
        var obj = {
            "XS": 1,
            "S" : 2,
            "M" : 3,
            "L" : 4,
            "XL": 5,
            "2XL":6,
            "XXL":6,
            "3XL":7,
            "XXXL":7,
            "4XL":8,
            "XXXXL":8
        }
        var sizeTemp = response.typeInfo
        var tempArray = [];
        var keys = "";
        for( i in sizeTemp){
            tempArray = []
            for(key in sizeTemp[i]){ 
                keys = key.toUpperCase()
                //sizeTemp[i][key].groupBuyingPrice = Math.ceil(Math.random()*10)
                //sizeTemp[i][key].goods.repertoryNum = 0;
                if(obj[keys]){
                    sizeTemp[i][key].key = keys
                    sizeTemp[i][key].sortVariable = obj[keys] 
                    tempArray.push(sizeTemp[i][key])
                }else{
                    sizeTemp[i][key].key = key
                    sizeTemp[i][key].sortVariable = parseFloat(key)
                    tempArray.push(sizeTemp[i][key])
                }
            }
            sizeTemp[i] = selectionSort(tempArray,"sortVariable");
        }
    }
    
    //选择排序
    function selectionSort(arr,sortVariable) {
        var len = arr.length;
        var minIndex, temp;
        var temp1,temp2;
        for (var i = 0; i < len - 1; i++) {
            minIndex = i;
            for (var j = i + 1; j < len; j++) {
                temp1 = sortVariable ? arr[j][sortVariable] : arr[j];
                temp2 = sortVariable ? arr[minIndex][sortVariable] : arr[minIndex];
                if (temp1 < temp2) {     
                    minIndex = j;                 
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        return arr;
    }








})(goola.api, goola.util, goola.ajax)