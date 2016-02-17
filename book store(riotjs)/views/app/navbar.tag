<script>
	/*

		Navbar describes the top bar across the top of all the pages

	*/
</script>

<navbar>	
	<a href='/rewards' id='logo'>
		<raw-tagname name='icons-logo'/>
	</a>	

	<ul>	
		<li each={ opts.sections }>
			<a href={url} id="navbar-link-{id}">
				<raw-tagname class='navbar-icons' name='{icon}'/>
				<span>{name}</span>
			</a>
		</li>
	</ul>
  	<feedback-fab></feedback-fab>
	<ul id='navbar-actions'>	
		<li each={ opts.actions }>		
			<a href={url} onclick={ isMenu ? parent.toggle : '' }>
				<span>{name}</span>
				<span if={ isMenu || false } class='fa fa-angle-down'></span>
			</a>
			<span if={ isMenu || false } id='more' name='more'></span>				
		</li>
	</ul>

	<script>
		var self = this

		this.opts.sections = [
			{ url: '/rewards/', id:'launch', name: 'Launchpad', icon: 'icons-launchpad' },
		 	{ url: '/rewards/reports', id:'reports', name: 'Reports', icon: 'icons-reports' },
		 	{ url: '/rewards/actions', id:'actions', name: 'Action Centre', icon: 'icons-actioncentre' }
		 	// ,
		 	// { url: '/rewards/config', name: 'Configuration', icon: '/assets/action-sm-b+w.png' }
		]	

		dropdown = [
			{ url: '/my360/myaccount', name: 'My Account', icon:'fa fa-user'},
			{ url: '/my360/wallet', name: 'Wallet', icon:'fa fa-money'},
			{ url: '/my360/logout', name: 'Logout', icon:'fa fa-sign-out'},
		]

		this.opts.actions = [
			{ url: '/rewards/reports', name: 'Help', isMenu:false },
			{ url: '/rewards/actions', name: 'More', isMenu:true }
		]		

		var moreTag = null

		toggle(){
			riot.compile(function() { 
				moreTag = riot.mount('span#more', 'navbar-more', { menuItems:dropdown })[0]
			})
						
			setTimeout(function(){
				
				body_click.addMethodToExec(function(){ 
					moreTag.unmount(true)
				 })
				
			}, 50)

			self.update()
		}

		var r = riot.route.create()

		var clearActive = function(id){
			self.opts.sections.forEach(function(section){
				if (section.id != id){
					document.getElementById("navbar-link-"+section.id).className = '' 					
				}
			})
		}		

    	r('/rewards', function(){     		
    		document.getElementById('navbar-link-launch').className = 'active' 
    		clearActive('launch') })
    	r('/rewards/reports', function(){     		
    		document.getElementById('navbar-link-reports').className = 'active' 
    		clearActive('reports') })
      	r('/rewards/reports/*', function(){ 
    		document.getElementById('navbar-link-reports').className = 'active'
    		clearActive('reports') })
    	r('/rewards/actions', function(){ 
    		document.getElementById('navbar-link-actions').className = 'active' 
    		clearActive('actions') })
    	r('/rewards/actions/*', function(){ 
    		document.getElementById('navbar-link-actions').className = 'active' 
    		clearActive('actions') })

	</script>

	<style scoped>
		:scope {
			width: 100%;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: rgb(189, 189, 189);
			display:block;
			position:fixed;
			top:0px;
			z-index:4;
			height:50px;
			font-weight: 300;
			width: 100%;
			background-color: #fff;
		}

		.navbar-icons > svg {
			padding:0;
			padding-left:5px;
			margin:auto 0;
			line-height: 50px;
			height: 15px;
			width: 15px;
			position:relative;
			top:-2px;
		}

		a:hover, .active {
		/*	color:rgb(255, 139, 52);
			fill:rgb(255, 139, 52);*/
			font-weight: 500 !important;
		}

		#logo {
			float:left;
			margin-right: 95px;
		}
		#navbar-actions{
			float:right;	
			margin-right:15px;		
		}
		a {
			line-height: 50px;
			font-size: 0.8125rem;
			/*font-size: 0.95rem;*/
			font-weight: 300;
			text-transform: uppercase;
			text-decoration: none;	
			color: rgb(51, 51, 51);		
		}


		img{			
			padding:0;
			margin:0;
			/*margin-bottom:-3px;*/
			padding-right: 5px;

		}
		li{
			display:inline;
			padding-left:10px;
			padding-right:10px;
		}
		ul {
			margin:0;
			padding:0;
			padding-left: 20px;
			float:left;		
			list-style-type: none;		
		}
		svg {
			max-height:24px;
			min-height:24px;
			height: 30px;
			padding:5px;
			padding-left:25px;
		}
	</style>
</navbar>