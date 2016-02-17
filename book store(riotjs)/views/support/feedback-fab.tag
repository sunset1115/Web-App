<feedback-fab >
	<button id="feedback-fab" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onclick={ openFeedbackForm }>
	 <i class="fa fa-comment"></i>
	</button>
	<material-tooltip for="feedback-fab" text="<p><i>Have something to say?</i></p>Whether its <b>good</b> or <b>bad</b>, we would like to hear it."></material-tooltip>

	<span id='feedback-form' name='feedbackForm'></span>

	<script>
		var card = null

		openFeedbackForm(){
			riot.compile(function() {  
	          //riot.mount returns an array, we only want the object so we select the first index
	          card = riot.mount('span#feedback-form', 'feedback-card')[0]
	        })
		}
		
		 // required to initialise the material design lite js elements
		this.on('mount', function() { componentHandler.upgradeDom(); });
	</script>

	<style scoped>
		:scope {
		
			
			color: #fff;
			/*font-size:3em;*/
			z-index:6;
		}		
		.mdl-button--fab{		
			float:right;
			margin:10px;
			margin-right:20px;	
			font-size:0.8em;
			max-height:30px;
			min-width: 30px;
			max-width: 30px;
		}
		
	</style>	

</feedback-fab>
