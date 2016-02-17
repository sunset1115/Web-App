<stats-header>

	<div class='stats-outer'>
		<div class='stats-inner'>
			<div class='stats-inner-side stats-inner-right'>
				<div class='stats-cushion'>
					<span class='stats-inner-headline-figure'>{ opts.headline }</span>
					<span class='stats-inner-headline-units'>{ opts.units }</span>
				</div>
			</div>
			<div class='stats-inner-side stats-inner-left'>
				<div class='stats-cushion'>
					<div class='stats-inner-detail' each={ opts.stats }>
						<span class={stats-inner-detail-figure:true, stats-negative:negative, stats-positive:positive }>{ value }</span>
						<span class='stats-inner-detail-units'>{ units }</span>	
					</div>					
				</div>
			</div> 
		</div>
	</div>

	<script>
		// console.log(opts.stats)

	</script>

	<style scoped>
		:scope {
			text-transform: uppercase;
			width:100%;		
		}
			
		.stats-outer {
			display:block;
			padding:0;
			margin:0;
			min-height: 165px;
			width: 100%;
		}

		.stats-inner {
			display:flex;					
			flex-wrap:wrap;					
			padding:25px 0;
			background-color:#f5f5f5;
			border-top:1px solid #bdbdbd;
			font-size: 0.895em;
			width: 100%
		}
		
		.stats-inner-side{			
			width:50%;	
		}

		.stats-cushion {
			padding:0;
			padding-left:15px;
			padding-right:15px;
		}

		/* right side */

		.stats-inner-right {
			text-align: right;
		}

		.stats-inner-right > .stats-cushion > .stats-inner-headline-figure {
			font-size: 65px;
			line-height: 65px;			
			display:block;						
		}

		.stats-inner-right > .stats-cushion > .stats-inner-headline-units {				}

		/* left side */

		.stats-inner-left {			
			text-align: left;
		}

		.stats-inner-left > .stats-cushion > .stats-inner-detail > .stats-inner-detail-figure {
			font-weight: 700 !important;
			font-size: 1rem;		
		}

		.stats-inner-left > .stats-cushion > .stats-inner-detail > .stats-inner-detail-units {	 }

		/* emotional changes */

		.stats-negative {
			color: rgb(255,0,0);
		}

		.stats-positive {
			color: rgb(0, 128, 0);
		}

	</style>

</stats-header>