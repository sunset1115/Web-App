<highstock-bar-chart>
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
					type: 'column'					
				},
				title: {
					text: opts.title || ''
				},
				plotOptions: {
					pointPadding: 0,
					borderWidth:0,
					groupPadding:0,
					shadow:false
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
					tickWidth: 0,					
					lineColor: '#e5e5e5',
					lineWidth: 1,
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
						enabled: true
					},
					tickWidth: 1,
					gridLineColor: '#e5e5e5',
					gridLineWidth: 1								
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
					enabled: opts.navigator || false,
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
							smoothed: true
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
							enabled: true
						},
						shadow: false
					}
				},
				rangeSelector: {
					enabled: opts.rangeselector || false
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
							[0, '#ff8b34'],
							[1, '#b26124']
						]
					},
					turboThreshold: 20000,
					dataGrouping: {
						// approximation: 'average',
						groupPixelWidth: 100,
						forced: true,
						units: [
							['day', [1]],
							['week', [1]],
							['month', [1]],
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
							[0, '#333333'],
							[1, '#5b5b5b']
						]
					},		
					turboThreshold: 20000,	
					dataGrouping: {
						// approximation: 'average',
						groupPixelWidth: 100,
						forced: true,
						units: [
							['day', [1]],
							['week', [1]],
							['month', [1]],
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
		

</highstock-bar-chart>