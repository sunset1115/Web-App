<feedback-card>

	<div class="demo-card-wide mdl-card mdl-shadow--2dp">
		<div class="mdl-card__title">
			<h2 class="mdl-card__title-text">Feedback</h2>
		</div>
			
		<form onsubmit={ sendFeedback } id='mygravity_feedback_form'>
			<div id='mygravity_feedback_info' class="mdl-card__supporting-text">
				Have something to say? Please let us know. Filling out this form will send a note directly to us. We'll be back in touch via telephone or email as soon as possible. 
					<material-textarea label='Let us know your thoughts...'></material-textarea>
			</div>

			<div id='mygravity_feedback_actions' class="mdl-card__actions mdl-card--border">
				<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
				  Submit Feedback			  
				</button>
			</div>

			<div id='mygravity_feedback_processing' class='mdl-card__supporting-text hide'>
				<p>Thanks for you feedback! This will auto-close.</p>
			</div>			
		</form>

		<div class="mdl-card__menu">
			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick={ closeFeedback }>	
	  			<i class="fa fa-times"></i>
			</button>
		</div>
	</div>

	<div id='overlay'></div>

	<script>
		self = this

		closeFeedback(){				
			self.unmount(true)
		}

		RiotControl.on('feedback_close', function(){			
			self.closeFeedback()
		})

		sendFeedback(e){
			e.preventDefault()
			document.getElementById('mygravity_feedback_actions').className += " hide"
			e.target[0].disabled = true
			document.getElementById('mygravity_feedback_processing').className = "mdl-card__supporting-text"
			window.setTimeout(function(){ RiotControl.trigger('feedback_close') }, 1500)				
			RiotControl.trigger('feedback_add', e.target[0].value)						
		}

		 // required to initialise the material design lite js elements
		this.on('mount', function() { componentHandler.upgradeDom(); });
	</script>

	<style scoped>
		:scope {
			position:fixed;
			left: calc(50% - ((500px + 20%) / 2));
			top: calc(50% - 200px);
		}

		div#overlay {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background-color: #fff;			
			opacity:0.85;
			z-index:1001;
		}

		form {
			width:100%;
		}

		.mdl-card__supporting-text>p {
			width:100%;
			height:40px;
		}

		.hide {
			display:none;
		}

		.mdl-card__supporting-text{
			padding:0;
			margin:0;
			margin-top:10px;
			margin-left:15px;
			margin-right:15px;
			width: calc(100% - 30px);
		}

		.demo-card-wide.mdl-card {
		  width: calc(500px + 20%);
		  z-index: 1002;
		}

		.demo-card-wide > .mdl-card__title {
		  color: #fff;
		  height: 176px;
		  background: url('/assets/mygwalletcoffee.jpg') center / cover;
		}

		.demo-card-wide > .mdl-card__menu {
		  color: #fff;
		}
	</style>

</feedback-card>