<cs>
	<div id='download-data-card' class={hide:downloadHidden, download-box:true}>
		<div class="card-wide mdl-card mdl-shadow--2dp">
			<div class="card-title mdl-card__title">
				Downloading Customer Satisfaction data
			</div>		  
		  	<div class="mdl-card__supporting-text">
				<p>Downloading { dataTypeDownloading } data for Customer Satisfaction</p>	
				<div id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>							
		  	</div>
		  	<div class="mdl-card__actions"></div>
		</div>
	</div>

	<div class={hide:!downloadHidden, nps-container:true} id='nps-container'>
		<h1>Customer Satisfaction Survey</h1>
		<p>Your customers are you best source of feedback, and we make it quick and easy for you to gather this information! Take a few moments to set up your survey and we'll send it out to your customer for you. What's more, you will be rewarding your customer for their feedback, which reinforces your loyatly programme!</p>
		
		<div id='slider'>
			<input onchange={ setValue } class="mdl-slider mdl-js-slider" type="range" min="2" max="{ opts.maxValue }" value="{ opts.next ? opts.next.reward_value : Math.floor(opts.maxValue/2) }" tabindex="0"><span id='slider-value'>{ opts.next ? opts.next.reward_value : Math.floor(opts.maxValue/2) }pts</span>
		</div>

		<div class='flex-layout survey-cards'>
			<div class="card-wide mdl-card mdl-shadow--2dp">
				<div class="card-title mdl-card__title">
					Current Survey
				</div>		  
			  	<div class="mdl-card__supporting-text">
					<p>Started on { (new Date(opts.current.starts_on)).toDateString() }. Ends on { (new Date(opts.current.ends_on)).toDateString() }.
					Worth { opts.current.reward_value } points</p>

					<!-- <b>NPS question</b>
					<div>
						How likely is it that you would recommend our store to a friend or colleague?
					</div> -->
			  	</div>
			  	<div class="mdl-card__actions"></div>
			</div>
			
			<span class={hide:hidden}>
				<div id='nextSurvey' class="overflow-allowed card-wide mdl-card mdl-shadow--2dp">
				  	<div class="mdl-card__title">
				  		Next Survey
				  	</div>		  
				  	<div id='nextText' class="mdl-card__supporting-text">
					  	<p><span id='nextStartsOn'>Starts on { (new Date(opts.next.starts_on)).toDateString() }. </span>Worth { opts.next.reward_value } points</p>

					  	<div class='next-toggle'>
						  	<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
						  		<input onchange={ toggleNext } type="checkbox" id="switch-1" class="mdl-switch__input" checked>
						  		<span id='next-toggle-label' class="mdl-switch__label">scheduled</span>
							</label>
						</div>
						
						<div each={opts.next.questions}>{text}</div>
					
				  	</div>			  	
				  	<div class="mdl-card__actions"></div>
				</div>
			</span>
					
		</div>
	</div>

	<script>
		var self = this

		setValue(e){
			
			opts.next.reward_value = e.target.value
			opts.current.reward_value = e.target.value

			RiotControl.trigger('cs_value_changed', e.target.value)
		}
		
		nextOpen = true

		toggleNext(e){
			if (nextOpen){
				nextOpen = false	
				
				document.getElementById('next-toggle-label').innerHTML = 'disabled'
				document.getElementById('nextStartsOn').className += ' hide'
				document.getElementById('nextSurvey').className += ' disabled'					
			} else {
				nextOpen = true		
				
				document.getElementById('next-toggle-label').innerHTML = 'scheduled'
				document.getElementById('nextStartsOn').className = ''
				document.getElementById('nextSurvey').className = 'card-wide mdl-card mdl-shadow--2dp overflow-allowed '
			}
		}

		failed_clean_run = false

		try {

			scheme = schemeStore.getScheme()
			
			points_per_visit = scheme.points_per_visit 
			// console.log(points_per_visit)
			if ((points_per_visit === undefined)||(points_per_visit < 25)){
				points_per_visit = 25
			}
			opts.maxValue = points_per_visit

			window.dataIssue = false
		} catch(e){
			console.log('failed scheme')
			failed_clean_run = true
			if (!window.dataIssue){
				window.dataIssue = true
				dataTypeDownloading = 'scheme'
				RiotControl.trigger('get_scheme')
			}			 
		}

		try {
			opts.current = surveyStore.getCurrentCS()
			
			opts.next = surveyStore.getNextCS()
			if (opts.next === undefined){
				hidden = true
			}

			if(!window.dataIssue && opts.current === undefined && opts.next === undefined && !window.missingCSDataCheck){
				window.missingCSDataCheck = true
				throw 'error - missing data?'
			}
					
			window.dataIssue = false
		} catch(e){
			console.log(e)
			console.log('failed on template')
			if (!window.dataIssue){
				window.dataIssue = true
				dataTypeDownloading = 'survey'
				RiotControl.trigger('get_surveys')		
			}
			failed_clean_run = true	
		}

		downloadHidden = !failed_clean_run

		if (failed_clean_run){
			console.log('bang bang - oh no!')
			setTimeout(function(){
				console.log('trying again..')
				console.log('routing')
				riot.route('/rewards/actions/')
				riot.route('/rewards/actions/surveys/satisfaction')
			}, 3000)
		} else {
			console.log('success')
			self.update()
			window.dataIssue = false
		}

		// required to initialise the material design lite js elements
		this.on('mount', function() { componentHandler.upgradeDom(); });
	</script>

	<style scoped>
		
		.overflow-allowed{
			overflow:visible;
		}
		#select-box-question{
			width: calc(100% - 8px);
			display:block;		
		}
		#select-box-angle-down{
			width:5px;			
			display:block;
		}
		#select-box {
			cursor: pointer;
			display:flex;
			border-bottom: 1px solid #333;
		}
		.mdl-switch__label{
			text-transform: uppercase;
			font-size:0.9rem;
		}
		.next-toggle{
			margin-bottom:10px;
		}
		.hide {
			display:none;
		}
		.disabled {
			background-color:rgb(245,245,245) !important;
		}
		.close-position-top-right{
			top:-10px;
			right: 6px;
		}
		.mdl-card{
			font-size:2.5rem !important;
			font-weight:300 !important;			
		}
		#slider {
			width:100%;			
			display:flex;
		}
		#slider-value{
			width:30px;	
			display:block;
		}
		#slider > .mdl-slider__container {
			width: calc(100% - 35px);			
		}

		:scope {
			position:fixed;
			top:66px;
			left:210px;
			padding:0;
			margin:0;			
			margin-right:650px;
			width: calc(100% - 220px - 210px);
		}

		h1 {
			line-height: 1.2;
			margin:0 0 0.75em;
			font-size:1.2em;
			font-weight: 300 !important;
		}

		.flex-layout{
			display:flex;
			margin-top:30px;
		}

		.card-wide {
			width:400px;
			margin:0 auto;
		}

		.download-box{			
			margin-top:30px;
		}

		.nps-container{
			padding-top:20px;
			text-align:left;
		}
	</style>
</cs>