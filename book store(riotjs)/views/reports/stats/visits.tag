


<visits>
	<h2>Visits</h2>
	<stats-header 		
		headline={ opts.visits.headline}
		units={opts.visits.headlineUnits} 
		stats={opts.visits.stats}
	></stats-header>	

	<highstock-area-chart chartid={ idOne } height='180px' series={ seriesNamesOne } feed='/app_vs_card'></highstock-area-chart>
	<highstock-area-chart chartid={ idTwo } height='180px' series={ seriesNamesTwo } feed='/new_vs_returning'></highstock-area-chart>

	<stats-header 		
		headline={ opts.members.headline}
		units={opts.members.headlineUnits} 
		stats={opts.members.stats}
	></stats-header>	
 
	<script>
		self = this		

		idOne = 'highstock_chart_' + Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 100000)
		idTwo = 'highstock_chart_' + Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 100000)

		seriesNamesOne = ['card (loading..)','app (loading..)']
		seriesNamesTwo = ['new (loading..)','returning (loading..)']

		opts.visits = reportDataStore.visits
		opts.members = reportDataStore.members

		reportDataStore.registerStats(self)			

	</script>

	<style scoped>
		h2 {			
			font-size:1.1875rem;
			font-weight: 300px;
			text-align: center;
			padding:0;
			padding-bottom:15px;
			margin:auto;			
			line-height:1.2;
			font-weight: 300 !important;
		}
		:scope {
			display:block;
		}
	</style>
	

</visits>
