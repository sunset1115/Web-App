<dashboard>
	<app-navi fixed=true stores=true></app-navi>
	<div class="dash">	
		
		<div class='time-selector'>
			<material-dropdown optionselected='Last 30 Days' width='130px' options={ timeOptions } withchange={optionChangeFn}></material-dropdown>			
		</div>

		<div class='col-parent'>
			<div class='col'>
				<visits></visits>
			</div>
			<div class='col'>
				<members></members>
			</div>
		</div>
	</div>

	<script>
		timeOptions = [{id:'30', text:'Last 30 Days', disabled:true},{id:'60', text:'Last 60 Days'},{id:'90', text:'Last 90 Days'}]
		optionChangeFn = function(id, text){			
			switch(id){
				case '30':
					RiotControl.trigger('reports_change_range',30) ;			
					break;			
				case '60':
					RiotControl.trigger('reports_change_range',60) ;			
					break;			
				case '90':
					RiotControl.trigger('reports_change_range',90) ;			
					break;
				}
		}

		this.on('mount', function(){			
			RiotControl.trigger('dashboard_get_stores')
		})		

		this.on('unmount', function(){RiotControl.trigger('unmount_charts')})

	</script>

	<style scoped>
		:scope{
			width: calc(100%- 220px);
		}
		.dash {						
			padding:0;	
			padding-left:220px;		
			padding-top:80px;	
			padding-bottom:200px;
			margin:0;			
			float:left;
			width: calc(100%- 220px);			
		}
		.col {
			float:left;
			width: calc(((100vw - 220px) / 2) - 20px);
			margin:0 auto;
			padding:0;
			padding-right:10px;
		}
		.col-parent{								
			padding-top:40px;
			width: calc(100%- 220px);
		}

		.time-selector {
			float:right;
			margin-right:30px;
		}

	</style>
</dashboard>