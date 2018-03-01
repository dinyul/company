goola.extend(goola.util || (goola.util = {}), {

	browser : function () {
		
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    
	    var isOpera = userAgent.indexOf("Opera") > -1;
		   
		    if (isOpera) {
		        return {
		        	opera : true
		        }
		    }; //判断是否Opera浏览器
		    if (userAgent.indexOf("Firefox") > -1) {
		         return {
		        	firefox : true
		        }
		    } //判断是否Firefox浏览器
		    if (userAgent.indexOf("Chrome") > -1){
			     return {
		        	chrome : true
		        }
			 }
		    if (userAgent.indexOf("Safari") > -1) {
		          return {
		        	safari : true
		        }
		    } //判断是否Safari浏览器
		    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		          return {
		        	msie : true
		        }
		    }; //判断是否IE浏览器
	}(),


	//验证手机
	checkMobile :function(v){

		return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(v);

	},
	checkZipCode :function(v){

		return /^\d{6}$/.test(v);

	},
	//文本域替换回车
	replace : function(v){
		return v.replace(/(\r|\n)/g,'<br/>');
	},
	//处理手机号 加星号
	dealMobile : function(phone){
		if(phone.length != 11){
			return phone;
		}
		return phone.substr(0, 3)+'*****'+phone.substr(8); 
	},
	//邮箱
	checkMail:function(v){
		return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v);
	},
	//验证是否位数字
	isNumber:function(v){
		var numberReg = /^[0-9]*$/;
		return numberReg.test(v)
	},
	//验证是否是中文
	isChinese:function(v){
		//是否包含中文
		var chineseReg = /([\u4E00-\u9FA5]+，?)+/;
		//是否包含中文
		//var chineseReg = /^([\u4E00-\u9FA5]+，?)+&/;
		return chineseReg.test(v)
	},
	//验证是否是大于0的数
	isNumber2:function(v){
		var numberReg = /^\d{0,7}\.{0,1}\d{0,2}$/g;
		return numberReg.test(v)
	},
	//验证是否是大于等于0的整数
	isNumber3:function(v){
		var numberReg =  /^\d+$/;
		return numberReg.test(v)
	},
	//验证数字是否小于0大于9999999
	numberSize:function(number){
		var flag = true;
		if(number<0 || number>9999999){
			flag = false;
		}
		return flag;
	},
	//验证数字是否大于等于0小于999999999的整数
	numberSize8:function(v){
		var reg=  /^[0-9]\d{0,8}$/;
		return reg.test(v)
	},
	//验证数字是否大于等于0小于99的正整数
	numberSize2:function(v){
		var reg=  /^[0-9]\d{0,1}$/;
		return reg.test(v)
	},
	//验证数字是否大于等于1小于99的正整数
	numberSize3:function(v){
		var reg=  /^[1-9]\d{0,1}$/;
		return reg.test(v)
	},
	//验证数字是否大于0小于999999999的正整数
	numberSize9:function(v){
		var reg=  /^[1-9]\d{0,8}$/;
		return reg.test(v)
	},
	//验证数字是否大于等于0小于999999999的正整数
	numberSize10:function(v){
		var reg=  /^[0-9]\d{0,8}$/;
		return reg.test(v)
	},
	//判断2位小数
	numberSize15:function(v){
		var reg=  /^[0-9]\d{0,8}$/;
		return reg.test(v)
	},
	//验证是否是小数点前最多8位，最多2位小数
	isNumber8:function(v){
		var numberReg = /^\d{0,8}\.{0,1}\d{0,2}$/g;
		return numberReg.test(v)
	},
	//验证是否是小数点前最多2位，最多2位小数
	isNumber12:function(v){
		var numberReg = /^[0-9]{1,2}([.][0-9]{1,2})?$/;
		return numberReg.test(v)
	},
	//验证是否是小数点前最多3位，最多2位小数
	isNumber13:function(v){
		var numberReg = /^[0-9]{1,3}([.][0-9]{1,2})?$/;
		return numberReg.test(v)
	},
	//保留2位小数
	Fractional: function(n){
        //小数保留位数
        var bit = 2;
        //加上小数点后要扩充1位
        bit++;
        //数字转为字符串
        n = n.toString();
        //获取小数点位置
        var point = n.indexOf('.');
        // 如果是整数，直接输出
         if( point == '-1'){
    		return n ;

   		 }
        //n的长度大于保留位数长度
        if (n.length > point + bit) {
            //保留小数后一位是否大于4，大于4进位
            if (parseInt(n.substring(point + bit, point + bit + 1)) > 4) {
                return n.substring(0, point) + "." + (parseInt(n.substring(point + 1, point + bit)) + 1);
            }
            else {
                return n.substring(0, point) + n.substring(point, point + bit);
            }
        }
        return n;
    },
    //保留1位小数
	Fractional1: function(n){
        //小数保留位数
        var bit = 1;
        //加上小数点后要扩充1位
        bit++;
        //数字转为字符串
        n = n.toString();
        //获取小数点位置
        var point = n.indexOf('.');
        // 如果是整数，直接输出
         if( point == '-1'){
    		return n ;

   		 }
        //n的长度大于保留位数长度
        if (n.length > point + bit) {
            //保留小数后一位是否大于4，大于4进位
            if (parseInt(n.substring(point + bit, point + bit + 1)) > 4) {
                return n.substring(0, point) + "." + (parseInt(n.substring(point + 1, point + bit)) + 1);
            }
            else {
                return n.substring(0, point) + n.substring(point, point + bit);
            }
        }
        return n;
    },
	//特殊字符
	checkStrValid: function(str) {
		var pattern = new RegExp("[%#$^&*+@|\\[\\]<>/]");

		return pattern.test(str);
	},
	//特殊字符
	checkStrValid2: function(str) {
		var pattern = /[#&+\\]/;

		return pattern.test(str);
	},
	//文本域替换回车
	replace : function(v){
		return v.replace(/(\r|\n)/g,'<br/>');
	},
	
	//转换时间戳 没有时分秒
	timeStamp:function(time){

		if(!time){
			return '';
		}
		
		function toDub(n){
		    return n<10?'0'+n:''+n;
		}
		
		var oDate=new Date();
							
		oDate.setTime(time);
		
		var sDate=oDate.getFullYear()+'-'+toDub((oDate.getMonth()+1))+'-'+toDub(oDate.getDate());
		return sDate;
	},
	//转换时间戳 有时分秒
	timeStampHours:function(time){
		
		if(!time){
			return '';
		}
			
		function toDub(n){
		    return n<10?'0'+n:''+n;
		}
		
		var oDate=new Date();
							
		oDate.setTime(time);
		
		var sDate=oDate.getFullYear()+'-'+toDub((oDate.getMonth()+1))+'-'+toDub(oDate.getDate())+' '+toDub(oDate.getHours())+':'+toDub(oDate.getMinutes())+':'+toDub(oDate.getSeconds());
		return sDate;
	},
	//转换时间戳 只有时分
	timeStampHoursMinute:function(time){
		
		if(!time){
			return '';
		}
			
		function toDub(n){
		    return n<10?'0'+n:''+n;
		}
		
		var oDate=new Date();
							
		oDate.setTime(time);
		
		var sDate=toDub(oDate.getHours())+':'+toDub(oDate.getMinutes());
		return sDate;
	},
	//转换时间戳 只有年和月
	timeStampYearMonth:function(time){
		
		if(!time){
			return '';
		}
			
		function toDub(n){
		    return n<10?'0'+n:''+n;
		}
		
		var oDate=new Date();
							
		oDate.setTime(time);
		
		var sDate=oDate.getFullYear()+'-'+toDub((oDate.getMonth()+1));
		return sDate;
	},
	/**
	     * 时间格式化 返回格式化的时间
	     * @param date {object}  可选参数，要格式化的data对象，没有则为当前时间
	     * @param fomat {string} 格式化字符串，例如：'YYYY年MM月DD日 hh时mm分ss秒 星期' 'YYYY/MM/DD week' (中文为星期，英文为week)
	     * @return {string} 返回格式化的字符串
	     * 
	     * 例子:
	     * formatDate(new Date("january 01,2012"));
	     * formatDate(new Date());
	     * formatDate('YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY-MM-DD week');
	     * formatDate(new Date("january 01,2012"),'YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY/MM/DD week');
	     * 
	     * 格式：   
	     *    YYYY：4位年,如1993
	　　 *　　YY：2位年,如93
	　　 *　　MM：月份
	　　 *　　DD：日期
	　　 *　　hh：小时
	　　 *　　mm：分钟
	　　 *　　ss：秒钟
	　　 *　　星期：星期，返回如 星期二
	　　 *　　周：返回如 周二
	　　 *　　week：英文星期全称，返回如 Saturday
	　　 *　　www：三位英文星期，返回如 Sat
	     */
		formatDate :function (date, format) {

			if(typeof date == 'string'){
				date = date.split(/-|:| /);
				date = new Date(date[0],date[1]-1,date[2],date[3] || '00',date[4] || '00',date[5] || '00');
			}
			
			function addZero(str,length){
		   	 return new Array(length-(''+str).length+1).join("0") + str;
			}

	        if (arguments.length < 2 && !date.getTime) {
	            format = date;
	            date = new Date();
	        }
	        typeof format != 'string' && (format = 'YYYY年MM月DD日 hh时mm分ss秒');
	        var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
	        return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function(a) {
	            switch (a) {
	            case "YYYY": return date.getFullYear();
	            case "YY": return (date.getFullYear()+"").slice(2);
	            case "MM": return addZero(date.getMonth() + 1,2);
	            case "DD": return addZero(date.getDate(),2);
	            case "hh": return addZero(date.getHours(),2);
	            case "mm": return addZero(date.getMinutes(),2);
	            case "ss": return addZero(date.getSeconds(),2);
	            case "星期": return "星期" + week[date.getDay() + 7];
	            case "周": return "周" +  week[date.getDay() + 7];
	            case "week": return week[date.getDay()];
	            case "www": return week[date.getDay()].slice(0,3);
	            }
	        });
	    },
	    //格式化时间
	    formatTime : function(time){
	    	var date = new Date;

	    	var year = date.getYear();

    		if(typeof time == 'string'){
				time = time.split(/-|:| /);
				time = new Date(time[0],time[1]-1,time[2],time[3],time[4],time[5]);
			}

	    	if(time.getYear() == year){
	    		return util.formatDate(time,'MM-DD hh:mm');
	    	}else{
	    		return util.formatDate(time,'YYYY-MM-DD hh:mm');	
	    	}
	    },
	     //格式化月份
	    formatMonth : function(time){
	    	var date = new Date;

	    	var year = date.getYear();

    		if(typeof time == 'string'){
				time = time.split(/-|:| /);
				time = new Date(time[0],time[1]-1,time[2],time[3],time[4],time[5]);
			}

	    	if(time.getYear() == year){
	    		if(time.getMonth() == date.getMonth()){
	    			return '本月';
	    		}
	    		return util.formatDate(time,'MM');
	    	}else{
	    		return util.formatDate(time,'YYYY-MM');	
	    	}
	    },
	// 删除数组元素
	array: {

		remove: function(arr, val) {

			var index = arr.indexOf(val);

			if (index > -1) {
				arr.splice(index, 1);
			}

		}

	},

	//验证字符串是否为空
	isEmpty: function(str) {
		return (typeof str == 'undefined' || str == null || (typeof str == 'string' && str.replace(/^\s|\s$/g, '') == '') || str == 'null');
	},

	//随机串
	nonceStr: function() {

		var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		var maxPos = $chars.length;

		var noceStr = "";
		for (i = 0; i < 32; i++) {
			noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
		}

		return noceStr;
	},

	//url 参数
	getUrlParams: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return r[2];
		return null;
	},
	//url 参数
	getLoadUrlParams: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = getCookie("loadUrlParam").match(reg);
		if (r != null)
			return r[2];
		return null;
	},
	//渲染模板 ; 依赖doT.js
	render: function(tmpl, data, container) {
		if (tmpl.indexOf('#') == 0) {
			tmpl = $(tmpl).html();
		}

		var doTtmpl = doT.template(tmpl);

		var html = doTtmpl(data);

		if (typeof container == 'string') {
			$(container).html(html);
		} else if (typeof container == 'object') {
			container.html(html);
		}

		return html;
	},
	//持久存储
	store: (function() {
		try {
			window.localStorage.setItem('_localStorage_support_', 1);
			return window.localStorage;
		} catch (e) {

			return {
				getItem: function(sKey) {
					if (!sKey || !this.hasOwnProperty(sKey)) {
						return null;
					}
					return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
				},
				key: function(nKeyId) {
					return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
				},
				setItem: function(sKey, sValue) {
					if (!sKey) {
						return;
					}
					document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/";
					this.length = document.cookie ? document.cookie.match(/\=/g).length : 0;
				},
				length: 0,
				removeItem: function(sKey) {
					if (!sKey || !this.hasOwnProperty(sKey)) {
						return;
					}
					document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
					this.length--;
				},
				hasOwnProperty: function(sKey) {
					return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
				}
			};
		}
	})(),

	sessionStore : (function(){
		try{
			window.sessionStorage.setItem('_sessionStorage_support_',1);
			return  window.sessionStorage;
		}catch(e){
			return {
			    getItem: function (sKey) {
			      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
			      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
			    },
			    key: function (nKeyId) {
			      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
			    },
			    setItem: function (sKey, sValue) {
			      if(!sKey) { return; }
			      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/";
			      this.length = document.cookie?document.cookie.match(/\=/g).length:0;
			    },
			    length: 0,
			    removeItem: function (sKey) {
			      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
			      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			      this.length--;
			    },
			    hasOwnProperty: function (sKey) {
			      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
			    }
			};
		}
	})(),

	
	/**
	 * 菜单数据转换成ztree数据格式
	 *  data menu数组 zData  ztree数据
	 */
	toZTreeData: function(data, zData) {

		zData = zData || [];

		for (var i = 0, len = data.length; i < len; i++) {
			var t = data[i];
			zData.push({
				id: t.id,
				pId: t.parentId,
				name: t.name,
				open:true
			});
			if (data[i].menus && data[i].menus.length > 0) {
				goola.util.toZTreeData(data[i].menus, zData);
			}
		}

		return zData;
	},
	toZTreeData2: function(data, zData) {
		zData = zData || [];

		for (var i = 0, len = data.length; i < len; i++) {
			var t = data[i];
			zData.push({
				id: t.id,
				pId: t.parentId,
				name: t.name,
				url: t.url,
				parentName : t.parentName
			});
			if (data[i].menus && data[i].menus.length > 0) {
				goola.util.toZTreeData2(data[i].menus, zData);
			}
		}

		return zData;

	},
	toZTreeData3: function(data, zData) {

		zData = zData || [];

		for (var i = 0, len = data.length; i < len; i++) {
			var t = data[i];
			zData.push({
				id: t.id,
				pId: t.parentId,
				name: t.name,
				url: t.url,
				open:true
			});
			if (data[i].menus && data[i].menus.length > 0) {
				goola.util.toZTreeData3(data[i].menus, zData);
			}
		}

		return zData;

	},
	//校验密码
	checkPwd: function(pwd) {
		if (/^[a-zA-Z]+$/g.test(pwd) || /^\d+$/g.test(pwd)) {
			return false;
		} else {
			return true;
		}
	},

	

	//	数组去重 
	quchong: function(qarr) {
		function findArr(arr, n) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id == n.id) {
					return true;
				}
			}
			return false;
		}
		var result = [];
		for (var i = 0; i < qarr.length; i++) {
			if (!findArr(result, qarr[i])) {
				result.push(qarr[i]);
			}
		}
		return result;
	},
	//数组去重  返回去重之后的数组
	arrayUpdate:function(arr){
		var newArr = [];
		for (var i = 0; i < arr.length; i++) {
			if(newArr.indexOf(arr[i])<0){
				newArr.push(arr[i]);
			}
		};
		return newArr;
	},


	/**
	* 倒计时 a  var st = new showTime(1,3);
	    //st.ele_id = 1;
	//st.time_distance = 10000;
	    st.setTimeShow();
	*/
	showTime : function (ele_id, time_distance,format) {
	    this.ele_id = ele_id;
	    if(typeof time_distance == 'string'){
	    	time_distance = goola.util.formatDate(time_distance,'YYYY/MM/DD hh:mm:ss');
	    	time_distance = new Date(time_distance) - new Date() ;
	    }
		this.time_distance = time_distance ;
		this.format = format;
	},
	alertMessage : function(content){
		$().toastmessage('showToast', {
            text     : content,
            sticky   : true,
            position : 'top-right',
            type     : 'error',
            closeText: '',
            close    : function () {
                console.log("toast is closed ...");
            }
        });
	}
	

});
goola.util.showTime.prototype.setTimeShow = function () {
    var timer = document.getElementById(this.ele_id);
    var str_time;
    var int_day, int_hour, int_minute, int_second;
    time_distance = this.time_distance;
    this.time_distance = this.time_distance - 1000;
    if (time_distance > 0) {
        int_day = Math.floor(time_distance / 86400000);
        time_distance -= int_day * 86400000;
        int_hour = Math.floor(time_distance / 3600000);
        time_distance -= int_hour * 3600000;
        int_minute = Math.floor(time_distance / 60000);
        time_distance -= int_minute * 60000;
        int_second = Math.floor(time_distance / 1000);
        if (int_hour < 10)
            int_hour = "0" + int_hour;
        if (int_minute < 10)
            int_minute = "0" + int_minute;
        if (int_second < 10)
            int_second = "0" + int_second;
        str_time = int_day + "天" + int_hour + "小时" + int_minute + "分" + int_second + "秒";

        if(typeof this.format == 'string'){
        	str_time =  this.format.replace(/D/g,int_day).replace(/H/g,int_hour).replace(/M/g,int_minute).replace(/S/g,int_second);
        }

        timer.innerHTML= str_time;
        var self = this;
        setTimeout(function () { self.setTimeShow(); }, 1000); //D:正确
    } else {
        timer.innerHTML= "已结束";
        return;
    }
} 


