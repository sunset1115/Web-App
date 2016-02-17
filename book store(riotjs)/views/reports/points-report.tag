<points-report>
	<app-navi fixed=true stores=true></app-navi>

	<div class="dash">	
		<div class='big-padding'>
			<h1>Rewards Growth and Usage</h1>
			<p>Awarding value to your customers is the goal! Points awarded (orange) should be balanced with points redeemed (grey) in a healthy loyatly 
			programme because it shows that your customers are engaging with your programme and see value in the rewards you offer.
			</p>

			<highstock-bar-chart chartid='points-bar' height='424px' series={ pointsSeries } navigator=true feed='/earned_vs_redeemed' rangeselector=true></highstock-bar-chart>
		</div>
	</div>

	<script>
		pointsSeries = ['earned (loading..)','redeemed (loading..)']

		RiotControl.on('initial_points_chart', function(newData){ 

		    chart = newData.chart 
		    // console.log(chart.initialDataLoad)

		    if (chart.initialDataLoad === undefined){
		      // console.log('hello')

		      chart.initialDataLoad = true
		      chart = newData.chart
		      
		      chart.dataSet = []

		      newData.series.forEach(function(series, index){
		        name = chart.series[index].name
		        length = name.length
		        
		        total = 0
				series.data.forEach(function(point){
					total += point[1]
				})		        		       



		        chart.series[index].update({name: name.substr(0, name.indexOf('(')) + ' (' + total + ')', data: series.data})
		      })      		      
		  	}
		      
		  })  

		this.on('unmount', function(){RiotControl.trigger('unmount_charts')})
	</script>

	<style scoped>
		:scope{
			text-align: left;
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
		.big-padding{
			padding:50px;
		}
		h1 {
			line-height: 1.2;
			margin:0 0 0.75em;
			font-size:1.2em;
			font-weight: 300 !important;
		}
	</style>
</points-report>