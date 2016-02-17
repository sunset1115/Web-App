<highstock-navigator>
	<!-- <div id='outer'> -->
		<div id={ opts.chartid } style="max-width: {opts.width }; height: { opts.height };margin: 0;paddding:0;"></div>		
	<!-- </div> -->
	<script>
		self = this				
		opts.chart = null				

		this.on('mount', function(){
				
			opts.chart = new Highcharts.StockChart({
				chart: {
					renderTo: opts.chartid
				},
				title: {
					text: opts.title || ''
				},
				scrollbar: {
					enabled: opts.scrollbar || false
				},
				noData:{
					style: {'display':'none'}
				},
				series: opts.seriesdata,
				navigator: {
					enabled: true,
					handles: {
						backgroundColor: "#ffdcc2",
						borderColor: "#cc6f29"
					},
					maskFill: 'rgba(255, 139, 52, 0.1)', 
					outlineColor:'#e5e5e5',
					series: {
						type: 'area',
						color: 'rgba(255, 139, 52, 0.00)',
						fillOpacity:0.4,
						dataGrouping:{
							smoothed: false
						},
						lineWidth: 1,
						lineColor: 'rgb(255, 139, 52)', 
						fillColor:{
							linearGradient:{
								x1: 0,
								y1: 0,
								x2: 0,
								y2: 1
							},
							stops: [[0, '#ff8b34'], [1, '#FFFFFF']]
						},
						marker: {
							enabled: false
						},
						shadow: false
					}
				},
				credits:{
					enabled:false
				},
				tooltips:{
					enabled: false
				},
				rangeSelector: {
					enabled: opts.range_selector || false
				},					
				xAxis: {
					title: {
						text: opts.x_axis || ''
					},
					gridLineWidth: 0,
					type: 'datetime',
					labels: {
						enabled: false						
					},					
					tickWidth: 0,
					lineColor: '#fff',
					lineWidth:0,
					events:{
						afterSetExtremes: function(e){
							var thisChart = this.chart;        
							// // if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
					           Highcharts.charts.forEach(function (chart) {
					               if (chart !== thisChart) {
					                   if ((chart.xAxis[0].setExtremes)&&(chart.renderTo.id[0] != 'm')) { // It is null while updating
					                       chart.xAxis[0].setExtremes(e.min, e.max);
					                   }
					               }
					           });
					           RiotControl.trigger('afterSetExtremes', e, Math.random()*100000000);
					       	// }
						}
					}
				},
				yAxis: {
					title: {
						text: opts.y_axis || ''
					},
					gridLineWidth: 0,
					// The types are 'linear', 'logarithmic' and 'datetime'
					type: 'linear',
					labels: {
						enabled: false
					},
					tickWidth: 0,
					lineColor: '#fff',
					lineWidth:0
				}	
			})					
		})
	</script>

	<style>
		/*.outer{						
			border:1px solid #333;
			margin:0;
			padding:0;
			height:40px;
			width:100%;
			overflow:hidden;
		}*/
		.highcharts-container{
			margin:0;
			padding:0;
		}
		.highcharts-legend-item > text {
			text-transform: uppercase;
			font-weight: 500 !important;
		}
	</style>

	<script>
		// data feed logic
		// logic is simple for the moment, it just loads the data feed once
		// TODO: put in 1 second data polling once in the future					

			

	</script>
		

</highstock-navigator>