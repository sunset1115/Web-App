// FeedbackStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the submission of feedback
function SchemeStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.
  self.run_scheme_once = true  

  self.on('get_scheme', function(){
    self.downloadScheme()
  })

  self.downloadScheme = function(){
     if((self.run_scheme_once)&&(self.getScheme() == undefined)){
      self.run_scheme_once = false

      data = {}

      mygravity.dispatcher.ajax('/config', data, function(returnedData){ 
        self.save(returnedData, 'scheme', 'scheme')  
      }, function(){ })   
    }
  }

  self.getScheme = function(){
    return mygravity.local.get('scheme', 'scheme')
  }

  // make it easy to set a timeout for scheme data
  self.save = function(data, hash, area){  
    // console.log(hash)  
    if (mygravity.local.get(hash, area)){
      mygravity.local.update(data, hash, 'default', area)
    } else {
      mygravity.local.add(data, hash, 'default', area)    
    }
  }

}