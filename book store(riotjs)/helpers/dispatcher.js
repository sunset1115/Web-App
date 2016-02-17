// This is a helper functions to store things into the sessionStorage

var mygravity = (function (self){
	self.dispatcher = (function () {
		var self = {};

		var base_url = function(){
			return 'https://rewards-stage.api.mygravity.co/v2/reward_scheme/' + authStore.getScheme(); 
		}

		var set_timeout = function(){
			window.setTimeout(function(){ console.log('Ajax request did not respond in a timely manner', 'error') }, 5 * 1000)
		};

		var pkg = function(data){
			pData = { 
					package: {
					    data: { claim: authStore.getClaim() },
				    	checksum: {}
		    		}
		    	}
		    for (var key in data) { pData.package.data[key] = data[key]}
			
		    return JSON.stringify(pData);
		}

		self.ajax = function(url, data, complete, fallback, obj){
		  // var timeout_trigger = set_timeout();
		  var request = new XMLHttpRequest();		
// console.log('run')
		  
		  request.open('post', base_url() + url, true);
		  request.setRequestHeader('Content-Type', 'application/json');
		  request.setRequestHeader('session', 'rewards_'+ Math.floor(Math.random()*10000));

		  request.onreadystatechange = function() {
		    if (this.readyState === 4) {
		      if (this.status >= 200 && this.status < 400) {
		        // Success!
		        // window.clearTimeout(timeout_trigger);
		      if(complete){
		      	response = JSON.parse(this.responseText)
		        complete(response.package.data, obj);
		      }
		      } else {
		      		// window.clearTimeout(timeout_trigger)
			      console.log('failed')
			      
			      obj = JSON.parse(this.responseText)

		      	if (!(obj.error === undefined)){
		      		console.log('failed')
		      		var error = obj.error;
		      		if (!(error.server_code === undefined)){
		      			console.log('failed')
		      			if (error.server_code == 'EX21'){
		      				console.log('failed')
		      				mygravity.local.clear();		      				
		      				window.location = '/my360/logout'
		      			}
		      		}
		      	}
		        fallback();
		      }
		    }
		  }
		
		request.send(pkg(data));
		request = null;
		};

		return self;
	}());
	
	return self;
}(mygravity || {}));	