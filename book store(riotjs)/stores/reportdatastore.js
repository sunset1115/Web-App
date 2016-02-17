// ReportDataStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// This store deals with the submission of feedback
function ReportDataStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this

  self.charts = []

// Visits
  self.visits_30 = {      
      headline:  0,
      headlineUnits: 'visits',
      stats: [
        {value:0, units:'Last Period'}, 
        {value:'-%', units:'Change', negative:true, positive:false},
        {value:0, units:'On Average Per Day'}
      ]
    } 

  self.visits_60 = {    
    headline:  0,
    headlineUnits: 'visits',
    stats: [
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.visits_90 = {    
    headline:  0,
    headlineUnits: 'visits',
    stats: [
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.visits = self.visits_30

  // members
  self.members_30 = {      
      headline:  0,
      headlineUnits: 'visits per member',
      stats: [
        {value:0, units:'Last Period'}, 
        {value:'-%', units:'Change', negative:true, positive:false},
        {value:0, units:'On Average Per Day'}
      ]
    } 

  self.members_60 = {    
    headline:  0,
    headlineUnits: 'visits per member',
    stats: [
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.members_90 = {    
    headline:  0,
    headlineUnits: 'visits per member',
    stats: [
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.members = self.members_30  

  // the current range selected
  self.range = 30

  // memberDetails
  self.memberDetails_30 = {      
      headline:  0,
      headlineUnits: 'New Members',
      stats: [
        {value:0, units:'Total Members'}, 
        {value:0, units:'Last Period'}, 
        {value:'-%', units:'Change', negative:true, positive:false},
        {value:0, units:'On Average Per Day'}
      ]
    } 

  self.memberDetails_60 = {    
    headline:  0,
    headlineUnits: 'New Members',
    stats: [
      {value:0, units:'Total Members'},
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.memberDetails_90 = {    
    headline:  0,
    headlineUnits: 'New Members',
    stats: [
      {value:0, units:'Total Members'},
      {value:0, units:'Last Period'}, 
      {value:'-%', units:'Change', negative:true, positive:false},
      {value:0, units:'On Average Per Day'}
    ]
  } 

  self.memberDetails = self.memberDetails_30  



  self.on('reports_change_range', function(range){    
    switch(range){
      case 30:
        self.range = 30
        self.charts.forEach(function(chart){
          chart.series[0].update({name:chart.dataSet[0].last_30.name})
          chart.series[1].update({name:chart.dataSet[1].last_30.name})
          chart.series[0].setData(chart.dataSet[0].last_30.data)
          chart.series[1].setData(chart.dataSet[1].last_30.data)
        })
        self.visits = self.visits_30
        self.members = self.members_30
        self.memberDetails = self.memberDetails_30
        break
      case 60:
        self.range = 60
        self.charts.forEach(function(chart){
          chart.series[0].update(chart.dataSet[0].last_60)
          chart.series[1].update(chart.dataSet[1].last_60)
        })
        self.visits = self.visits_60
        self.members = self.members_60
        self.memberDetails = self.memberDetails_60
        break
      case 90:
        self.range = 90
        self.charts.forEach(function(chart){
          chart.series[0].update(chart.dataSet[0].last_90)
          chart.series[1].update(chart.dataSet[1].last_90)
        })
        self.visits = self.visits_90
        self.members = self.members_90
        self.memberDetails = self.memberDetails_90
        break
    }
    
    self.stats.forEach(function(stat){ 
      // console.log(stat)
      if (!(stat.opts.visits === undefined)){
        stat.opts.visits = self.visits
        stat.opts.members = self.members        
      }
      if (!(stat.opts.memberDetails === undefined)){
        stat.opts.memberDetails = self.memberDetails
      }
      // console.log(stat.optsvisits)
      stat.update() })
  })

  self.on('report_store_changed', function(){
//    console.log('store changed')
    self.stats_run = true

    // queueStats = function(){
    //   self.calculate_visits()
    //   self.stats.forEach(function(stat){ 
    //     if (!(stat.opts.visits === undefined)){
    //       stat.opts.visits = self.visits
    //       stat.opts.members = self.members
    //     }
    //     stat.update() 
    //   })   
    // }

    // Queue up the refresh of the stats after the data has been downloaded
    // waiting_commands.push(queueStats)

    RiotControl.trigger('app_open')
    
    charts_to_reload.forEach(function(chartInfo){
      chartInfo.chart.initialDataLoad = undefined
      RiotControl.trigger('load_report_data', chartInfo, true)
    })

    RiotControl.trigger('get_popularity_list')
  })

  self.on('initial_load_chart', function(newData){ 
    chart = newData.chart 
    // console.log(chart.initialDataLoad)

    if (chart.initialDataLoad === undefined){
      // console.log('hello')

      chart.initialDataLoad = true
      chart = newData.chart
      
      chart.dataSet = []

      newData.series.forEach(function(series, index){
        name = chart.series[index].name
        length = name.length
        
        chart.dataSet.push(self.renderSeries(series.data, name.substr(0, name.indexOf('(')), chart.cumulative))           
        // console.log(self.dataSet[index].last_30)
        switch(self.range){
          case 30:
            dataSet = chart.dataSet[index].last_30
            break
          case 60:
            dataSet = chart.dataSet[index].last_60
            break
          case 90:
            dataSet = chart.dataSet[index].last_90
            break
        }
        chart.series[index].update(dataSet)
      })      

      self.calculate_visits()
      self.stats.forEach(function(stat){ 
        if (!(stat.opts.visits === undefined)){
          stat.opts.visits = self.visits
          stat.opts.members = self.members
        }
        stat.update() })      
    }
  })   

  self.on('initial_popularity_chart', function(newData){
    chart = newData.chart 
//    console.log(chart.initialDataLoad)

    if (chart.initialDataLoad === undefined){
      // console.log('hello')

      chart.initialDataLoad = true
      chart = newData.chart
  //    console.log(newData.series)
      chart.series[0].update({name:'Quantity', data:newData.series})
   //   console.log('happy?')
    }
  })

  self.stats_run = true

  self.calculate_visits = function(){
    
    if (self.stats_run){
    
      self.stats_run = false
      store_uid = dashboardStore.getCurrentStore() || 'all'

      array = []
  
      app = mygravity.local.get('app', 'data_usage ' + store_uid)
  
      now = (new Date()).setHours(0,0,0,0)
      date = new Date(now).getDate()
      ago_180 = (new Date(now)).setDate(date - 181) 
      ago_120 = (new Date(now)).setDate(date - 121) 
      ago_90 = (new Date(now)).setDate(date - 91) 
      ago_60 = (new Date(now)).setDate(date - 61)
      ago_30 = (new Date(now)).setDate(date - 31)    

      points_180 = []      

      app.forEach(function(point){
        // 30 days first
        if(point[0] > ago_180){
          points_180.push(point)
        }
      })

      // hook up the pointers from the lookup table to the series range
      var lookup = {};
      for (var i = 0, len = points_180.length; i < len; i++) {
         lookup[points_180[i][0]] = points_180[i];
      }

      card = mygravity.local.get('card', 'data_usage ' + store_uid)
      card.forEach(function(point){        
        if(point[0] > ago_180){
          if (lookup[point[0]]){
            lookup[point[0]][1] += point[1]
          } else {
            points_180.push(point)
          }
        }
      })

      var points_30 = self.limitAtDate(points_180, ago_30)
      var points_60 = self.limitAtDate(points_180, ago_60)
      var points_90 = self.limitAtDate(points_180, ago_90)
      var points_120 = self.limitAtDate(points_180, ago_120)

      var t30 = self.countTotal(points_30) 
      var t60 = self.countTotal(points_60) 
      var t90 = self.countTotal(points_90) 
      var t120 = self.countTotal(points_120) 
      var t180 = self.countTotal(points_180) 

      // visits
      self.setVisits(t30, t60-t30, 30, self.visits_30)
      self.setVisits(t60, t120-t60, 60, self.visits_60)
      self.setVisits(t90, t180-t90, 90, self.visits_90)      

      // members
      m30 = mygravity.local.get(30, 'data_active_members ' + store_uid)
      m60 = mygravity.local.get(60, 'data_active_members ' + store_uid)
      m90 = mygravity.local.get(90, 'data_active_members ' + store_uid)
      m30b = mygravity.local.get('30b', 'data_active_members ' + store_uid)
      m60b = mygravity.local.get('60b', 'data_active_members ' + store_uid)
      m90b = mygravity.local.get('90b', 'data_active_members ' + store_uid)

      self.setVisits((t30/m30).toFixed(1), ((t60-t30)/m30b).toFixed(1), 30, self.members_30)
      self.setVisits((t60/m60).toFixed(1), ((t120-t60)/m60b).toFixed(1), 60, self.members_60)
      self.setVisits((t90/m90).toFixed(1), ((t180-t90)/m90b).toFixed(1), 90, self.members_90)

      // member details
      var card_members = mygravity.local.get('card_members', 'data_usage ' + store_uid)
      var app_members = mygravity.local.get('app_members', 'data_usage ' + store_uid)

      // hook up the pointers from the lookup table to the series range
      var cm_lookup = {};
      for (var i = 0, len = card_members.length; i < len; i++) {
         cm_lookup[card_members[i][0]] = card_members[i];
      }

      var am_lookup = {};
      for (var i = 0, len = app_members.length; i < len; i++) {
         am_lookup[app_members[i][0]] = app_members[i];
      }

      getTotal = function(date){

        var i = 0

        do {
          dateSearch = date - (86400000 * i)
          apm = cm_lookup[dateSearch]
          cdm = am_lookup[dateSearch]
          i += 1
        }        
        while ((apm === undefined)&&(cdm === undefined)&&(i < 90))
        
        returnObj = 0
        if (!(apm === undefined)){
          returnObj+=apm[1]
        }
        if (!(cdm === undefined)){
          returnObj+=cdm[1]
        }
        return returnObj       
      }
      // console.log(getTotal(now))
      // console.log(getTotal(ago_60))
      // console.log(getTotal(ago_120))
      // console.log(self.memberDetails_60)
      self.setMemberDetails(getTotal(now), getTotal(ago_30), getTotal(ago_60), 30, self.memberDetails_30)
      self.setMemberDetails(getTotal(now), getTotal(ago_60), getTotal(ago_120), 60, self.memberDetails_60)
      self.setMemberDetails(getTotal(now), getTotal(ago_90), getTotal(ago_180), 90, self.memberDetails_90)
      
    }
  }

  self.setMemberDetails = function(total, beginningOfPeriod, beginningOfLastPeriod, count, mDetails){ 
      
      // console.log(mDetails)
      thisMPeriod = total - beginningOfPeriod
      lastMPeriod = beginningOfPeriod - beginningOfLastPeriod

      if(thisMPeriod > 0){
        headline = '+' + thisMPeriod
      } else {
        headline = thisMPeriod
      }

      if(lastMPeriod > 0){
        headlineLast = '+' + lastMPeriod
      }  else {
        headlineLast = lastMPeriod
      }

      mDetails.headline = headline
      mDetails.stats[0].value = total
      mDetails.stats[1].value = headlineLast

      if (lastMPeriod > thisMPeriod){
        // negative
        mDetails.stats[2].negative = true
        mDetails.stats[2].positive = false
        mDetails.stats[2].value = 100-((thisMPeriod / lastMPeriod)*100).toFixed(0) + '%'
        mDetails.stats[2].units = 'decrease'
      } else {
        mDetails.stats[2].negative = false
        mDetails.stats[2].positive = true
        mDetails.stats[2].value = ((thisMPeriod / lastMPeriod)*100).toFixed(0)-100 + '%'
        mDetails.stats[2].units = 'increase'
      }
      mDetails.stats[3].value = (thisMPeriod / count).toFixed(2)
  }

  self.setVisits = function(thisPeriod, lastPeriod, count, visits){ 
      visits.headline = thisPeriod
      visits.stats[0].value = lastPeriod

      if (Number(lastPeriod) > Number(thisPeriod)){
        // negative
        visits.stats[1].negative = true
        visits.stats[1].positive = false
        visits.stats[1].value = 100-((thisPeriod / lastPeriod)*100).toFixed(0) + '%'
        visits.stats[1].units = 'decrease'
      } else {
        visits.stats[1].negative = false
        visits.stats[1].positive = true
        visits.stats[1].value = ((thisPeriod / lastPeriod)*100).toFixed(0)-100 + '%'
        visits.stats[1].units = 'increase'
      }
      visits.stats[2].value = (thisPeriod / count).toFixed(2)
  }

  self.countTotal = function(array){    
    var t = 0
    array.forEach(function(c){
      t+=c[1]

    })    
    return t
  } 

  self.limitAtDate = function(array, timestamp){
    var points = []
    array.forEach(function(point){
      // 30 days first
      if(point[0] > timestamp){          
        points.push(point)
      }
    })
    return points
  }

  self.stats = []

  self.registerStats = function(object){
    self.stats.push(object)  
  }

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.

  var charts_to_reload = []

  self.on('unmount_charts', function(){
    charts_to_reload = []
  })

  self.on('load_report_data', function(chartInfo, reload) {
    if (reload === undefined){
      charts_to_reload.push(chartInfo)
    }

//    console.log('Leaking?? charts to reload No.'+ charts_to_reload.length)
   
    // curried the chartInfo into there before we send it to the ajax
    // arrangeData = returnedObject.bind(undefined, chartInfo.chart)

    // console.log(arrangeData([{data:[1231,1254], name:'hello'}]))    
    var series
    uid = dashboardStore.getCurrentStore() || 'all'

    self.charts.push(chartInfo.chart)

    fn = function(series){
      // console.log('fire in the hole!')
      // console.log(series)
      RiotControl.trigger('initial_load_chart', { chart:chartInfo.chart, series: series } )
    }
    
    fn1 = function(series){      
      // console.log(series)
      RiotControl.trigger('initial_points_chart', { chart:chartInfo.chart, series: series } )
    }

     fn2 = function(series){      
      // console.log(series)
      RiotControl.trigger('initial_popularity_chart', { chart:chartInfo.chart, series: series } )
    }

    feed = function(test){
      if (chartInfo.feed.match(test) == null){
        return false
      }
      else{
        return true
      }
    }

    switch(true){
      case feed(/app_vs_card/g):      
        get_or_wait('app vs card', '90_day_'+uid, fn)
        break      
      case feed(/new_vs_returning/g):      
        get_or_wait('new vs returning', '90_day_'+uid, fn)
        break 
      case feed(/app_members_vs_card_members/g):      
        get_or_wait('app members vs card members', '90_day_'+uid, fn)
        break 
      case feed(/earned_vs_redeemed/g):            
        get_or_wait('earned vs redeemed', 'all_day_'+uid, fn1)
        break 
      case feed(/popularity/g):
        graphNeeded = chartInfo.feed.split('/')[2]
        get_or_wait(graphNeeded, 'data_popularity_'+uid, fn2)
        break
    }

  })

  var waiting_commands = []

  run_queue = function(){
//    console.log('emptying queue')
    waiting_commands.forEach(function(command, i){      
      waiting_commands.splice(i, 1)
      command()
    })    
  }

  var count = 0
  get_or_wait = function(hash, area, fn){
    count += 1
 //   console.log('waiting...')

    found = mygravity.local.get(hash, area) 
    
    if (found === undefined){                 

  //    console.log('queuing')
      waiting_commands.push(function(){
  //      console.log('trying again..')           
        get_or_wait(hash, area, fn)
      })

    } else {
  //    console.log('found')
      fn(found)
    }

  }

  returnedObject = function(a, b){
    // console.log(a)
    // console.log(b)
    return {presend:a, postsend:b}
  }

  // The store emits change events to any listening views, so that they may react and redraw themselves.
  self.getData = function(title, callback, arrangedata){
    store_uid = dashboardStore.getCurrentStore() || 'all'

    // curry the store_uid into there before we send it to the ajax
    
    data = {title: title, store_id: store_uid }
//    console.log(data)
    mygravity.dispatcher.ajax('/report/chart-data', data, function(returnedData){ RiotControl.trigger(callback, arrangedata(returnedData)) }, function(){ })    
  }

  self.on('app_open', function(){
    store_uid = dashboardStore.getCurrentStore() || 'all'
    if (mygravity.local.count('data_usage ' + store_uid) == 0){      
      arrangedata = returnedObject.bind(undefined, store_uid)      
      self.getMembers(store_uid)
      self.getData('usage', 'report_save_usage', arrangedata) 
      self.getData('earned_and_redeemed', 'report_save_points', arrangedata) 
      self.getData('popularity', 'report_save_popularity', arrangedata)         
    } else {
  //    console.log('no')
    }
  })

  self.getMembers = function(store_uid){

    now = (new Date()).setHours(0,0,0,0)
    date = new Date(now).getDate()
    ago_30 = (new Date(now)).setDate(date - 30)         
    ago_60 = (new Date(now)).setDate(date - 60)         
    ago_90 = (new Date(now)).setDate(date - 90)         
    ago_120 = (new Date(now)).setDate(date - 120)   
    ago_180 = (new Date(now)).setDate(date - 180)   
    uids = [store_uid]
    
    if (store_uid == 'all'){
      uids = null
    }

    data1 = {start_date: new Date(ago_30), end_date: new Date(), reward_store_uids:uids}
    data2 = {start_date: new Date(ago_60), end_date: new Date(), reward_store_uids:uids}
    data3 = {start_date: new Date(ago_90), end_date: new Date(), reward_store_uids:uids}  
    data1b = {start_date: new Date(ago_60), end_date: new Date(ago_30), reward_store_uids:uids}
    data2b = {start_date: new Date(ago_120), end_date: new Date(ago_60), reward_store_uids:uids}
    data3b = {start_date: new Date(ago_180), end_date: new Date(ago_90), reward_store_uids:uids} 

    mygravity.dispatcher.ajax('/report/members/active_in_period', data1, function(returnedData){ self.save(returnedData.members_count, 30, 'data_active_members ' + store_uid) }, function(){ })     
    mygravity.dispatcher.ajax('/report/members/active_in_period', data2, function(returnedData){ self.save(returnedData.members_count, 60, 'data_active_members ' + store_uid) }, function(){ })     
    mygravity.dispatcher.ajax('/report/members/active_in_period', data3, function(returnedData){ self.save(returnedData.members_count, 90, 'data_active_members ' + store_uid) }, function(){ })     
    mygravity.dispatcher.ajax('/report/members/active_in_period', data1b, function(returnedData){ self.save(returnedData.members_count, '30b', 'data_active_members ' + store_uid) }, function(){ })     
    mygravity.dispatcher.ajax('/report/members/active_in_period', data2b, function(returnedData){ self.save(returnedData.members_count, '60b', 'data_active_members ' + store_uid) }, function(){ })     
    mygravity.dispatcher.ajax('/report/members/active_in_period', data3b, function(returnedData){ self.save(returnedData.members_count, '90b', 'data_active_members ' + store_uid) }, function(){ })     
  }

  // Usage report comes back with 9 objects within the series array
  // - new
  // - returning
  // - active
  // - visited
  // - not visited
  // - card
  // - app
  // - card members
  // - app members
  // the attributes use the presend/postsend structure of the returnedObject, presend is the store_uid
  self.on('report_save_usage', function(data){    
    // console.log(data.postsend.series)
    uid = data.presend
    data.postsend.series.forEach(function(series){      
      self.save(series.data, series.name, 'data_usage ' + uid)      
    })
    self.make_days('data_usage ' + uid, uid, ['card', 'app'], 'app vs card')
    self.make_days('data_usage ' + uid, uid, ['new', 'returning'], 'new vs returning')
    self.make_days('data_usage ' + uid, uid, ['card_members', 'app_members'], 'app members vs card members')

    run_queue()
  })

  self.on('report_save_points', function(data){
    uid = data.presend
    data.postsend.series.forEach(function(series){      
      // console.log({name:series.name, series:series.data})
      self.save(series.data, series.name, 'data_points ' + uid)      
    })    
    self.make_days('data_points ' + uid, uid, ['earnt_points', 'redeemed_points'], 'earned vs redeemed', true)
    // console.log('finished days')
    run_queue()
  })

  self.save = function(data, hash, area){  
    // console.log(hash)  
    if (mygravity.local.get(hash, area)){
      mygravity.local.update(data, hash, 'default', area)
    } else {
      mygravity.local.add(data, hash, 'default', area)    
    }
  } 

  self.make_days = function(area, uid, seriesNames, title, all){    
    data_1 = mygravity.local.get(seriesNames[0], area)
    data_2 = mygravity.local.get(seriesNames[1], area)

    now = (new Date()).setHours(0,0,0,0)
    date = new Date(now).getDate()
    max_date = (new Date(now)).setDate(date - (all === true ? 9000 : 90))         

    series_1 = self.make_series(seriesNames[0], data_1, max_date)
    series_2 = self.make_series(seriesNames[1], data_2, max_date)

    graph = [series_1, series_2]

    self.save(graph, title, (all === true ? 'all' : '90') + '_day_'+uid)
  }  

  self.make_series = function(name, data, max_date){

    data = self.remove_older_than(data, max_date)

    count = 0
    mygravity.utils.forEach(data, function(i, point){
      count += point[1]
    })

    return {data: data}
  }


  // this is pure, this will not manipulate the data object, thus will return a new data object
  self.remove_older_than = function(data, date){
    // clone creates a new object, therefore push data into an object to be cloned
    data = clone({d:data}).d
    // console.log(data)

    var expired = new Array()        

    data.forEach(function(item, i){ 
      if ((item[0] < date)||(item[1] == null)||(item[1] == 0))
      {         
        expired.push(i)         
      } 
    })

    expired.reverse().forEach(function(i){ data.splice(i, 1) })
    // console.log('as')
    return data
  }

    // returns series data with 30, 60, 90 angles 
    // name is the simple name within quatity
    // series_data expected to be 2 point array [x,y]

    self.renderSeries = function(series_data, seriesName, cumulative){

      now = (new Date()).setHours(0,0,0,0)
      date = new Date(now).getDate()
      ago_90 = (new Date(now)).setDate(date - 90) 

      // hook up the pointers from the lookup table to the series range
            
      points_90 = self.populate_missing_values(90, ago_90, cumulative, series_data)     

      named = function(data){
        var pointCount = 0

        if (cumulative===undefined){
          data.forEach(function(point){                   
            pointCount += point.y          
          })
        } else {
          pointCount = data[data.length-1].y
        }

        return seriesName + ' (' + pointCount + ')'
      }

      dataSlice = function(last){
        min = 90 - last
        s = points_90.slice(min,90)
        return s
      }

      return {
        last_30: {name: named(dataSlice(30)), data:dataSlice(30)},
        last_60: {name: named(dataSlice(60)), data:dataSlice(60)},
        last_90: {name: named(dataSlice(90)), data:dataSlice(90)},
      }
    }   
  
    self.points_lookup = function(points_array){
      var l = {};
      
      mygravity.utils.forEach(points_array, function(i, point){
        l[point[0]] = point[1]
      })
//      console.log(l)
      return l;
    }

    // populates missing values with zero values, returns a fresh array
    self.populate_missing_values = function(number_of_days, oldest_timestamp, cumulative, data){
      var lookup = self.points_lookup(data)
      var previousValue = 0
      var points = []
      // iterate over x days, add 0 if no value
      for (var i = 0; i < (number_of_days+1); i++){
        timestamp = oldest_timestamp + (86400000 * i)       
        if((cumulative===undefined)||(cumulative===false)){
          // it's not cumulative. Lookup the value if exists or use 0
          y = lookup[timestamp] || 0
        } else {
          // it is cumulative. Lookup the value if exists or take the previous value
          y = lookup[timestamp] || previousValue
        }
        points.push({x:timestamp, y:y, id:'point_'+timestamp})       
        previousValue = y
      }     
      return points
    }

  // does not mutate the array that is passed in (pure)
  //  it finds dates and converts them to the beginning of the day, then groups the records under that
  self.groupByDay = function(array){    
    var cleanedArray = []
    mygravity.utils.forEach(array, function(i, point){
      d = new Date(point[0])
      // console.log('stopped here')
      p = Date.UTC(d.getFullYear(),d.getMonth(), d.getDate())
      // console.log('continued here')
      
      found = false
      mygravity.utils.forEach(cleanedArray, function(i, p2){
        if (parseInt(p) == parseInt(point[0])){
          found = true
          p2[1] += point[1]
        } 
      })
      if (!found){
        cleanedArray.push([p, point[1]])
      } 
    })

    return cleanedArray
  }


  // save the popularity list
  self.on('get_popularity_list', function(){
    fn2 = function(data){      
      RiotControl.trigger('render_popularity_list', data, Math.random()*100000000)        
    }
    get_or_wait('popularity_data_names', 'data_popularity_'+(dashboardStore.getCurrentStore() || 'all'), fn2)
  })

   self.on('report_save_popularity', function(data){
    uid = data.presend
    seriesNames = []
    first_timestamp = {date:new Date(), stamp:(new Date()).getTime()}

    mygravity.utils.forEach(data.postsend.series, function(i, series){      
      // console.log({name:series.name, series:series.data})      
      // console.log('grouping data')
      series.data = self.groupByDay(series.data)
      // console.log('group the data')
      series.data.sort(function(first, second){
          return first[0] > second[0] ? 1 : -1;
      })
      newTimestamp = new Date(series.data[0][0])
      if (first_timestamp.date > newTimestamp){
        first_timestamp.date = newTimestamp
        first_timestamp.stamp = series.data[0][0]
      }
    })    

    days = Math.round(((new Date())-first_timestamp.date)/(1000*60*60*24))    

    mygravity.utils.forEach(data.postsend.series, function(i, series){ 

      seriesId = series.name.split(' ').join('').toLowerCase()
      original_data = series.data
      self.save(original_data, seriesId, 'original_popularity_' + uid)

      series.data = self.populate_missing_values(days, first_timestamp.stamp, false, series.data)

      self.save(series.data, seriesId, 'data_popularity_' + uid)      
      
      seriesNames.push({name:series.name, data: series.data, original_data: original_data, id: seriesId })
    })

    self.save(seriesNames, 'popularity_data_names', 'data_popularity_'+uid)
    self.popularity_items = seriesNames
    seriesNames = null
    data = null
    
    run_queue()
  })
}

function clone(obj) {
  var target = {};
  for (var i in obj) {
   if (obj.hasOwnProperty(i)) {
    target[i] = obj[i];
   }
  }
  return target;
  }
