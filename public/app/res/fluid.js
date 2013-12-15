///////////////////////////////////////////////////////////////////////////////
// Fluid UI
// Dependencies: Generics.R1; constants.js
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Fluid class
///////////////////////////////////////////////////////////////////////////////

var Fluid = {

	columns: new Array(),

	init: function() {
		// Expand the container:
		this._nodes.container = DOM.id("fluid-container-div");
		this._nodes.container.style.width = DOM.getWindowWidth() + "px";
		window.onresize = _Fluid_pack;
		// Get a reference to the UI grid:
		this._nodes.grid = DOM.id("fluid-grid");
	},
	
	pack: function() {
		_Fluid_pack();
	},

	addForm: function(args) {
		Utils.checkMandatoryArgs(args, ["width", "title"]);
		args.type = Constants.UI.COL_TYPE_FORM;
		var c = this._addColumn(args);
		c._addTitle({node: c.gridNode, text: args.title});
		return c;
	},
	
	addOrgs: function(args) {
		Utils.checkMandatoryArgs(args, ["width"]);
		args.createHeader = function(col) {
			// Create the fixed title section:
			col._headerNode = DOM.addNode(col.node, "div");
			col._headerNode.className = "fluid-form";
			col._headerNode.style.width = args.width+"px";
			var table = DOM.addNode(col._headerNode, "table");
			table.className = "form-grid";
			var tr = DOM.addNode(table, "tr");
			var td = DOM.addNode(tr, "td");
			td.className = "form-c";
			var div1 = DOM.addNode(td, "div");
			div1.className = "wg-highlight";
			div1.innerHTML = "HOME";
			var div2 = DOM.addNode(td, "div");
			div2.className = "wg-highlight";
			div2.innerHTML = "PERSONAL";
		};
		args.type = Constants.UI.COL_TYPE_ORGS;
		var c = this._addColumn(args);
		c._addTitle({node: c.gridNode, text: "Organisations", align: "center"});
		// Create main section:
		var tr = DOM.addNode(c.gridNode, "tr");
		var td = DOM.addNode(tr, "td");
		td.className = "form-c";
		var wgGroup = new Widgets.Group({activeClass:"wg-highlight", selectedClass:"wg-highlight-selected"});
		var div1 = DOM.addNode(td, "div");
		div1.innerHTML = "FT Consulting";
		wgGroup.push(div1);
		DOM.addEvent(div1, "onclick", function() { PMO.displayOrg(1); });
		var div2 = DOM.addNode(td, "div");
		div2.innerHTML = "Innovair";
		wgGroup.push(div2);
		DOM.addEvent(div2, "onclick", function() { PMO.displayOrg(2); });
		var div3 = DOM.addNode(td, "div");
		div3.innerHTML = "RedFly";
		wgGroup.push(div3);
		DOM.addEvent(div3, "onclick", function() { PMO.displayOrg(3); });
		// Create the footer section:
		c.addButton({name:"b-p-add", type:"add"});
		return c;
	},
	
	addList: function(args) {
		Utils.checkMandatoryArgs(args, ["width", "title", "data", "display"]);
		args.createHeader = function(col) {
			// Create the fixed title section:
			col._headerNode = DOM.addNode(col.node, "div");
			col._headerNode.className = "fluid-filter";
			col._headerNode.style.width = args.width+"px";
			var table1 = DOM.addNode(col._headerNode, "table");
			table1.className = "form-grid";
			col._addTitle({node: table1, text: args.title, isSubtitle: true});
			// Create the fixed filter section:
			var tr1 = DOM.addNode(table1, "tr");
			var td1 = DOM.addNode(tr1, "td");
			td1.className = "form-c";
			var headerDiv = DOM.addNode(td1, "div");
			headerDiv.className = "wg-filter";
			var table2 = DOM.addNode(headerDiv, "table");
			table2.className = "form-grid";
			var tr2 = DOM.addNode(table2, "tr");
			var td2 = DOM.addNode(tr2, "td");
			var td3 = DOM.addNode(tr2, "td");
			td3.style.width = "100%";
			var td4 = DOM.addNode(tr2, "td");
			td4.style.verticalAlign = "middle";
			td2.className = td3.className = td4.className = "wg-filter-c";
			var sIcon = DOM.addNode(td2, "img");
			sIcon.src = "../img/icon-search.png";
			var input = DOM.addNode(td3, "input");
			input.fluid = {};
			input.fluid.clearIconVisible = false;
			input.fluid.clearIconCell = td4;
			input.type = "text";
			input.className = "wg-filter-input fnt-filter-input";
			input.value = Constants.Locale.FILTER_RESULTS;
			input.onfocus = function() {
				if(input.value == Constants.Locale.FILTER_RESULTS) {
					input.value = "";
					input.className = "wg-filter-input fnt-normal";
				}
			};
			input.onblur = function() {
				if(!input.value) {
					input.value = Constants.Locale.FILTER_RESULTS;
					input.className = "wg-filter-input fnt-filter-input";
					if(this.fluid.clearIconVisible) {
						this.fluid.clearIconCell.innerHTML = "";
						this.fluid.clearIconVisible = false;
					}
				}
			};
			input.onkeyup = function() {
				if(!this.fluid.clearIconVisible && this.value != "") {
					var cIcon = DOM.addNode(this.fluid.clearIconCell, "img");
					cIcon.src = "../img/icon-clear-filter.png";
					cIcon.className = "pointer";
					cIcon.fluid = {};
					cIcon.fluid.input = this;
					cIcon.onclick = function() {
						this.fluid.input.value = "";
						this.fluid.input.fluid.clearIconCell.innerHTML = "";
						this.fluid.input.fluid.clearIconVisible = false;
						this.fluid.input.focus();
					};
					this.fluid.clearIconVisible = true;
				}
				else {
					if(this.value == "") {
						this.fluid.clearIconCell.innerHTML = "";
						this.fluid.clearIconVisible = false;
					}
				}
			};
		};
		args.isList = true;
		args.type = Constants.UI.COL_TYPE_LIST;
		var c = this._addColumn(args);
		// Create the footer section:
		c._footerMsg.innerHTML = "Page 1 of 1";
		c.addButton({name:"b-p-next", type:"next-inactive"});
		c.addButton({name:"b-p-add", type:"add"});
		c.addButton({name:"b-p-prev", type:"prev-inactive", side:"left"});
		// Create the data section:
		for(var i=0; i<args.data.length; i++) {
			var item = args.data[i];
			var tr = DOM.addNode(c.gridNode, "tr");
			var td = DOM.addNode(tr, "td");
			td.className = "wg-list-c";
			if(i == args.data.length-1) {
				td.style.borderBottom = "none";
			}
			args.display(td, item);
		}
		return c;
	},
	
	releaseFrom: function(index) {
		if(index < 1) {
			throw "index out of bounds: "+index;
		}
		if(index == 1) {
			throw "cannot release first column (Organisations)";
		}
		while(this.columns.length > index-1) {
			var col = this.columns.pop();
			col.node.innerHTML = "";
			col.node.parentNode.removeChild(col.node);
			col.node = null;
		}
	},
	
	// PRIVATE:
	_nodes: {},
	
	_addColumn: function(args) {
		var c = new Column(args.type);
		this.columns.push(c);
		// Create the column container:
		c.node = DOM.addNode(this._nodes.grid, "td");
		c.node.fluid = this;
		c.node.className = "fluid-grid-col";
		// Placeholder for the header if required:
		if(args.createHeader) {
			args.createHeader(c);
		}
		// Create the resizable form section:
		c._formNode = DOM.addNode(c.node, "div");		
		c._formNode.className = "fluid-form";
		c._formNode.style.width = args.width+"px";
		if(args.isList) {
			c._formNode.style.paddingTop = "0px";
			c._formNode.style.paddingBottom = "0px";
		}
		c.gridNode = DOM.addNode(c._formNode, "table");
		c.gridNode.className = "form-grid";
		// Create the footer section:
		c._footerNode = DOM.addNode(c.node, "div");
		c._footerNode.className = "fluid-footer";
		c._footerNode.style.width = args.width+"px";
		var table = DOM.addNode(c._footerNode, "table");
		table.style.width = "100%";
		table.style.padding = "10px";
		table.style.paddingLeft = "20px";
		table.style.paddingRight = "20px";
		var col = DOM.addNode(table, "tr");
		c._buttonNodeLeft = DOM.addNode(col, "td");
		c._buttonNodeLeft.style.textAlign = "left";
		c._buttonNodeLeft.style.width = "50%";
		c._footerMsg = DOM.addNode(col, "td");
		c._footerMsg.style.textAlign = "center";
		c._footerMsg.style.verticalAlign = "middle";
		c._footerMsg.style.whiteSpace = "nowrap";
		c._buttonNodeRight = DOM.addNode(col, "td");
		c._buttonNodeRight.style.textAlign = "right";
		c._buttonNodeRight.style.width = "50%";
		c.leftButtons = Array();
		c.rightButtons = Array();
		// Scroll if required:
		this._nodes.container.scrollLeft = 10000;
		return c;
	}
};

