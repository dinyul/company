goola.extend(goola.ajax || (goola.ajax = {}),{
	
	/**
	* 超时时间
	*/
	timeout : 20000,

	/**
	* XMLHttpRequest
	*/
	xhr : (function(){

		if(window.XMLHttpRequest){

			return function(){
				return new XMLHttpRequest() ;
			}

	    } else if(window.ActiveXobject) {

	    	return function(){
	    		try{
	    			return new ActiveXObject("Microsoft.XMLHTTP");
	    		}catch(e){}
			}

	    }

	})(),
	 

	ajax : function(method , url ,param , success ,error){

		window.top.$('body').append('<div class="loading" id="loading"></div>');

		var xhr = this.xhr();

		xhr.onreadystatechange =  function(){

			if(xhr.readyState == 4){
				
				window.top.$('#loading').remove();

			 	if (xhr.status==200){

			 		success(xhr.responseText);

			 	}else{

			    	error(xhr.status,xhr.responseText);

			    }

			}
		}

		//处理参数
		var a = [] ;

		if(typeof param == 'object'){
			var i = 0
			for(var key in param){
				if (param[key] != null && param[key] != 'undefined') {
					a[i] = key + '=' + encodeURI(param[key]);
					i++;
				}
			}
		}
		
		param = a.join('&') ;

		var nowTime = new Date().getTime();//获取当前时间作为随机数

		if( a.length > 0 && method == "get"){
			if(url.indexOf('?') == -1){
				url = url+'?'+param;	
			}else{
				url = url+'&'+param;
			}

		}	

		if(url.indexOf('?') == -1){
			url = url+'?time='+nowTime;
		}else{
			url = url+'&time='+nowTime;
		}
		
		xhr.open(method,url,true);

		xhr.timeout = this.timeout;
		if(method == 'get'){
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		}else if(method == 'post'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
	 

		if(method == "post"){  
            xhr.send(param);  
        }else{  
            xhr.send(null);  
        }  

	},

	get : function(url,param,successCallback,errorCallback){

		if(typeof param == 'function'){

			errorCallback = successCallback;

			successCallback = param;

			param= {};
		}

		if(!param){
			param= {};
		}

		this.ajax('get',url,param,function(data){

			data = JSON.parse(data);

			var code = data.code ;

			if(code == 0){

				successCallback(data.data);

			}else if(code == 100){
				window.location.href='/login/denglu.html';
			}else if(code == 101){
				window.location.href=data.data;
			}else if(code == 300){
				window.location.href='/location/location.html';
			}else {
				
				if(typeof errorCallback == 'function'){
					errorCallback(data);
				}else{
					alert(data.message);
				}

			}


		},function(code,data){
			if(code == 0){
				return ;
			}
			if(code == 400){
				try{
					goola.util.alertMessage("参数错误,错误码400");
				}catch(e){
					alert("参数错误,错误码400");
				}
				
			}else if(code == 502){
				try{
					goola.util.alertMessage("后台服务无响应,错误码502");
				}catch(e){
					alert("后台服务无响应,错误码502");
				}
			}else if(code == 404){
				if(window.location.pathname.indexOf('purchase')>=0){
					window.location.href="/mobilerack/purchase/login.html"
				}else{
					try{
						goola.util.alertMessage("找不到后台服务,错误码404");
					}catch(e){
						alert("找不到后台服务,错误码404");
					}
				}
			}else if(code == 500){
				try{
					goola.util.alertMessage("后台服务错误,错误码500");
				}catch(e){
					alert("后台服务错误,错误码500");
				}
			}else if(code == 503){
				try{
					goola.util.alertMessage("后台服务错误,错误码503");
				}catch(e){
					alert("后台服务错误,错误码503");
				}
			}else{
				try{
					goola.util.alertMessage("请求失败!");
				}catch(e){
					alert("请求失败!");
				}
			}



		});
		
	},

	post : function(url,param,successCallback,errorCallback){
		
		if(typeof param == 'function'){

			errorCallback = successCallback;

			successCallback = param;

			param= {};
		}
		if(!param){
			param= {};
		}

		this.ajax('post',url,param,function(data){

			data = JSON.parse(data);

			var code = data.code ;

			if(code == 0){

				successCallback(data.data);

			}else if(code == 100){
				window.location.href='/login/denglu.html';
			}else if(code == 101){
				window.location.href=data.data;
			}else if(code == 300){
				window.location.href='/location/location.html';
			}else {
				if(typeof errorCallback == 'function'){
					errorCallback(data);
				}else{
					alert(data.message);
				}

			}

		},function(code,data){
			if(code == 0){
				return ;
			}
			if(code == 400){
				try{
					goola.util.alertMessage("参数错误,错误码400");
				}catch(e){
					alert("参数错误,错误码400");
				}
				
			}else if(code == 502){
				try{
					goola.util.alertMessage("后台服务无响应,错误码502");
				}catch(e){
					alert("后台服务无响应,错误码502");
				}
			}else if(code == 404){
				if(window.location.pathname.indexOf('purchase')>=0){
					window.location.href="/mobilerack/purchase/login.html"
				}else{
					try{
						goola.util.alertMessage("找不到后台服务,错误码404");
					}catch(e){
						alert("找不到后台服务,错误码404");
					}
				}
				
			}else if(code == 500){
				try{
					goola.util.alertMessage("后台服务错误,错误码500");
				}catch(e){
					alert("后台服务错误,错误码500");
				}
			}else if(code == 503){
				try{
					goola.util.alertMessage("后台服务错误,错误码503");
				}catch(e){
					alert("后台服务错误,错误码503");
				}
			}else{
				try{
					goola.util.alertMessage("请求失败!");
				}catch(e){
					alert("请求失败!");
				}
			}

		

		});
	}

});