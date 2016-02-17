<app-help>

  <h2>Help & Tips</h2>
  <p>{ helptext.opening }</p>
  <p>{ helptext.p1 }</p>
  <p>{ helptext.p2 }</p>
  <p>{ helptext.p3 }</p>

  <script>
    var self = this
    self.data = []    

    var r = riot.route.create()

    r('/rewards', function(id) {      
        self.helptext = {
        opening: "Welcome to the launchpad",
        p1: "The launchpad provides nagivation to he main sections of the site.",
        p3: "If you have a question, or think of any feedback whilst you use this tool, feel free to use the feedback button below and we'll get back to you."
      }
      self.update()
    })

    r(function() {
      self.helptext = {
        opening: "Welcome to MyGravity Rewards. This panel will show you helpful tips on any of the pages.",
        p1: "To hide this panel just ask the developer kindly. Thanks",
        p2: "",
        p3: ""}
      self.update()
    })
  </script>

  <style scoped>
    :scope {
      position: fixed;
      top: auto;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 130px;
      box-sizing: border-box;      
      margin: 0;
      padding: 1em;
      padding-top:66px;
      text-align: center;
      background: #f7f7f7;      
    }
    h2 {
      line-height: 1.3;    
      font-size:1.6rem;  
      font-weight: 300;
    }
    p {
      text-align: left;
      font-size: 0.8125rem;
    }
    @media (min-width: 480px) {
      :scope {
        top: 0;
        right: 0;
        bottom: auto;
        left: auto;
        width: 200px;
        height: 100%;
      }
    }
  </style>

</app-help>
