///////////////////////////////////////////////////////////////////////////////
// Fluid UI
// Dependencies: Generics.R1; constants.js
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Fluid class
///////////////////////////////////////////////////////////////////////////////

var Fluid = {

	Constants: {
		gridView: {tableClass:"fluid-grid", colClass:"fluid-cell-view"},
		gridEdit: {tableClass:"fluid-grid", colClass:"fluid-cell-edit"},
		colPadding: 20,
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
	},

	pack: function() {
		Fluid._nodes.container.style.width = DOM.getWindowWidth() + "px";
		for(var i=0; i<Fluid.columns.length; i++) {
			Fluid.packColumn(Fluid.columns[i]);
		}
	},
	
	// TODO make this a col function
	packColumn: function(c) {
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
	},

	addColumn: function(args) {
		Utils.checkArgs(args, "width", "title");
		return this._addColumn(args, {form:true});
	},
	
	addListColumn: function(args) {
		Utils.checkArgs(args, "width", "title", "data", "render");
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
	
	edit: function(c) {
		if(c.type.list) {
			throw new Error("cannot edit list column");
		}
		// Header:
		DOM.releaseChildren(c.header.node);
		c.header.node.innerHTML = "Editing";
		c.header.node.className = "fluid-edit";
		c.header.node.style.width = DOM.getStyleSize({size:c.width, padding:20}) + "px";
		// Form:
		DOM.release(c.form.grid.node);
		c.form.grid = new Widgets.Table(Fluid.Constants.gridEdit).attachTo(c.form.node);
		// Footer:
		while(c.footer.leftButtons.length > 0) {
			var b = c.footer.leftButtons.pop();
			DOM.release(b.node);
		}
		while(c.footer.rightButtons.length > 0) {
			var b = c.footer.rightButtons.pop();
			DOM.release(b.node);
		}
		return c;
	},
	
	// PRIVATE:
	_nodes: {},

	_addColumn: function(args, type) {
		Utils.checkArgs(type);
		var c = {type:type, width:args.width};
		this.columns.push(c);
		// Create the column container:
		c.node = DOM.addNode(this._nodes.grid, "td");
		c.node.fluid = this;
		c.node.className = "fluid-col";

		// Function needed internally:
		c.getMaxNodeWidth = function(args) {
			args = Utils.not(args) ? {} : args;
			Utils.checkArgs(args, "border=0", "padding=0");
			args.size = this.width;
			args.padding += Fluid.Constants.colPadding;
			return DOM.getStyleSize(args);
		};
		
		// Create header:
		c.header = {node:DOM.addNode(c.node, "div")};
		c.header.node.wrapper = c.header;
		c.header.node.style.width = args.width+"px";
		if(c.type.list) {
			c.header.node.className = "fluid-filter-header";
			c.header.grid = new Widgets.Table(Fluid.Constants.gridView).attachTo(c.header.node);
			c.header.grid.addRow().last().addTitle({text:args.title, subtitle:true});
			// Create the filter section:
			var filterDiv = DOM.addNode(c.header.grid.addRow().last().node, "div");
			filterDiv.className = "fluid-filter-box";
			filterDiv.style.width = c.getMaxNodeWidth({border:1}) + "px";
			var table = new Widgets.Table({numCols:3}).attachTo(filterDiv);
			var row = table.addRow();
			row.cols[1].node.style.width = "100%";
			row.cols[2].node.style.verticalAlign = "middle";
			for(var i=0; i<row.cols.length; i++) {
				row.cols[i].node.className = "fluid-filter-cell";
			}
			var sIcon = DOM.addNode(row.cols[0].node, "img");
			sIcon.src = "../img/icon-search.png";
			var input = DOM.addNode(row.cols[1].node, "input");
			input.wrapper = {};
			input.wrapper.clearIconVisible = false;
			input.wrapper.clearIconCell = row.cols[2].node;
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
		c.form.grid = new Widgets.Table(Fluid.Constants.gridView).attachTo(c.form.node);
		if(c.type.form) {
			var row = c.form.grid.addRow();
			row.last().addTitle({text:args.title});
		}
		
		// Render data (if list):
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
				args.render(node, item);
				c.form.list.group.push(node);
			}
		}

		// Create the footer section:
		c.footer = {node: DOM.addNode(c.node, "div")};
		c.footer.node.wrapper = c.footer;
		c.footer.node.className = "fluid-footer";
		c.footer.node.style.width = args.width+"px";
		c.footer.grid = new Widgets.Table({numCols:3}).attachTo(c.footer.node);
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

		// Footer functions:
		c.footer.addButton = function(args) {
			Utils.checkArgs(args, "name=DOM.generateId()", "type", "side='right'");
			// TODO check allowed button types
			Utils.checkArgValues(args.side, "left", "right");
			var b = {fluidColumn:c};
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
			b.node.wrapper = b;
			b.node.type = "submit";
			b.node.name = args.name;
			b.node.id = args.name;
			b.node.value = "";
			b.node.className = "button-"+args.type;
			if(args.onclick) {
				DOM.addEvent(b.node, "onclick", args.onclick);
			}
			return b;
		};
		
		// List footer:
		if(c.type.list) {
			c.footer.grid.last().cols[1].node.innerHTML = "Page 1 of 1";
			c.footer.addButton({type:"next-inactive"});
			c.footer.addButton({type:"add"});
			c.footer.addButton({type:"prev-inactive", side:"left"});
		}
		
		// Any additional functions:
		if(c.type.form) {
			c.edit = function() {
				DOM.release(this.node);
			};
		}
		
		// Scroll if required:
		this._nodes.container.scrollLeft = 10000;
		return c;
	}
};

