// This is a helper functions to store things into the sessionStorage

var mygravity = (function (self){
	self.local = (function () {
		var self = {};

		var default_expires_in = {interval:'hour', units:300} 

		// add data into the session storage. 
		// data 			=> javascript object of the data to store
		// hash 			=> string to find it, use sha1 for speed
		// expires_in 		=> javascript object with keys interval & unit
		// area 			=> string of sessionStorage area to save it in
		// index_to_scrub 	=> integer of index position to update within the cache
		self.add = function(data, hash, expires_in, area){
			// cache is stored as an array		
			var cache = JSON.parse(sessionStorage.getItem(area)) || new Array();

			if (expires_in == 'default'){ expires_in = default_expires_in }

			var to_store = {
				'data': data,
				'sign': hash,
				'expiry': dateAdd(expires_in.interval, expires_in.units)
			}

			cache.push(to_store);
			sessionStorage.setItem(area, JSON.stringify(cache));
		};

		// updates an existing record with a new one
		self.update = function(data, hash, expires_in, area){
			self.remove(hash, area);			
			self.add(data, hash, expires_in, area)
		}

		// finds data within an area based on its hash
		// area => string of sessionStorage area
		// hash => string to find it by
		self.get = function(hash, area){
			removeExpired();

			var cache = JSON.parse(sessionStorage.getItem(area)) || new Array();			
			var cache_found;
			
			mygravity.utils.forEach(cache, function(i, item){
			// console.log('Hash in cache:' + cache[i]['sign']);
							
				if(hash == item["sign"]){
					cache_found = item['data'];
					// console.log('localstorage match found: '+ hash, 'debug');
					return true //we found it
				}				
			});
					
			return cache_found;
		};

		var removeExpired = function(area){
			var cache = JSON.parse(sessionStorage.getItem(area)) || new Array();

			var expired = new Array();

			mygravity.utils.forEach(cache, function(i, item){
				if(new Date(item["expiry"]) < new Date())
				{	
					expired.push(i);					
				}
			});

			expired.reverse().forEach(function(i){ cache.splice(i, 1); });
			if(expired.length > 0){ sessionStorage.setItem(area, JSON.stringify(cache)); }
		}

		self.remove = function(hash, area){
			removeExpired();

			var cache = JSON.parse(sessionStorage.getItem(area)) || new Array();			
			
			mygravity.utils.forEach(cache, function(i, item){
				if(hash == item["sign"]){					
					// console.log(i)
					cache.splice(i,1);
					sessionStorage.setItem(area, JSON.stringify(cache));
					// console.log('localstorage match found: '+ hash, 'debug');
					return true //we found it
				}								
			});				
		};

		self.count = function(area){
			cache = JSON.parse(sessionStorage.getItem(area)) || new Array();			
			return cache.length;
		};

		self.clear = function(area){
			sessionStorage.setItem(area, JSON.stringify(new Array()))
		}

		self.clearAll = function(){
			sessionStorage.clear()
		}

		self.collection = function(area){
			return JSON.parse(sessionStorage.getItem(area)) || new Array();			
		};

		// creates a sha1 hash and returns it
		// text => string to convert into a hash
		self.create_hash = function(text){						
			return mygravity.crypto_hash.sha1(text, 'HEX');
		};

		var dateAdd = function(interval, units) {
		  var ret = new Date(); //don't change original date
		  switch(interval.toLowerCase()) {
		    case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
		    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
		    case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
		    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
		    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
		    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
		    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
		    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
		    default       :  ret = undefined;  break;
		  }
		  return ret;
		};

		return self;
	}());
	
	return self;
}(mygravity || {}));	
