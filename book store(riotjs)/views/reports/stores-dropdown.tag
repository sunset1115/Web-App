<stores-dropdown>
	<a href="#" class='open' onclick={ openStoreList }>
		<div class='small'>data for:</div>
		<span>{ store_name }</span><i class='fa fa-angle-down'></i>
	</a>
	<ul id='store-list' class='hide'>
		<li each={ dashboardStore.getStoreList() } if={ name != store_name }>
			<a onclick={ setStore }>{ name }</a>
		</li>
	</ul>

	<script>
		self = this
		store_name = dashboardStore.getCurrentStoreName() || 'All Stores'

		openStoreList(e){
			document.getElementById('store-list').className = ''
			e.preventDefault()
		}

		setStore(e){	
			console.log('hello from the store')		
			store_name = e.target.innerHTML
			document.getElementById('store-list').className = 'hide'
			RiotControl.trigger('dashboard_set_store', store_name)
			self.update()
			e.preventDefault()
		}

		RiotControl.on('dashboard_update_stores', function(list){
			self.update()
		})
	</script>

	<style scoped>
		a {
			height:80px;
			color: #fff;
			background-color:#404040;			
			padding:18px 15px;
			z-index:2;
			font-size:1.2rem;
			text-align:center;
			width:100%;
			cursor:pointer;
		}
		a.open {
			background-color:#333;
		}

		a:hover{
			background-color: #4d4d4d;
		}

		.hide {
			display:none;
		}
		.small{
			font-size:0.8rem;
			line-height: 0.8rem;			
		}
		span {
			text-transform: uppercase;
		}
		i {
			padding-left:10px;
		}
		li{
			list-style-type: none;
			width:100%;
			padding:0;
			margin:0;
		}
		li > a {
			font-size:0.85rem;
			line-height: 40px;
			text-align: left;
			height:40px;
			padding:0;
			padding-left:20px;
			margin:0;
			background-color: #404040;
		}
		li > a:hover {			
			background-color: #595959;
		}
		ul{
			width: 100%;
			padding:0;
			margin:0;
		}
	</style>

</stores-dropdown>