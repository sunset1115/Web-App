
<members>
	<div class='member'>
		<h2>Members</h2>
		<stats-header 		
			headline={ opts.memberDetails.headline}
			units={opts.memberDetails.headlineUnits} 
			stats={opts.memberDetails.stats}
		></stats-header>	

		<highstock-area-stack-chart chartid={ idMembersOne } height='180px' series={ seriesMembers } feed='/app_members_vs_card_members'></highstock-area-stack-chart>	
	</div>
 
	<script>
		self = this		

		idMembersOne = 'highstock_chart_' + Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 100000)		

		seriesMembers = ['card members (loading..)','app members (loading..)']		
		
		opts.memberDetails = reportDataStore.memberDetails

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
		.member{
			display:block;
			position:static;
			padding-bottom:20px;
		}
	</style>
	

</members>
