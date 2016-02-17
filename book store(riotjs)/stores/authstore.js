// FeedbackStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the authorisation of the user
function AuthStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.

  // The store emits change events to any listening views, so that they may react and redraw themselves.

  self.on('auth_refused', function() {
    // the user has been identified as no longer valid, log them out
    window.location.href = '/my360/logout'    
  })

  function getCookie(cname) {
    cookie = Cookies.get(cname)
    if (cookie === undefined) {
      self.trigger('auth_refused')  
    }
    return cookie
  } 

  // console.log(getCookie('sso'))

  sso = JSON.parse(getCookie('sso'))


  // functions to extract info from the cookie. 
  // NB: each of these functions will read the cookie, this is important as the cookie will disappear once expired, and the JS needs to then trigger an auth refused event

  // get the user from the cookie
  self.user = function(){
    try{
      return JSON.parse(getCookie('sso')).user
    } catch(e){}
  }

  // get the claims
  self.claims = function(){
   try{
      return JSON.parse(getCookie('sso')).claims
    } catch(e){} 
  }
 
 // get the rewardscheme list
  self.rewardSchemes = function(){
    return self.claims().map(function(c){
      resource = {}
      
      if (c.claim.resource_name !== undefined){      
        resource.resource_name = c.claim.resource_name
      }

      if (c.claim.resource_id !== undefined){      
        resource.resource_id = c.claim.resource_id
      }

      if (Object.keys(resource).length > 0) {
        return resource
      }
    })
  }

  // set the scheme to the local storage
  var scheme = mygravity.local.get('current_scheme', 'user')

  // returns the current scheme as set
  self.getScheme = function(){
    return mygravity.local.get('current_scheme', 'user')
  }

  // returns the current claim as set by the scheme
  self.getClaim = function(){
    id = self.getScheme()    
    
    claim = self.claims().map(function(c){
      if (c.claim.resource_id == id){
        return c.claim
      }  
    })

    return claim
  }
 
  // store the scheme that had been selected
  self.setScheme = function(resource_id){
    mygravity.local.add(resource_id, 'current_scheme', {interval:'hour', units:300}, 'user')
  }

  // if the scheme has not been set yet, select the first one in the list
  if (scheme === undefined){
    self.setScheme(self.rewardSchemes()[0].resource_id)    
  }
}

// ********* Example of sso cookie *******
// {
//   "user":
//   {
//     "email":"alexander.browne@mygravity.co",
//     "first_name":"Alexander",
//     "last_name":"Browne"
//   },
//   "claims":[
//   {
//     "claim":
//     {
//       "resource_id":"55129acd7265771c89000000",
//       "token":"af06f4215cd1-9b57f451cae4-b0a9a22580b1-66ede25d8911-a715cfafc6c6-d763e10d8cdf",
//       "subscription_level":"reward",
//       "verification":"933288",
//       "signature":"xinon-tizum-disyg-fumyn-ryvup-sygip-zanef-nilik-tivyd-mofyk-savis-vozyz-sefyn-tatos-kecep-nynod-nexux",
//       "permissions":"admin"
//     }
//   }]
// }