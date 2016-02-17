// FeedbackStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the submission of Surveys
function SurveyStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.


  //       /v2/reward_scheme/:id/surveys
  //       /v2/reward_scheme/:id/survey/new
  //       /v2/reward_scheme/:id/survey/:id/
  //       /v2/reward_scheme/:id/survey/:id/(field1%20field2%20n..)
  //       /v2/reward_scheme/:id/survey/:id/new
  //       /v2/reward_scheme/:id/survey/:id/update
  //       /v2/reward_scheme/:id/survey/:id/patch/(:fields)
  //       /v2/reward_scheme/:id/survey/:id/patch/:field
  //       /v2/reward_scheme/:id/survey/:id/delete 

  self.on('get_surveys', function(){
    if (mygravity.local.count('surveys') == 0){
      self.getSurveys()
    }
  })

  self.on('nps_value_changed', function(value){
    var current = self.getCurrentNPS()
    current.reward_value = value

    self.save(current, 'current_nps', 'surveys') 
    self.patch_value(value, current.id)
    
    var next = self.getNextNPS()
    next.reward_value = value

    self.save(next, 'next_nps', 'surveys') 
    self.patch_value(value, next.id)
  })

  self.on('nps_question_changed', function(template_id){
//    console.log('caught')
    var next = self.getNextNPS()
    
    self.update_nps_question(template_id, next.questions[0].id, next.id)
  })

  self.on('refresh_surveys', function(){
    self.getSurveys()
  })

  self.update_nps_question = function(template_id, question_id, survey_id){
    // delete the question - step one
    mygravity.dispatcher.ajax('/survey/'+survey_id+'/question/'+question_id+'/delete', data, function(returnedData,obj){
      // connect the new question - step two (note the parameter is template_uid... do not be fooled, it needs the id rather than the uid)
      data = { template_uid: obj.template_id}
      mygravity.dispatcher.ajax('/survey/'+obj.id+'/question/new', data, function(){
        // step 3 refresh the data at home
        RiotControl.trigger('refresh_surveys')
      }, function(){})
    }, function(){}, clone({template_id:template_id, id:survey_id}))
  }

  self.patch_value = function(newValue, id){
    data = { reward_value: newValue }
    // fire & forget
    mygravity.dispatcher.ajax('/survey/'+id+'/patch/reward_value', data, function(){}, function(){})
  }

  // The store emits change events to any listening views, so that they may react and redraw themselves.
  self.getSurveys = function(){
    data = { }

    mygravity.dispatcher.ajax('/surveys', data, function(returnedData){ 
      returnedData.forEach(function(survey){
        match = false
        if ((new Date(survey.ends_on)) > (new Date())){
          if ((new Date(survey.starts_on)) > (new Date())){
            // Next Survey
            match = true
            survey.survey_type = 'next_' + survey.survey_type
          } else {
            // Current  Survey 
            match = true
            if ((survey.starts_on === null)||(survey.starts_on === undefined)){            
              survey.survey_type = 'disabled_' + survey.survey_type
            } else {
             survey.survey_type = 'current_' + survey.survey_type
           }
          }
        } else {
          if ((new Date(survey.starts_on)) > (new Date())){
            match = true
            survey.survey_type = 'future_' + survey.survey_type
          }
          if ((survey.starts_on === null)||(survey.starts_on === undefined)){
            match = true
            survey.survey_type = 'disabled_' + survey.survey_type
          }
        }
        if (match){
          // console.log(survey)
          mygravity.dispatcher.ajax('/survey/'+survey.id+'/questions', data, function(questionData, obj){ 
            questions = []
            if ((obj.survey_type == 'next_nps')||(obj.survey_type == 'current_nps')){            
              questions.push(questionData[0])              
            } else {
              questions.push(questionData)
            }
            obj.questions = questions
            self.save(obj, obj.survey_type, 'surveys')            

          }, function(){}, clone({s:survey}).s)
        }
      })
    }, function(){ })    

    mygravity.dispatcher.ajax('/survey_templates', data, function(returnedData){
      returnedData.forEach(function(template){
        if (template.survey_type == 'NPS'){
          template.survey_type = 'nps'
        } else {
          template.survey_type = 'customer satisfaction'
        }
        mygravity.dispatcher.ajax('/survey_template/'+template.id+'/questions', data, function(questionData, obj){             
            obj.questions = questionData
            self.save(obj, obj.survey_type, 'templates')                        
          }, function(){}, clone({s:template}).s)
      })

    }, function(){})   
  }

  self.getCurrentNPS = function(){
    return mygravity.local.get('current_nps', 'surveys')
  }

  self.getNextNPS = function(){
    return mygravity.local.get('next_nps', 'surveys')
  }

  self.getCurrentCS = function(){
    return mygravity.local.get('current_cs', 'surveys')
  }

  self.getNextCS = function(){
    return mygravity.local.get('next_cs', 'surveys')
  }

  self.getNPSTemplate = function(){
    return mygravity.local.get('nps', 'templates')
  }

  // make it easy to set a timeout for survey data
  self.save = function(data, hash, area){  
    // console.log(hash)  
    if (mygravity.local.get(hash, area)){
      mygravity.local.update(data, hash, 'default', area)
    } else {
      mygravity.local.add(data, hash, 'default', area)    
    }
  }

}