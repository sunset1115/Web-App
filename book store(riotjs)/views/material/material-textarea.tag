<material-textarea>
	<script>
		textfield_id = opts.label + '_' + Math.floor(Math.random() * 1000)

		this.on('mount', function() { componentHandler.upgradeDom(); });
	</script>

	<div class="mdl-textfield mdl-js-textfield">
		<textarea class="mdl-textfield__input" type="text" rows= "3" id="{textfield_id}" ></textarea>
		<label class="mdl-textfield__label" for="{textfield_id}">{ opts.label }</label>
	</div>

	<style scoped>
		:scope {
			width:100%;
		}

		div.mdl-textfield.mdl-js-textfield {
			width:100%;
		}

		textarea.mdl-textfield {
			width:100%;
		}
	</style>

</material-textarea>