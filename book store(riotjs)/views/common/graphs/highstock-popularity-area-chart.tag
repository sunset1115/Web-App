<highstock-popularity-area-chart>
	<div id='outer'>
		<div id={ opts.chartid } style="min-width: 100%; height: { opts.height };margin: 0;paddding:0;"></div>		
	</div>
	<script>
		self = this				
		opts.chart = null				

		this.on('mount', function(){	
			opts.chart = new Highcharts.StockChart({

				chart: {
					renderTo: opts.chartid,
					type: 'area'
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
						enabled: true
					},
					tickWidth: 1,
					lineColor: '#f5f5f5',
					lineWidth:1,
					min: opts.min || null,
					max: opts.max || null
				},
				credits:{
					enabled:false
				},
				yAxis: {
					title: {
						text: opts.y_axis || ''
					},
					gridLineWidth: 1,
					// The types are 'linear', 'logarithmic' and 'datetime'
					type: 'linear',
					tickWidth: 1,
					lineColor: '#f5f5f5',
					lineWidth:0
				},
				legend: {
					enabled: false,
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
					name: opts.seriesname || '',
					data: opts.seriesdata || [],
					color:{
						linearGradient:{
							x1:0, 
							x2:0, 
							y1:0,
							y2:1
						},
						stops: [
							[0, '#7CB5EC'],
							[1, 'rgba(255,255,255,1)']
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
			margin:0;
			padding:0;
			
			/*position:absolute;*/
		}
		.highcharts-container{
			margin:0;
			padding:0;
			/*float:left;*/
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
		

</highstock-popularity-area-chart>