// FeedbackStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the collection of dashboard updating
function DashboardStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.

  self.on('dashboard_get_stores', function() {
    // console.log(mygravity.local.count('stores'))
    if (mygravity.local.count('stores') == 0){
      mygravity.local.add('all', 'All Stores', 'default', 'stores')
      mygravity.dispatcher.ajax('/stores', {}, function(returnedData){ 
        // console.log(returnedData)
        RiotControl.trigger('dashboard_save_stores', returnedData.stores) 
        RiotControl.trigger('dashboard_update_stores', self.getStoreList())
      }, function(){ })                          
    } else {
      // console.log('full stores')
      RiotControl.trigger('dashboard_update_stores', self.getStoreList())
    }
  })

  // set the default to all stores and add it to the sessionStorage if it doesn't exist
  var current_store = mygravity.local.get('current_store', 'user')
  if (current_store === undefined){
//    console.log(current_store)
    mygravity.local.add('All Stores', 'current_store', 'default', 'user')    
  }

  self.on('dashboard_save_stores', function(stores){
    // console.log(stores)
    stores.forEach(function(store){ 
      // console.log(store)
      mygravity.local.add(store.store_uid, store.name, 'default', 'stores')  
    })
  })

  self.getCurrentStoreName = function(){    
    return mygravity.local.get('current_store', 'user')
  }

  self.getCurrentStore = function(){    
    return mygravity.local.get(current_store, 'stores')
  }

  self.on('dashboard_set_store', function(storeName){
    current_store = storeName
    mygravity.local.update(storeName, 'current_store', 'default', 'user')
    // console.log('updating store name:' + storeName)
    RiotControl.trigger('report_store_changed')
  })

  self.getStoreList = function(){
    return mygravity.local.collection('stores').map(function(store){
      // console.log(store)
       return {name: store.sign}
    })
  }
  // The store emits change events to any listening views, so that they may react and redraw themselves.
 
}