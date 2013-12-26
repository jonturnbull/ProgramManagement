///////////////////////////////////////////////////////////////////////////////
// Fluid UI
// Dependencies: Generics.R1; constants.js
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Fluid class
///////////////////////////////////////////////////////////////////////////////

var Fluid = {

	Constants: {
		COL_TYPE_FORM: "ctf",
		COL_TYPE_LIST: "ctl",
		COL_TYPE_ORGS: "cto",
		FORM_FOOTER_HEIGHT: 65,
		FORM_PADDING_TOP: 10,
		FORM_PADDING_BOTTOM: 20,
		BUTTON_MARGIN: 5
	},

	columns: new Array(),

	init: function() {
		// Expand the container:
		this._nodes.container = DOM.id("fluid-container-div");
		this._nodes.container.style.width = DOM.getWindowWidth() + "px";
		window.onresize = _Fluid_pack;
		// Get a reference to the UI grid:
		this._nodes.grid = DOM.id("fluid-grid");
		// Set defaults:
		Tables.defaultTableClass = "fluid-grid";
		Tables.defaultColClass = "fluid-cell-padded";
	},
	
	pack: function() {
		_Fluid_pack();
	},

	addForm2: function(args) {
		Utils.checkArgs(args, "width", "title");
		return this._addColumn2(args, Fluid.Constants.COL_TYPE_FORM);
	},
	
	addListForm: function(args) {
		Utils.checkArgs(args, "width", "title", "data", "display");
		return this._addColumn2(args, Fluid.Constants.COL_TYPE_LIST);
	},
	
	_addColumn2: function(args, type) {
		Utils.checkArgs(type);
		Utils.checkArgValues(type, Fluid.Constants.COL_TYPE_FORM, Fluid.Constants.COL_TYPE_LIST, Fluid.Constants.COL_TYPE_ORGS);
		var c = {type:args.type};
		this.columns.push(c);
		// Create the column container:
		c.node = DOM.addNode(this._nodes.grid, "td");
		c.node.fluid = this;
		c.node.className = "fluid-col";

		// Create header:
		c.header = {node:DOM.addNode(c.node, "div")};
		c.header.node.wrapper = c.header;
		c.header.node.style.width = args.width+"px";
		if(type == Fluid.Constants.COL_TYPE_LIST) {
			c.header.node.className = "fluid-filter";
			// TODO use Table component
			var table1 = DOM.addNode(c.header.node, "table");
			table1.className = "fluid-grid";
			Fluid_addTitle2({node:table1, text:args.title, subtitle:true});
			// Create the fixed filter section:
			var tr1 = DOM.addNode(table1, "tr");
			var td1 = DOM.addNode(tr1, "td");
			td1.className = "fluid-cell-padded";
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
			input.wrapper = {};
			input.wrapper.clearIconVisible = false;
			input.wrapper.clearIconCell = td4;
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
					if(this.wrapper.clearIconVisible) {
						this.wrapper.clearIconCell.innerHTML = "";
						this.wrapper.clearIconVisible = false;
					}
				}
			};
			input.onkeyup = function() {
				if(!this.wrapper.clearIconVisible && this.value != "") {
					var cIcon = DOM.addNode(this.wrapper.clearIconCell, "img");
					cIcon.src = "../img/icon-clear-filter.png";
					cIcon.className = "pointer";
					cIcon.wrapper = {};
					cIcon.wrapper.input = this;
					cIcon.onclick = function() {
						this.wrapper.input.value = "";
						this.wrapper.input.fluid.clearIconCell.innerHTML = "";
						this.wrapper.input.fluid.clearIconVisible = false;
						this.wrapper.input.focus();
					};
					this.wrapper.clearIconVisible = true;
				}
				else {
					if(this.value == "") {
						this.wrapper.clearIconCell.innerHTML = "";
						this.wrapper.clearIconVisible = false;
					}
				}
			};
		}
		else if(type == Fluid.Constants.COL_TYPE_ORGS) {
		}

		// Create the resizable form section:
		c.form = {node: DOM.addNode(c.node, "div")};
		c.form.node.wrapper = c.form;
		c.form.node.className = "fluid-form";
		c.form.node.style.width = args.width+"px";
		if(type == Fluid.Constants.COL_TYPE_LIST) {
			c.form.node.style.paddingTop = "0px";
			c.form.node.style.paddingBottom = "0px";
		}
		c.form.grid = new Table({attachTo:c.form.node});
		if(type != Fluid.Constants.COL_TYPE_LIST) {
			var row = c.form.grid.addRow();
			c.header.title = Fluid_addTitle({attachTo:row.cols[0].node, text:args.title});			
		}

		// TODO remove
		c.gridNode = c.form.grid.node;		

		// Create the footer section:
		c.footer = {node: DOM.addNode(c.node, "div")};
		c.footer.node.wrapper = c.footer;
		c.footer.node.className = "fluid-footer";
		c.footer.node.style.width = args.width+"px";
		var table = DOM.addNode(c.footer.node, "table");
		table.style.width = "100%";
		table.style.padding = "10px";
		table.style.paddingLeft = "20px";
		table.style.paddingRight = "20px";
		var col = DOM.addNode(table, "tr");
		c.footer._buttonNodeLeft = DOM.addNode(col, "td");
		c.footer._buttonNodeLeft.style.textAlign = "left";
		c.footer._buttonNodeLeft.style.width = "50%";
		c.footer._footerMsg = DOM.addNode(col, "td");
		c.footer._footerMsg.style.textAlign = "center";
		c.footer._footerMsg.style.verticalAlign = "middle";
		c.footer._footerMsg.style.whiteSpace = "nowrap";
		c.footer._buttonNodeRight = DOM.addNode(col, "td");
		c.footer._buttonNodeRight.style.textAlign = "right";
		c.footer._buttonNodeRight.style.width = "50%";
		c.footer.leftButtons = new Array();
		c.footer.rightButtons = new Array();
		
		// Create functions:
		c.footer.addButton = function(args) {
			Utils.checkArgs(args, "name", "type", "side='right'");
			// TODO check allowed button types
			Utils.checkArgValues(args.side, "left", "right");
			var b = {};
			if(args.side == "left") {
				b.node = DOM.addNode(this._buttonNodeLeft, "input");
				b.node.style.marginRight = Fluid.Constants.BUTTON_MARGIN + "px";
				this.leftButtons.push(b);
			}
			else if(args.side == "right") {
				b.node = DOM.addNode(this._buttonNodeRight, "input");
				b.node.style.marginLeft = Fluid.Constants.BUTTON_MARGIN + "px";
				this.rightButtons.push(b);
			}
			else {
				throw new Error(args.side);
			}
			b.node.fluid = this;
			b.node.type = "submit";
			b.node.name = args.name;
			b.node.id = args.name;
			b.node.value = "";
			b.node.className = "button-"+args.type;
			return b;
		};
		
		// Scroll if required:
		this._nodes.container.scrollLeft = 10000;
		return c;
	},
	
	// OLD

	addForm: function(args) {
		Utils.checkArgs(args, "width", "title");
		args.type = Constants.UI.COL_TYPE_FORM;
		var c = this._addColumn(args);
		c._addTitle({node:c.gridNode, text:args.title, isSubtitle:args.isSubtitle});
		return c;
	},
	
	addOrgs: function(args) {
		Utils.checkArgs(args, "width");
		args.createHeader = function(col) {
			// Create the fixed title section:
			col._headerNode = DOM.addNode(col.node, "div");
			col._headerNode.className = "fluid-form";
			col._headerNode.style.width = args.width+"px";
			var table = DOM.addNode(col._headerNode, "table");
			table.className = "fluid-grid";
			var tr = DOM.addNode(table, "tr");
			var td = DOM.addNode(tr, "td");
			td.className = "fluid-cell-padded";
			var div1 = DOM.addNode(td, "div");
			div1.className = "wg-highlight";
			div1.innerHTML = "HOME";
			col._wgGroup = new Widgets.Group({activeClass:"wg-highlight", selectedClass:"wg-highlight-s"});
			col._wgGroup.push(div1);
			DOM.addEvent(div1, "onclick", function() { PMO.displayHome(); });
			var div2 = DOM.addNode(td, "div");
			div2.className = "wg-highlight";
			div2.innerHTML = "PERSONAL";
			col._wgGroup.push(div2);
			DOM.addEvent(div2, "onclick", function() { PMO.displayPersonal(); });
		};
		args.type = Constants.UI.COL_TYPE_ORGS;
		var c = this._addColumn(args);
		c._addTitle({node: c.gridNode, text: "Organisations", align: "center"});
		// Create main section:
		var tr = DOM.addNode(c.gridNode, "tr");
		var td = DOM.addNode(tr, "td");
		td.className = "fluid-cell-padded";
		var div1 = DOM.addNode(td, "div");
		div1.innerHTML = "FT Consulting";
		c._wgGroup.push(div1);
		DOM.addEvent(div1, "onclick", function() { PMO.displayOrg(1); });
		var div2 = DOM.addNode(td, "div");
		div2.innerHTML = "Innovair";
		c._wgGroup.push(div2);
		DOM.addEvent(div2, "onclick", function() { PMO.displayOrg(2); });
		var div3 = DOM.addNode(td, "div");
		div3.innerHTML = "RedFly";
		c._wgGroup.push(div3);
		DOM.addEvent(div3, "onclick", function() { PMO.displayOrg(3); });
		// Create the footer section:
		c.addButton({name:"b-p-add", type:"add"});
		return c;
	},
	
	addList: function(args) {
		Utils.checkArgs(args, "width", "title", "data", "display");
		args.createHeader = function(col) {
			// Create the fixed title section:
			col._headerNode = DOM.addNode(col.node, "div");
			col._headerNode.className = "fluid-filter";
			col._headerNode.style.width = args.width+"px";
			var table1 = DOM.addNode(col._headerNode, "table");
			table1.className = "fluid-grid";
			col._addTitle({node: table1, text: args.title, isSubtitle: true});
			// Create the fixed filter section:
			var tr1 = DOM.addNode(table1, "tr");
			var td1 = DOM.addNode(tr1, "td");
			td1.className = "fluid-cell-padded";
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
		c.node.className = "fluid-col";
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
		c.gridNode.className = "fluid-grid";
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
	},
	
	// Objects:
	Button: function(args) {
		
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
	if(Utils.not(type)) {
		throw new Error("column type is a required argument");
	}

	this.addLabel = function(args) {
		Utils.checkArgs(args, "text");
		var label = new FluidComponent(this);
		this._components.push(label);
		var tr = DOM.addNode(this.gridNode, "tr");
		var td = DOM.addNode(tr, "td");
		td.className = "form-c-label";
		if(args.href) {
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
		Utils.checkArgs(args, "name", "text");
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
	
	this.addButtonGrid = function(buttons) {
		Utils.checkArgs(buttons);
		var bg = new FluidComponent(this);
		this._components.push(bg);		
		var tr1 = DOM.addNode(this.gridNode, "tr");
		var td1 = DOM.addNode(tr1, "td");
		td1.className = "form-c-label";
		var wgBg = new Widgets.ButtonGrid({attachTo:td1, buttons:buttons});
	}

	this.addButton = function(args) {
		Utils.checkArgs(args, "name", "type", "side='right'");
		// TODO check allowed button types
		Utils.checkArgValues(args.side, "left", "right");
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


function Fluid_addTitle(args) {
	var title = {};
	title.node = DOM.addNode(args.attachTo, "div");
	if(args.subtitle) {
		title.node.className = "fluid-c-subtitle";
	}
	else {
		title.node.className = "fluid-c-title";
	}
	title.node.innerHTML = args.text;
	title.node.wrapper = title;
	return title;
}

function Fluid_addTitle2(args) {
	var tr = DOM.addNode(args.node, "tr");
	var title = {};
	title.node = DOM.addNode(tr, "td");
	if(args.isSubtitle) {
		title.node.className = "form-c-subtitle";
	}
	else {
		title.node.className = "form-c-title";
	}
	title.node.innerHTML = args.text;
	title.node.wrapper = title;
	return title;
}

