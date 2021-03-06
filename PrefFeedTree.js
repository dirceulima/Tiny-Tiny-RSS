dojo.provide("fox.PrefFeedTree");
dojo.provide("fox.PrefFeedStore");

dojo.require("lib.CheckBoxTree");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("fox.PrefFeedStore", dojo.data.ItemFileWriteStore, {
	
	_saveEverything: function(saveCompleteCallback, saveFailedCallback,
								newFileContentString) {

		dojo.xhrPost({
			url: "backend.php",
			content: {op: "pref-feeds", subop: "savefeedorder",
				payload: newFileContentString},
			error: saveFailedCallback,
			load: saveCompleteCallback});
	},

});		

dojo.declare("fox.PrefFeedTree", lib.CheckBoxTree, {
	_createTreeNode: function(args) {
		var tnode = this.inherited(arguments);

		if (args.item.icon)
			tnode.iconNode.src = args.item.icon[0];

		return tnode;
	},
	onDndDrop: function() {
		this.inherited(arguments);
		this.tree.model.store.save();
	},
	getRowClass: function (item, opened) {
		return (!item.error || item.error == '') ? "dijitTreeRow" : 
			"dijitTreeRow Error";
	},
	getIconClass: function (item, opened) {
		return (!item || this.model.store.getValue(item, 'type') == 'category') ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "feedIcon";
	},
	checkItemAcceptance: function(target, source, position) {
		var item = dijit.getEnclosingWidget(target).item;

		// disable copying items
		source.copyState = function() { return false; }

		var source_item = false;

		source.forInSelectedItems(function(node) {
			source_item = node.data.item;
		});

		if (!source_item || !item) return false;

		var id = String(item.id);
		var source_id = String(source_item.id);

		var id = this.tree.model.store.getValue(item, 'id');
		var source_id = source.tree.model.store.getValue(source_item, 'id');

		//console.log(id + " " + position + " " + source_id);

		if (source_id.match("FEED:")) {
			return ((id.match("CAT:") && position == "over") ||
				(id.match("FEED:") && position != "over"));
		} else if (source_id.match("CAT:")) {
			return ((id.match("CAT:") && position != "over") ||
				(id.match("root") && position == "over"));
		}
	},
});

