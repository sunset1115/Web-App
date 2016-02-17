<app-main onclick={body_click.trigger("clicked")}>

  <script>
    /************************************** 

        app-main tag is main page displays & key routes

    ***************************************/
  </script>
  <!-- Display the dashboard by mounting it to this -->

  <span id='dashboard' name='dash'></span>

  <!-- Display the title, body & cards if needed -->
  <span id='landing_nav' name='navigation'></span>  


  <script>

    self = this
    var nav = null

    var active_tags = []    
    
    var r = riot.route.create()

    // for develeopment only ---
    r('/login.html', dev)

    function dev(){
      window.location = window.location
    }

    // launchpag
    r('/rewards',           launchpad       ) 
    r('/rewards/',          launchpad       ) 
    r('/rewards/dashboard', launchpad       )  
    r('/rewards/dashboard/', launchpad       )  

    // my360 routes
    r('/my360/logout', logOut )
    r('/my360/myaccount', gotoMy360 )
    r('/my360/wallet', gotoMy360 )


    // reports
    r('/rewards/reports',    dashboard       )        
    r('/rewards/reports/points',    pointsReport       )        
    r('/rewards/reports/popularity',    popularityReport       )

    r('/rewards/config',    config      )   
    // r('/rewards/reports/',    dashboard       )        
    // r('/rewards/reports/*',    dashboard       )        
    
    r('/rewards/actions',    actionCentre    )  
    r('/rewards/actions/surveys/nps',    nps    )     
    r('/rewards/actions/surveys/satisfaction',    cs    ) 
    r(              notfound        ) // `notfound` would be nicer! 

    function gotoMy360(){
      window.location = window.location
    }

    function logOut(){
      // alert('hello')
      mygravity.local.clearAll()
      window.location = window.location
    }

    function notfound(){  

      mount_landing({
        title:  "404",
        body:  "The page you are looking for cannot be found, sorry",        
        isLanding: false
      })   

      unmount_all()
      self.update()      
    }

    function mount_landing(opts){ 
      if (!nav || !nav.isMounted){  
        riot.compile(function() {  
          //riot.mount returns an array, we only want the object so we select the first index
          nav = riot.mount('span#landing_nav', 'landing', opts)[0]
        })
      } else {
        nav.unmount(true)
        riot.compile(function() {  
          //riot.mount returns an array, we only want the object so we select the first index
          nav = riot.mount('span#landing_nav', 'landing', opts)[0]
        })
        // console.log('here')
        // console.log(nav)
        nav.opts = opts
        nav.update()
      }      
    }

    function unmount_all(){
      active_tags.forEach(function(tag){
        tag.unmount(true)
      })
      active_tags = []
    }

    function launchpad() {
      // To add more menu items just add them below to the cards      
      var cards = [
        { id: 'reports', icon:'icons-reports', title: 'Reports', body: "Understand how your loyatly programme is performing and identify key areas for improvement.", url: '/rewards/reports' },
        { id: 'surveys', icon:'icons-actioncentre', title: 'Action Centre', body: "Personalise and send your customer feedback surveys. Create email marketing campaigns.", url: '/rewards/actions' }
        // ,
        // { id: 'config', icon:'icons-reports', title: 'Configuration', body: "Customise your reward scheme to exactly your needs. If there is a tweak that can be made, it'll be found here", url: '/rewards/config' }
      ]

      mount_landing({
        icon: "icons-launchpad",
        title:  "Welcome to your Launch Pad",
        body:  "Insights. Information. Survey setup. Email marketing. One place for everything you need.",
        landing: cards,
        isLanding: true
      })      

      unmount_all()
      self.update()        
    }

    function actionCentre() {
//      console.log('actionCentre')

      // To add more menu items just add them below to the cards      
      var cards = [
        { id: 'nps', title: 'Net Promoter Score', body: "Find out how likely your customers are to promote your business by calculating your NPS", url: '/rewards/actions/surveys/nps' },
        { id: 'satisfaction', title: 'Customer Satisfaction Surveys', body: "Personalise your Customer Satisfaction Surveys to ask questions important to your business", url: '/rewards/actions/surveys/satisfaction' },
        { id: 'marketing', title: 'Email Marketing Campaigns', body: "Create and send great-looking email campaigns to your customers in minutes", url: '/rewards/actions/campaigns' }
      ]

      mount_landing({
        icon: 'icons-actioncentre',
        title:  "Welcome to your Action Centre",
        body:  "Plan, personalise, and schedule your customer feedback surveys.",
        landing: cards,
        isLanding: true
      })      

      unmount_all()
      
      self.update()  
    }

    function config() {
      // To add more menu items just add them below to the cards
      var cards = [
        { id: 'spf', title: 'Setup SPF', body: "Setup SPF on your account to enable your emails to come directly from domain", url: '/rewards/config/spf' },
        { id: 'user', title: 'Enlist users', body: "Enlist existing users to your scheme by uploading a csv", url: '/rewards/config/enlist' }
      ]

      mount_landing({
        title:  "Welcome to your Configuration",
        body:  "Customise your reward scheme to exactly your needs. If there is a tweak that can be made, it'll be found here",
        landing: cards,
        isLanding: true
      })      

      unmount_all()
      self.update()  
    }

    function dashboard() {                  
      try{
        nav.unmount(true)
      }catch(e){}      
      riot.compile(function() {  
        //riot.mount returns an array, we only want the object so we select the first index        
        active_tags.push(riot.mount('span#dashboard', 'dashboard')[0])        
      })      
      self.update()         
    }

    function pointsReport(){
      try{
        nav.unmount(true)
      }catch(e){}      
      riot.compile(function() {  
        //riot.mount returns an array, we only want the object so we select the first index        
        active_tags.push(riot.mount('span#dashboard', 'points-report')[0])        
      })      
      self.update()         
    }

    function popularityReport(){
      try{
        nav.unmount(true)
      }catch(e){}      
      riot.compile(function() {  
        //riot.mount returns an array, we only want the object so we select the first index        
        active_tags.push(riot.mount('span#dashboard', 'popularity-report')[0])        
      })      
      self.update()         
    }

    function nps() {             
//      console.log('nps')     
      try{
        nav.unmount(true)
      }catch(e){}      
      riot.compile(function() {  
        //riot.mount returns an array, we only want the object so we select the first index        
        active_tags.push(riot.mount('span#dashboard', 'nps')[0])        
      })      
      self.update()         
    }    

    function cs() {             
      console.log('cs')     
      try{
        nav.unmount(true)
      }catch(e){}      
      riot.compile(function() {  
        //riot.mount returns an array, we only want the object so we select the first index        
        active_tags.push(riot.mount('span#dashboard', 'cs')[0])        
      })      
      self.update()         
    }    
    
  </script>

  <style scoped>
    :scope {
      text-align: center;     
      width:100%;    
      font-family:Lato, sans-serif !important;
    }

    @media (min-width: 480px) {
      :scope {        
        margin-bottom: 0;
      }
    }
    span {
      margin:0 auto;
      
    }

  </style>

</app-main>
