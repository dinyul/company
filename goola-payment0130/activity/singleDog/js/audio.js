	(function(api, util, ajax){
		  
	    var vList = new Array("imgs/1.mp3","imgs/2.mp3","imgs/3.mp3","imgs/4.mp3"); // 初始化播放列表  
	    var vLen = vList.length;  
	    var curr = 0;  
	    var video = document.getElementById("myvideo");  
	    play();
	    video.addEventListener("ended", function(){  
			play();  
		});  
	    function play() {  
	        video.src = vList[curr];  
	        video.load();  
	        video.play();  
	        document.addEventListener("WeixinJSBridgeReady", function () {
        		video.play();
    		}, false);
	        curr++;  
	        if(curr >= vLen){  
	            curr = 0; //重新循环播放  
	        }  
	  
	    }  
	})(goola.api, goola.util, goola.ajax)