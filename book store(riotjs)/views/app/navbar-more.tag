<navbar-more>
	<ul>
		<li each={ opts.menuItems }>
			<a href={url}>
				<span class={icon}></span>
				<span>{name}</span>
			</a>
		</li>
	</ul>	

	<style scoped>
		:scope {
			position:fixed;
			top:50px;
			right:15px;
			border-color: rgb(189, 189, 189);
			border-style: solid;
			border-width: 1px;
		}
		ul {
		    list-style-type: none;
		    /*height:auto;*/
		    display:block;
		    margin: 0;
		    padding: 0;
		    width: 200px;
		    background-color: #fff;
		}

		li {
			margin:0;
			padding:0;
			float:left;
			width:100%;
		}

		li a {
			margin:0;
			padding:0;
		    display: block;
		    color: rgb(51, 51, 51);
		    /*padding: 8px 0 8px 16px;*/
		    text-decoration: none;
		    /*line-height: 66px;*/
		}

		span {
			padding-left:15px;
		}

		/* Change the link color on hover */
		li a:hover {
		    background-color: rgb(51, 51, 51);
		    color: white;
		}
	</style>
</navbar-more>