// To be called by window.resize:
function _Fluid_pack() {
	Fluid._nodes.container.style.width = DOM.getWindowWidth() + "px";
	for(var i=0; i<Fluid.columns.length; i++) {
		var c = Fluid.columns[i];
		// Calculate the maximum allowed height:
		var maxHeight = DOM.getWindowHeight() - DOM.id("header").offsetHeight - DOM.id("footer").offsetHeight - c._footerNode.offsetHeight - 1;
		if(c._headerNode) {
			maxHeight -= c._headerNode.offsetHeight;
		}
		if(DOM.getSize(c._formNode).height > maxHeight) {
			// The height style value must not include padding.
			// Note that list columns have no top or bottom padding.
			var styleHeight = maxHeight;
			if(c._type != Constants.UI.COL_TYPE_LIST) {
				styleHeight -= (Constants.UI.FORM_PADDING_TOP + Constants.UI.FORM_PADDING_BOTTOM);
			}
			c._formNode.style.height = styleHeight+"px";
		}
		else {
			c._formNode.style.height = "";
		}
	}
}

function Column(type) {

	if(Utils.isNull(type)) {
		throw "column type is a required argument";
	}

	this.addLabel = function(args) {
		if(Utils.isNull(args.text)) {
			throw "'text' is a required argument";
		}
		var label = new FluidComponent(this);
		this._components.push(label);
		var tr = DOM.addNode(this.gridNode, "tr");
		var td = DOM.addNode(tr, "td");
		td.className = "form-c-label";
		if(!Utils.isNull(args.href)) {
			label.node = DOM.addNode(td, "a");
			label.node.href = args.href;
			label.node.target = "_blank";
		}
		else {
			label.node = td;
		}
		label.node.innerHTML = args.text;
		label.node.fluid = label;
		return label;
	};
	
	this.addDropDown = function(args) {
		if(Utils.isNull(args.name)) {
			throw "'name' is a required argument";
		}
		if(Utils.isNull(args.text)) {
			throw "'text' is a required argument";
		}
		var dd = new FluidComponent(this);
		this._components.push(dd);
		var tr1 = DOM.addNode(this.gridNode, "tr");
		var td1 = DOM.addNode(tr1, "td");
		td1.className = "form-c-label";
		dd.node = DOM.addNode(td1, "table");
		dd.node.id = args.name
		dd.node.className = "wg-ddown-table pointer";
		var tr2 = DOM.addNode(dd.node, "tr");
		var td2 = DOM.addNode(tr2, "td");
		td2.className = "wg-ddown-td";
		td2.innerHTML = args.text;
		var td3 = DOM.addNode(tr2, "td");
		td3.style.textAlign = "right";
		td3.style.verticalAlign = "middle";
		var img = DOM.addNode(td3, "img");
		img.src = "../img/wg-dropdown-arrow.png";
		dd.node.fluid = dd;
		return dd;
	};

	this.addButton = function(args) {
		if(Utils.isNull(args.name)) {
			throw "'name' is a required argument";
		}
		if(Utils.isNull(args.type)) {
			throw "'type' is a required argument";
		}
		// TODO check allowed button types
		if(Utils.isNull(args.side)) {
			args.side = "right";
		}
		if(!Utils.checkArgValues(args.side, ["left", "right"])) {
			throw "illegal 'side' argument: "+args.side;
		}
		var b = new FluidComponent(this);
		this._components.push(b);
		if(args.side == "left") {
			b.node = DOM.addNode(this._buttonNodeLeft, "input");
			b.node.style.marginRight = Constants.UI.BUTTON_MARGIN + "px";
			this.leftButtons.push(b);
		}
		else if(args.side == "right") {
			b.node = DOM.addNode(this._buttonNodeRight, "input");
			b.node.style.marginLeft = Constants.UI.BUTTON_MARGIN + "px";
			this.rightButtons.push(b);
		}
		else {
			throw "integrity issue: "+args.side;
		}
		b.node.fluid = this;
		b.node.type = "submit";
		b.node.name = args.name;
		b.node.id = args.name;
		b.node.value = "";
		b.node.className = "button-"+args.type;
		return b;
	};

	// PRIVATE:
	this._components = Array();
	this._type = type;

	this._getPadding = function() {
		if(this._headerNode) {
			// List form does not have padding at the top or bottom:
			return 0;
		}
		else {
			return Constants.UI.FORM_PADDING_TOP + Constants.UI.FORM_PADDING_BOTTOM;
		}
	};
	
	this._getMaxFormHeight = function() {
		var maxHeight = DOM.getWindowHeight() - DOM.id("header").offsetHeight - DOM.id("footer").offsetHeight - this._footerNode.offsetHeight - 1;
		if(this._headerNode) {
			maxHeight -= this._headerNode.offsetHeight;
		}
		return maxHeight;
	};
	
	this._addTitle = function(args) {
		var title = new FluidComponent(this);
		this._components.push(args.text);
		var tr = DOM.addNode(args.node, "tr");
		title.node = DOM.addNode(tr, "td");
		if(args.isSubtitle) {
			title.node.className = "form-c-subtitle";
		}
		else {
			title.node.className = "form-c-title";
		}
		title.node.innerHTML = args.text;
		title.node.fluid = title;
		if(args.align == "center") {
			title.node.style.textAlign= "center";
		}
		return title;
	};

	return this;
}


function FluidComponent(parent) {
	this.column = parent;
	return this;
}
