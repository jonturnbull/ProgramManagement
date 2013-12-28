///////////////////////////////////////////////////////////////////////////////
// Fluid UI
// Dependencies: Generics.R1; constants.js
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Fluid class
///////////////////////////////////////////////////////////////////////////////

var Fluid = {

	Constants: {
		formFooterHeight: 65,
		formPaddingTop: 10,
		formPaddingBottom: 20,
		buttonMargin: 5
	},

	columns: new Array(),

	init: function() {
		// Expand the container:
		this._nodes.container = DOM.id("fluid-container-div");
		this._nodes.container.style.width = DOM.getWindowWidth() + "px";
		window.onresize = Fluid.pack;
		// Get a reference to the UI grid:
		this._nodes.grid = DOM.id("fluid-grid");
		// Set defaults:
		Widgets.Constants.defaultTableClass = "fluid-grid";
		Widgets.Constants.defaultColClass = "fluid-cell-padded";
	},

	pack: function() {
		Fluid._nodes.container.style.width = DOM.getWindowWidth() + "px";
		for(var i=0; i<Fluid.columns.length; i++) {
			var c = Fluid.columns[i];
			// Calculate the maximum allowed height:
			var maxHeight = DOM.getWindowHeight() - DOM.id("header").offsetHeight - DOM.id("footer").offsetHeight - c.footer.node.offsetHeight - 1;
			if(c.header.node) {
				maxHeight -= c.header.node.offsetHeight;
			}
			if(DOM.getSize(c.form.node).height > maxHeight) {
				// The height style value must not include padding.
				// Note that list columns have no top or bottom padding.
				var styleHeight = maxHeight;
				if(c.type.form) {
					styleHeight -= (Fluid.Constants.formPaddingTop + Fluid.Constants.formPaddingBottom);
				}
				c.form.node.style.height = styleHeight+"px";
			}
			else {
				c.form.node.style.height = "";
			}
		}
	},

	addForm: function(args) {
		Utils.checkArgs(args, "width", "title");
		return this._addColumn(args, {form:true});
	},
	
	addListForm: function(args) {
		Utils.checkArgs(args, "width", "title", "data", "display");
		return this._addColumn(args, {list:true});
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

	_addColumn: function(args, type) {
		Utils.checkArgs(type);
		var c = {type:type};
		this.columns.push(c);
		// Create the column container:
		c.node = DOM.addNode(this._nodes.grid, "td");
		c.node.fluid = this;
		c.node.className = "fluid-col";

		// Create header:
		c.header = {node:DOM.addNode(c.node, "div")};
		c.header.node.wrapper = c.header;
		c.header.node.style.width = args.width+"px";
		if(c.type.list) {
			c.header.node.className = "fluid-filter-header";
			c.header.grid = new Widgets.Table().attachTo(c.header.node);
			c.header.grid.addRow().last().addTitle({text:args.title, subtitle:true});
			// Create the filter section:
			var headerDiv = DOM.addNode(c.header.grid.addRow().last().node, "div");
			headerDiv.className = "fluid-filter-box";
			var table2 = DOM.addNode(headerDiv, "table");
			//TODO remove table2.className = "form-grid";
			var tr2 = DOM.addNode(table2, "tr");
			var td2 = DOM.addNode(tr2, "td");
			var td3 = DOM.addNode(tr2, "td");
			td3.style.width = "100%";
			var td4 = DOM.addNode(tr2, "td");
			td4.style.verticalAlign = "middle";
			td2.className = td3.className = td4.className = "fluid-filter-cell";
			var sIcon = DOM.addNode(td2, "img");
			sIcon.src = "../img/icon-search.png";
			var input = DOM.addNode(td3, "input");
			input.wrapper = {};
			input.wrapper.clearIconVisible = false;
			input.wrapper.clearIconCell = td4;
			input.type = "text";
			input.className = "fluid-filter-input fnt-filter-input";
			input.value = Locale.filterResults;
			input.onfocus = function() {
				if(input.value == Locale.filterResults) {
					input.value = "";
					input.className = "fluid-filter-input fnt-normal";
				}
			};
			input.onblur = function() {
				if(!input.value) {
					input.value = Locale.filterResults;
					input.className = "fluid-filter-input fnt-filter-input";
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

		// Create the resizable form section:
		c.form = {node: DOM.addNode(c.node, "div")};
		c.form.node.wrapper = c.form;
		c.form.node.className = "fluid-form";
		c.form.node.style.width = args.width+"px";
		if(c.type.list) {
			c.form.node.style.paddingTop = "0px";
			c.form.node.style.paddingBottom = "0px";
		}
		c.form.grid = new Widgets.Table().attachTo(c.form.node);
		if(c.type.form) {
			var row = c.form.grid.addRow();
			row.last().addTitle({text:args.title});
		}
		
		// Display data (if list):
		if(c.type.list) {
			c.form.list = {data:args.data, group:new Group({activeClass:"fluid-list-cell", selectedClass:"fluid-list-cell-s"})};
			for(var i=0; i<args.data.length; i++) {
				var item = args.data[i];
				var row = c.form.grid.addRow();
				var node = row.last().node;
				node.className = "fluid-list-cell";
				if(i == args.data.length-1) {
					node.style.borderBottom = "none";
				}
				args.display(node, item);
				c.form.list.group.push(node);
			}
		}

		// Create the footer section:
		c.footer = {node: DOM.addNode(c.node, "div")};
		c.footer.node.wrapper = c.footer;
		c.footer.node.className = "fluid-footer";
		c.footer.node.style.width = args.width+"px";
		c.footer.grid = new Widgets.Table({numCols:3, tableClass:false, colClass:false}).attachTo(c.footer.node);
		c.footer.grid.node.style.width = "100%";
		c.footer.grid.node.style.padding = "10px";
		c.footer.grid.node.style.paddingLeft = "20px";
		c.footer.grid.node.style.paddingRight = "20px";
		var row = c.footer.grid.addRow();
		row.cols[0].node.style.textAlign = "left";
		row.cols[0].node.style.width = "50%";
		row.cols[1].node.style.textAlign = "center";
		row.cols[1].node.style.verticalAlign = "middle";
		row.cols[1].node.style.whiteSpace = "nowrap";
		row.cols[2].node.style.textAlign = "right";
		row.cols[2].node.style.width = "50%";
		c.footer.leftButtons = new Array();
		c.footer.rightButtons = new Array();

		// Create functions:
		c.footer.addButton = function(args) {
			Utils.checkArgs(args, "name", "type", "side='right'");
			// TODO check allowed button types
			Utils.checkArgValues(args.side, "left", "right");
			var b = {};
			if(args.side == "left") {
				b.node = DOM.addNode(this.grid.rows[0].cols[0].node, "input");
				b.node.style.marginRight = Fluid.Constants.buttonMargin + "px";
				this.leftButtons.push(b);
			}
			else if(args.side == "right") {
				b.node = DOM.addNode(this.grid.rows[0].cols[2].node, "input");
				b.node.style.marginLeft = Fluid.Constants.buttonMargin + "px";
				this.rightButtons.push(b);
			}
			else {
				throw new Error(args.side);
			}
			b.node.wrapper = b.node;
			b.node.type = "submit";
			b.node.name = args.name;
			b.node.id = args.name;
			b.node.value = "";
			b.node.className = "button-"+args.type;
			return b;
		};
		
		// Create list footer:
		if(c.type.list) {
			c.footer.grid.last().cols[1].node.innerHTML = "Page 1 of 1";
			c.footer.addButton({name:"b-p-next", type:"next-inactive"});
			c.footer.addButton({name:"b-p-add", type:"add"});
			c.footer.addButton({name:"b-p-prev", type:"prev-inactive", side:"left"});
		}
		
		// Scroll if required:
		this._nodes.container.scrollLeft = 10000;
		return c;
	}
};

