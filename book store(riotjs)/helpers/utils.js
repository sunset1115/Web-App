// This is a helper functions to make life easier and ensure we are using efficient methods

var mygravity = (function (self){
	self.utils = (function () {
		var self = {};

		// forEach method - best way to do it in plain js, plus it returns index
		// this works on arrays & nodelists
		self.forEach = function(array, callback, scope){			
			for (var i = 0; i < array.length; i++){
				result = callback.call(scope, i, array[i]); //passes back the stuff we need

				// return true to break out of the forEach
				if (result == true){
					break;
				}
			}			
		};


		return self;
	}());
	
	return self;
}(mygravity || {}));	