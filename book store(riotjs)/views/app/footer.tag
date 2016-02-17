<footer>
	
	<span>© MyGravity 2016</span>	

	<ul>
		<li each={ opts.items }>
			<a href={ url }>{ name }</a>
		</li>
	</ul>

	<script>
		this.opts.items = [
			{ name: 'legal', url: '/legal' },
			{ name: 'contact us', url: '/contact' },
			{ name: 'blog', url: '/blog' },
			{ name: 'support', url: '/support-faq'}
		]

	</script>

	<style scoped>
		:scope {
			background-color: rgb(238, 238, 238);
			border-top-color: rgb(189, 189, 189);
			border-top-width: 1px;
			border-top-style: solid;
			bottom:0px;
			width:100%;
			height: 50px;
			position:absolute;
			z-index:2;
		}		
		span {
			line-height:50px;
			font-weight: 500;
			width:265px;
			display:inline-block;
			letter-spacing:0.075rem;
			text-transform: uppercase;
			color: rgb(51, 51, 51);	
			margin:0px;
			padding:0px;
			padding-left:20px;
		}
		ul {
			margin:0;
			padding:0;
			float:right;
			list-style-type: none;		
		}

		li {
			display: inline;
		}

		a {
			text-transform: uppercase;
			line-height: 50px;
			color: rgb(51, 51, 51);
			cursor: pointer;
			font-size:0.75em;
			font-weight: 500;
			letter-spacing: 0.075rem;
			padding:20px;
			text-align: left;
			text-decoration: none;
		}
	</style>

</footer>