<material-dropdown>
	<script>
		/* this expects:

			opts.selected 		 	( string )
			opts.withchange		 	( function(id, text) )	
			opts.width				( string, e.g. 30px )			
		
			opts.options => 
				text 				( string )
				id 					( string ) 			

		*/	
	</script>

	<div class='select-wrapper'>
		<div id='select-box'>
			<span id='select-box-option'>{ selected  }</span>
			<span id='select-box-angle-down' class='fa fa-angle-down'></span>
		</div>

		<ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="select-box">
		  <li class="mdl-menu__item" each={ opts.options } onclick={ optionSelected } disabled={ disabled }><span class='text hide'>{ text }</span><span class='hide id'>{ id }</span>{ text }</li>					  
		</ul>
	</div>

	<script>
		self = this

		selected = opts.optionselected

		optionSelected(e){
			if (e.target.disabled != 'disabled'){											
				option_text = e.target.querySelector('span.text').innerHTML				
				selected = option_text
				
				opts.options.forEach(function(option){
					if (option.text == option_text){
						option.disabled = true
					} else {
						option.disabled = false
					}
				})

				document.querySelector('.mdl-menu__container.is-upgraded.is-visible').className = 'mdl-menu__container is-upgraded'									

				opts.withchange(e.target.querySelector('span.id').innerHTML, option_text)
				option_id = null
				option_text = null
				e = null
			}
		}

		// required to initialise the material design lite js elements
		this.on('mount', function() { 
			componentHandler.upgradeDom();
			document.getElementById('select-box').style = 'width:'+opts.width+';';
		});
	</script>

	<style scoped>
		.hide{
			display:none;
		}

		.select-wrapper{
			display:block;
			text-transform: uppercase;
			text-align: left
		}

		#select-box-option{
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
			border-bottom: 1px solid rgb(189, 189, 189);
		}

		.mdl-switch__label{
			text-transform: uppercase;
			font-size:0.9rem;
		}

		.next-toggle{
			margin-bottom:10px;
		}

		.disabled {
			background-color:rgb(245,245,245) !important;
		}
	</style>

</material-dropdown>