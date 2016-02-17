<popularity-report>
	<app-navi fixed=true stores=true></app-navi>

	<div class="dash-back">	
		<div class='big-padding'>
			<h1>Rewards Popularity</h1>
			<p>Understand how popular your reward items are and how their popularity evolves over time. Click on each item for more information.</p>
			<ul id='rewards-group'>
				<li class='list' each={opts.listofrewards}>
					<div class='top-bar' onclick={toggleExpand} >
						<n></n>{name}<i></i>
						<span class='change-indicator'></span>
						<div id="mini{ id }" class='mini-chart'></div>
					</div>			
					<div class='panel hide' id='{ id }'><div class='panel-inner'></div></div>	
				</li>	
			</ul>
			<div id='navigator-container'>
				<div id='navigator' style='height:60px;overflow:hidden'></div>
			</div>
		</div>
	</div>

	<script>
		self = this
		RiotControl.trigger('load_popularity_data')	

		loaded_graphs = []
		opts.listofrewards = []

		toggleExpand(e){
			
			// console.log(e.target)
			var panel;
			switch(true){
				case (e.target.className.match(/panel/g) != null):
					// somehow we are the panel
					panel = e.target				
					break
				case (e.target.parentElement.querySelector('.panel') === undefined):
					// they clicked either the icon or the mini chart
					panel = e.target.parentElement.parentElement.querySelector('.panel')
					break
				default:
					panel = e.target.parentElement.querySelector('.panel')					
			} 
									
			if (panel.className == 'panel'){
				mygravity.utils.forEach(loaded_graphs, function(i, graph){
					if(graph.id == panel.id){
						graph.mount.unmount(true)
						return true // break the loop
					}
				})
				console.log('sdsds')
			 	panel.className = 'panel hide'			 	
				e.target.parentElement.className = 'list'
				e.target.parentElement.querySelector('.mini-chart').style = ''
				e.target.parentElement.querySelector('.change-indicator').style = ''
			} else {				
				if (panel.parentElement.getAttribute('locked') == null){
					panel.className = 'panel'
					e.target.parentElement.className = 'open'
					e.target.parentElement.querySelector('.mini-chart').style = 'display:none'
					e.target.parentElement.querySelector('.change-indicator').style = 'display:none'
					// inner = panel.querySelector('.panel-inner')
					width = panel.offsetWidth + 'px'
					// panel.parentElement.style = 'width:'+width
					// panel.parentElement.parentElement.style = 'width:'+width

					// data = []
					// mygravity.utils.forEach(opts.listofrewards, function(i, reward){
					// 	if(reward.id == panel.id){
					// 		data = reward.data		
					// 		return true // break the loop				
					// 	}
					// })				

					var min = null
					var max = null
					mygravity.utils.forEach(Highcharts.charts,function(i, chart){
		               if (chart.renderTo.id == 'navigator'){				                   
		                    ext = chart.xAxis[0].getExtremes()
		                    min = ext.min							                                    
		                    max = ext.max
		                    return true // break out the loop
		               }
			        });

					loaded_graphs.push({id: panel.id, mount:riot.mount('div#'+panel.id, 'highstock-popularity-area-chart', {chartid:'popularity'+panel.id, width:width,height:'160px', feed:'/popularity/'+panel.id, seriesname:'Quantity', min:min, max:max})[0]})	
				}
			}
			panel = null
		}

		self.last_stamp = ''
		opts.miniGraphs = []
			
		// readjust the weighing on the firsthalf & secondhalf attributes & reposition accordingly
		// consider moving to a web worker
		RiotControl.on('afterSetExtremes', function(extremes, stamp){
			if(self.last_stamp != stamp){
				self.last_stamp = stamp

				// get the interval number of days
				days = Math.round(((new Date(extremes.max))-(new Date(extremes.min)))/(1000*60*60*24))  
				console.log('number of days:' + days)

				// calculate the midpoint
				midPoint = Math.floor(days/2)

				// calculate topQuartile / bottomQuartile
				bottomQuartile = Math.floor(midPoint/2)
				topQuartile = midPoint + bottomQuartile

				// mark them up and adjust their counts
				mygravity.utils.forEach(opts.listofrewards, function(i, reward){
					// now lets find the bottom item in the array (assuming the array is ordered smallest first)
					bottom = 0
					mygravity.utils.forEach(reward.data, function(i, point){
						if (parseInt(point.x) > extremes.min){
							bottom = i
							console.log(i)
							return true // escape, it'll break free 
						}
					})

					// now lets find those five data points							
					
					t1 = 0
					t2 = 0
					t3 = 0
					t4 = 0

					mygravity.utils.forEach(reward.data, function(i, point){
						switch(true){
							// bottom = bottom -> bottomQuartile
							case ((i > bottom) && (i < (bottomQuartile+bottom))):
								t4 += parseInt(point.y)
								break
							// bottomQuartile = bottomQuartile -> midPoint
							case ((i >= (bottomQuartile+bottom)) && (i < (midPoint+bottom))):
								t3 += parseInt(point.y)
								break
							case ((i >= (midPoint+bottom)) && (i < (topQuartile+bottom))):
								t2 += parseInt(point.y)
								break
							case ((i >= (topQuartile+bottom)) && (i <= (bottom+days))):
								t1 += parseInt(point.y)
								break
						}
					})

					mygravity.utils.forEach(Highcharts.charts, function(i, c){
						if(c.renderTo.id == new String('m'+reward.id)){
console.log([t4, t3, t2, t1])
							c.series[0].update({data:[t4, t3, t2, t1]})
							return true						
						}
					})

					//popularity reporting is reporting on the quantity of the rewards
					searchable_array = []
					mygravity.utils.forEach(reward.original_data, function(i, time_value_array){
						if((parseInt(time_value_array[0]) >= extremes.min)&&(parseInt(time_value_array[0]) <= extremes.max)){
							for (var a = 0; a < time_value_array[1]; a++){
								searchable_array.push(1)															
							}
						}
					})

					if(searchable_array.length>0){
						e = document.getElementById(reward.id)
						e.parentElement.style = 'list'
						e.parentElement.removeAttribute('locked')
						e.parentElement.setAttribute('count', searchable_array.length)
						e.parentElement.querySelector('i').innerHTML = '('+searchable_array.length+')'

						switch(true){
							case ((t1+t2) < (t3+t4)):
								e.parentElement.querySelector('span').className = 'fa fa-chevron-circle-down change-indicator'
								e.parentElement.querySelector('span').style = 'color:red;'
								break
							case ((t1+t2) > (t3+t4)):
								e.parentElement.querySelector('span').className = 'fa fa-chevron-circle-up change-indicator'
								e.parentElement.querySelector('span').style = 'color:green;'
								break
							default:
								e.parentElement.querySelector('span').className = 'fa fa-minus-circle change-indicator'
								e.parentElement.querySelector('span').style = 'color:#ff8b34;'
						}
						
						e.parentElement.querySelector('.mini-chart').style = ''
					} else {
						e = document.getElementById(reward.id)
						e.parentElement.style = 'background-color:#eaeaea;'
						e.parentElement.querySelector('span').className = 'fa fa-minus-circle change-indicator'
						e.parentElement.querySelector('span').style = 'color:#333;'
						e.parentElement.setAttribute('locked', true)
						e.parentElement.setAttribute('count', 0)
						e.parentElement.querySelector('i').innerHTML = '(0)'
						e.parentElement.className = ''
						e.parentElement.querySelector('.mini-chart').style = 'display:none'
						e.className = 'hide'
					}
				})

				// move them about
				//time to get the parent
				parent = document.getElementById('rewards-group')
				nodelist = parent.querySelectorAll('li')

				// now we use the logical that a node can only exist in one place on the dom
				
				nodes = []				

				//note childnodes are a nodelist, so they do not have array features
				mygravity.utils.forEach(nodelist, function(i, node){					
					if (node.getAttribute('count') == 0){						
						// leaves zeros
					} else {
						nodes.push({count: node.getAttribute('count'), node: parent.removeChild(node)})						
					}
				})

				// zeros have been removed, they will not be sorted
				nodes.sort(function(node1, node2){
					return parseInt(node1.count) < parseInt(node2.count) ? 1 : -1
				})

				// get a reference in case we have zeros (will be null otherwise)
				firstChild = parent.firstChild

				// iterate the nodes, appending or inserting before
				mygravity.utils.forEach(nodes, function(i, item){
					if (firstChild == null){
						parent.appendChild(item.node)
					} else {
						parent.insertBefore(item.node, firstChild)		
					}
				})
				
				// add the magically order number to them
				mygravity.utils.forEach(parent.querySelectorAll('li'), function(i, node){
					node.querySelector('n').innerHTML = (i +1) + '. '
				})

				self.update()
			}
		})


		RiotControl.on('render_popularity_list', function(data, stamp){			
			    
			if(self.last_stamp != stamp){
				self.last_stamp = stamp

				series = []

				mygravity.utils.forEach(data, function(i, reward){
					mygravity.utils.forEach(reward.data, function(ii, point){
						series.push(point)									
					})
				})

				combinedData = []			
				mygravity.utils.forEach(series, function(i, point){
					notfound = true
					mygravity.utils.forEach(combinedData, function(ii, combinedPoint){
						if (combinedPoint.x == point.x){
							combinedPoint.y += point.y
							notfound = false
						} 
					})					
					if (notfound === true){
						combinedData.push(point)
					}
				})

				combinedData.sort(function(first, second){					
					return first.x > second.x ? 1 : -1;
				})

				opts.navigatordata = [{
					name:'all', 
					data:combinedData,
					dataGrouping: {
							// approximation: 'average',
							groupPixelWidth: 100,
							forced: true,
							tooltips:{
								enabled:false
							},
							units: [
								['day', [1]],
								['week', [1]],
								['month', [1]],
							]
						}
				}]			
				
				opts.listofrewards = data		
				self.update()		
			}
		})

		this.navigatorMount = null		

		this.on('update, mount', function(){
			if(opts.navigatordata.length > 0){
				if (this.navigatorMount){
					// console.log(navigatorMount.opts.chart.xAxis[0].getExtremes())
				} 
				else {

					mygravity.utils.forEach(opts.listofrewards, function(i, reward){
						riot.compile(function() { 	
						console.log(reward)						
							riot.mount('div#mini'+reward.id, 'highstock-popularity-area-mini-chart', {chartid:reward.id})
						})
					})

					this.navigatorMount = riot.mount('div#navigator', 'highstock-navigator', {chartid:'navigator', width: '50%', height:'200px', seriesdata:opts.navigatordata})[0]
				}
			}
		})

		RiotControl.trigger('get_popularity_list')		

		this.on('unmount', function(){			
			RiotControl.trigger('unmount_charts')
		})
	</script>

	<style scoped>
		:scope{
			text-align: left;
		}
		div.mini-chart{
			display:block;
			height:55px;
			width:160px;	
			position:relative;
			top:-60px;
			left: calc(100% - 180px);			
		}
		span.change-indicator{						
			top:30px;
			float:right;
			position:relative;
			right: 200px;
			top:30px;
		}
		div#navigator{
			display:block;
			margin:0;
			padding:0;
			width: 100%;
		}
		.dash-back {						
			padding:0;	
			padding-left:220px;		
			padding-top:80px;	
			padding-bottom:200px;
			margin:0;			
			/*float:left;*/
			max-width: calc(100% - 180px);
		}
		.big-padding{
			padding:0;
			margin:0;
			margin-left:50px;
			margin-top:50px;
			max-width: calc(100% - 100px);
		}
		h1 {
			line-height: 1.2;
			margin:0 0 0.75em;
			font-size:1.2em;
			font-weight: 300 !important;
		}
		i{
			padding-left:5px;
		}
		ul{
			text-decoration: none;
			list-style: none;
			margin:0;
			padding:0;
			max-width: calc(100% - 100px);
		}

		li{
			padding: 0;
			margin:0;
			/*width:100%;*/
		}

		#navigator-container{
			padding-top:50px;
			max-width: calc(100% - 100px);
		}

		.top-bar{
			height:60px;
			line-height: 60px;
			cursor:pointer;
			margin:0;
			padding:0;
			padding-left:20px;
			border-bottom: 1px solid #e5e5e5;
		}
		.list:hover{
			background-color:#f5f5f5;
		}
		.panel{
			/*max-width: 100%;*/
			margin:0;
			padding:0;			
			width: 100%;
			height:160px;			
		}
		.open.panel{
			border-bottom: 1px solid #e5e5e5;
		}
		.open > .top-bar{
			border: 0;
		}
		.hide{
			display:none;
		}
	</style>
</popularity-report>

