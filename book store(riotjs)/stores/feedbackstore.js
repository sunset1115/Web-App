// FeedbackStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the submission of feedback
function FeedbackStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.

  self.on('feedback_add', function(message) {
    self.submitFeedback(message)            
  })

  // The store emits change events to any listening views, so that they may react and redraw themselves.
  self.submitFeedback = function(text){
    data = {message: text, context: window.location.pathname }

    mygravity.dispatcher.ajax('/feedback', data, function(){ }, function(){ })    
  }

}