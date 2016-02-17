<landing>

	<raw-tagname name='{opts.icon}' class='big'></raw-tagname>

	<h1>{ opts.title || 'Now Loading...' }</h1>
	<h3>{ opts.body || 'Hold on this should only be a moment'  }</h3>
	
	<ul if={ opts.isLanding || false }>
	  <li each={ opts.landing }>
	  	<div>
	  		<raw-tagname name='{icon}' class='icon'></raw-tagname>
		  	<h4>{ title }</h4>
		  	<p>{ body }</p>	  	
		  	<a href={ url }>open</a>	  		  	
		</div>
	  </li>
	</ul>	

	<p id='info-tip-landing'>TIP: look for the <span class='fa fa-question-circle'></span> icons, and in the help panel for details on how to use the tools and the data within</p>	

	<style scoped>		

		:scope {
			font-family:Lato, sans-serif !important;
			font-size:2.25rem !important;
			font-weight: 300;
			text-transform: none;
			width: 65%;
			display: block;		
			text-align: center;
			margin:auto;	
			margin-top: 110px; 	

			/* The margin-left holds it in the center, it's lame, real lame, but somewhere I destroyed the nice centred model*/
			/* This includes 100px extra to account for the help bar */
		/*	margin-left: calc(17.5% - 100px);*/
		}

		.icon > svg {
			color:rgb(255, 139, 52);
			fill:rgb(255, 139, 52);
			height:32px;
			width:32px;
		}

		.big > svg {
			color:rgb(255, 139, 52);
			fill:rgb(255, 139, 52);
			height:62px;
			width:62px;
		}

		span {
			color:rgb(255, 139, 52);
		}

		div {
			padding-left: 40px;
	    	padding-right: 40px;
		}

		#info-tip-landing {
			position:absolute;
			bottom:0px;
			margin:auto;
			width:65%;
		}

		h1 {
			font-family:Lato, sans-serif !important;
			line-height: 1.3;
			margin: 0 0 0.75em;
			font-size:2.25rem !important;
			font-weight: 300;
			margin-bottom:20px;
			margin-top:10px;
		}

		h3 {
			font-family:Lato, sans-serif !important;
			font-weight: 300;
			font-size:1.1875rem;
			line-height: 1.16;
			margin:auto;
			max-width:525.5px;
		}

		h4 {
			font-family:Lato, sans-serif !important;
			font-weight: 500 !important;
			color: #ff7711;
			line-height: 1.2;
			margin:0px;
			margin-top:10px;
			margin-bottom:20px;        
			font-size:1rem;
			text-transform: uppercase;	
		}

		p {
			font-family:Lato, sans-serif !important;
			height: 80px;
			/*margin-bottom: 15px;*/
			font-size: 0.8125rem;
			line-height: 1.5
		}
		    
	    ul {
	    	font-family:Lato, sans-serif !important;
	    	margin:0px;
	    	margin-top:80px;
	    	list-style: none;
	    	font-size:1rem;
	    	font-weight: 500;	
	    }

	    li {
	    	font-family:Lato, sans-serif !important;
			display: inline-block;      
			margin: 0px;
			margin-bottom: 20px;
			padding-bottom: 0px;      
			padding-top: 10px;
			max-width: 260px;      
			text-align: center;
	    }

	    a {
	    	font-family:Lato, sans-serif !important;
			display: inline-block;
			background: rgb(255, 139, 52);
			text-decoration: none;      		
			line-height: 1.4;
			text-align: center;
			vertical-align: middle;
			border: 2px solid transparent;      
			padding: 4px 8px;
			min-width: 90px;
			margin:auto;      
			font-size: 0.96rem;
			font-weight: 500 !important;
			text-transform: uppercase;
			color: rgb(255, 255, 255);
	    }

	    a:hover {
	      background: rgb(66, 66, 66);
	    }    
    </style>

</landing>

