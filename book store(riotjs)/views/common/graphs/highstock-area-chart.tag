<highstock-area-chart>
	<div id='outer'>
		<div id={ opts.chartid } style= "min-width: 100%; height: { opts.height };margin: 0 auto"></div>		
	</div>
	<script>
		self = this				
		opts.chart = null		

		self.seriesNames = opts.series

		this.on('mount', function(){
				
			 opts.chart = new Highcharts.StockChart({
				chart: {
					renderTo: opts.chartid,
					type: 'area',
					animation:{
						duration: 2000
					}
				},
				title: {
					text: opts.title || ''
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
					pointInterval: 24 * 3600* 1000
				},
				credits:{
					enabled:false
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
					lineColor: '#fff'
				},
				legend: {
					enabled: true,
					symbolRadius: 6,
					symbolWidth: 12,
					symbolRadius: 6
				},

				scrollbar: {
					enabled: opts.scrollbar || false
				},
				navigator: {
					enabled: opts.navigator || false
				},
				rangeSelector: {
					enabled: opts.range_selector || false
				},				
				
				series: [{
					name: opts.series[0],
					data: [],
					color:{
						linearGradient:{
							x1:0, 
							x2:0, 
							y1:0,
							y2:1
						},
						stops: [
							[0, '#666666'],
							[1, '#8c8c8c']
						]
					}
				},{
					name: opts.series[1],
					data: [],
					color:{
						linearGradient:{
							x1:0, 
							x2:0, 
							y1:0,
							y2:1
						},
						stops: [							
							[0, '#c5f6ba'],
							[1, '#e2fbdd']
						]
					}
				}]				
			})	

			RiotControl.trigger('load_report_data', {chart:opts.chart, callback:'updateData_'+opts.chartid, feed:opts.feed})					
		})
	</script>



	<style>
		.outer{			
			border:1px solid #333;
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
		

</highstock-area-chart>