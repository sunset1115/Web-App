<highstock-popularity-area-mini-chart>
	<div id='outer'>
		<div id="m{ opts.chartid }" style="min-width: 100%; height: 55px;margin: 0;paddding:0;"></div>		
	</div>
	<script>
		self = this				
		opts.chart = null				

		this.on('mount', function(){	
			opts.chart = new Highcharts.StockChart({

				chart: {
					renderTo: 'm'+opts.chartid,
					type: 'area',
					backgroundColor:'transparent'
				},
				credits:{
					enabled:false
				},
				plotOptions:{
					series:{
						enableMouseTracking:false
					}
				},
				xAxis:{
					type:'linear',
					labels:{
						enabled:false
					},
					lineWidth:0,
					tickWidth: 0
				},
				tooltip:{
					enabled:false,
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
					lineColor: '#f5f5f5',
					lineWidth:0
				},
				scrollbar: { enabled: false	},
				navigator: { enabled: false },
				rangeSelector: { enabled: false	},								
				series: [{		
					type:'area',						
					name:'overview',
					pointInterval:1,
					dataLabels:{
						enabled: false
					},
					data: [5,5,5,5],
					lineWidth:2,
					lineColor: '#ff7e26',
					fillColor: '#fffdc9'
				}]				
			})				
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
		

</highstock-popularity-area-mini-chart>