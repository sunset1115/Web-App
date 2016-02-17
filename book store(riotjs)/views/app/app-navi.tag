<app-navi  onclick={ toggleNavi }>  
    <div id='navi' class='{open:opts.fixed, hide:opts.hidden}'>
      <script>
      // note the each hack instead of the if. It's a known riotjs bug.
      </script>
     <stores-dropdown each={ opts.stores ? [1] : []} class='{hide:opts.hidden}' id='storedropdown'></stores-dropdown></span>

      <div class='{hide:opts.hidden}' id='navi-links'>
        <a href="/rewards/" onclick={ navigate }>Launchpad</a>
          <a href="/rewards/reports" onclick={ navigate }>&nbsp;Reports</a>
              <a href="/rewards/reports/popularity" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Popularity</a>
              <a href="/rewards/reports/points" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Points</a>
          <a href="/rewards/actions" onclick={ navigate }>&nbsp;Action Centre</a>
            <!-- <a href="/rewards/actions/surveys/nps" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;NPS</a>
            <a href="/rewards/actions/nps" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Cust. Satisfaction</a>
            <a href="/rewards/actions/nps" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Marketing</a> -->
          <a href="/rewards/config" onclick={ navigate }>&nbsp;Configuration</a>
            <!-- <a href="/rewards/config/spf" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Setup SPF</a>
            <a href="/rewards/config/enlist" onclick={ navigate }>>&nbsp;&nbsp;&nbsp;Enlist</a> -->
      </div>

      <a id='outer'>
        <span class='fa fa-bars '></span>
      </a>  
    </div>
  <script>
    self = this
    toggleNavi(e){
      if (!opts.fixed == true){
        if(document.getElementById('navi').className == 'open'){
          opts.hidden = true          
        } else {
          setTimeout(function(){        
            body_click.addMethodToExec(function(){               
              self.toggleNavi(null)
             })          
          }, 50)
          opts.hidden = false          
        }     
      }      
    }

    navigate(e){
      var parser = document.createElement('a')
      parser.href = e.target.href
      riot.route(parser.pathname)
    }  

  </script>

  <style scoped>
    :scope {
      margin:0;
      padding:0;
    }

    #navi {      
      position: fixed;
      top: 0;
      left: 0;
      height: calc(100% - 2px);
      margin:0;
      padding:0;
      box-sizing: border-box;
      text-align: center;
      color: #666;
      background: #333;
      width: 30px;
      padding-top:66px;
      text-transform: uppercase;
      transition: width .3s;
      display:block;
      font-weight: 300 !important;
    }

    #navi.open {
      width: 210px;      
    }

    .hide {
      display:none;
    }

    #navi-links > a {
      color: white;
      text-align: left;
      transition: .9s;
    }

    #navi.open > #outer {
      display:none;
      transition: .2s;
    }

    #outer {
      color: #fff;
      position:fixed;
      font-size:0.8rem;
      left:0px;
      top: 71px;
      z-index:100;
      height:30px;
      width:30px;
      vertical-align: middle;
      text-align: center;
      line-height: 30px;
      cursor:  hand;
    }

    a {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 .8em;
      color: #333;
      text-decoration: none;
      background: #333;
      font-size:0.8rem;
      font-weight: 300 !important;
      overflow:hidden;
    }
    a:hover {
      background: #666;
    }
  </style>

</app-navi>
