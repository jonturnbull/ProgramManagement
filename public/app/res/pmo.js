
var PMO = {

	listOrgs: function() {
		Fluid.releaseFrom(1);
		var f = Fluid.addForm({width:250, title:"Organisations"});
		f.form.grid.rows[0].cols[0].node.children[0].style.textAlign = "center";

		// Create Home and Personal links:
		f.header.node.className = "fluid-form";
		f.header.grid = new Widgets.Table(Fluid.Constants.gridView).attachTo(f.header.node);
		var row = f.header.grid.addRow();
		var block = row.cols[0].addBlock({text:"HOME"});
		block.node.onclick = function() {
			PMO.viewHome();
		}
		f.blockGroup = new Group({widget:"block"});
		f.blockGroup.push(block.node);
		block = row.cols[0].addBlock({text:"PERSONAL"});
		block.node.onclick = function() {
			PMO.viewPersonal();
		}
		f.blockGroup.push(block.node);
		
		// List organisations:
		row = f.form.grid.addRow();
		var request = new AjaxRequest2({
			url: "../tmp/organisations.json",
			method: "get",
			async: true,
			onSuccess: function(data) {
				for(var i=0; i<data.length; i++) {
					var org = data[i];
					block = row.cols[0].addBlock({text:org.name});
					block.id = org.id;
					block.node.onclick = function(node) {
						PMO.viewOrg(node.wrapper.id);
					}
					f.blockGroup.push(block.node);
				}
			},
			onFailure: null
		});
		request.send();

		// Add buttons to footer:
		f.footer.addButton({name:"b-p-add", type:"add"});
	},

	viewHome: function() {
		Fluid.releaseFrom(2);
		Fluid.addForm({width:500, title:"Home"});
	},

	viewPersonal: function() {
		Fluid.releaseFrom(2);
		//Fluid.addForm({width:500, title:"Personal"});
		PMO.viewProject(1);
	},
	
	viewOrg: function(org) {
		Fluid.releaseFrom(2);
		var request = new AjaxRequest2({
			url: "../tmp/org-"+org+".json",
			method: "get",
			async: true,
			onSuccess: function(data) {
				var org = data[0];
				var f = Fluid.addForm({width:280, title: org.name});
				var buttons = new Array();
				buttons.push({text:"Programs", action:function() {
					// TODO org.id is incorrect
					PMO.listPrograms(org.id);
				}});
				buttons.push({text:"People", action:function() {
					PMO.listPeople(org.id);
				}});
				var row = f.form.grid.addRow();
				row.last().addButtonGrid({buttons:buttons});
				row = f.form.grid.addRow();
				row.last().addText({text:org.domain, href:"http://"+org.domain});
				row.last().addText({text:org.employees+" employees"});
				//row = f.form.grid.addRow();
				row.last().addText({text:org.description});
				f.footer.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.footer.addButton({name:"b-org-h", type:"history"});
				f.footer.addButton({name:"b-org-leave", type:"leave", side:"left"});
			},
			onFailure: null
		});
		request.send();
	},
	
	listPrograms: function(org) {
		Fluid.releaseFrom(3);
		// TODO this needs to come from JSON
		var data = new Array();
		data.push({id:1, name:"Digital Presence", projects:3});
		f = Fluid.addListForm({width:430, title:"Programs", data:data, render:function(node, item) {
			node.onclick = function() {
				PMO.viewProgram(item.id);
			}
			var table = new Widgets.Table().attachTo(node);
			var row = table.addRow();
			//row.cols[0].node.style.paddingBottom = "0px";
			row.last().addText({text:item.name, title:true, margin:3});
			row.last().addText({text:item.projects + " projects"});
		}});
	},
	
	listPeople: function(org) {
		Fluid.releaseFrom(3);
		Fluid.addForm({width:280, title:"People"});
	},
	
	viewProgram: function(id) {
		Fluid.releaseFrom(4);
		var request = new AjaxRequest2({
			url: "../tmp/program-"+id+".json",
			method: "get",
			async: true,
			onSuccess: function(data) {
				var p = data[0];
				var f = Fluid.addForm({width:280, title:p.name});
				var buttons = new Array();
				buttons.push({text:"Projects", action:function() {
					PMO.listProjects(p.id);
				}});
				buttons.push({text:"Status", action:function() {
					alert("Not set!");
				}});
				f.form.grid.addRow().last().addButtonGrid({buttons:buttons});
				f.form.grid.addRow().last().addText({text:p.description});
				f.footer.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.footer.addButton({name:"b-org-h", type:"history"});
			},
			onFailure: null
		});
		request.send();
	},
	
	listProjects: function(id) {
		Fluid.releaseFrom(5);
		// TODO this needs to come from JSON
		var data = new Array();
		data.push({id: 1, name: "Web Billing Platform", people: 5, startDate: "12 August", endDate: "18 October"});
		data.push({id: 2, name: "Back Office API", people: 0, startDate: "5 October 2012", endDate: "25 November 2013"});
		data.push({id: 3, name: "E-Commerce Business Case", people: 2, startDate: "4 April", endDate: "12 June"});
		f = Fluid.addListForm({width:430, title:"Projects", data:data, render:function(node, item) {
			node.onclick = function() {
				PMO.viewProject(item.id);
			}
			var table = new Widgets.Table().attachTo(node);
			var row = table.addRow();
			row.last().addText({text:item.name, title:true, margin:3});
			row.last().addText({text:item.people? item.people+" people" : "Open to all employees", margin:3});
			row.last().addText({text:item.startDate + " to " + item.endDate});
		}});
	},
	
	viewProject: function(id) {
		Fluid.releaseFrom(6);
		var request = new AjaxRequest2({
			url: "../tmp/project-"+1+".json",
			method: "get",
			async: true,
			onSuccess: function(data) {
				var p = data[0];
				var f = Fluid.addForm({width:280, title:p.name});
				var buttons = new Array();
				buttons.push({text:"Status", action:function() {
					PMO.viewStatus(p.id);
				}});
				buttons.push({text:"Risks", action:function() {
					alert("Not set!");
				}});
				buttons.push({text:"Issues", action:function() {
					alert("Not set!");
				}});
				var row = f.form.grid.addRow();
				row.last().addButtonGrid({buttons:buttons});
				row = f.form.grid.addRow();
				row.last().addText({text:p.description});
				row = f.form.grid.addRow();
				row.last().addLabel({text:"Start Date", float:true});
				row.last().addText({text:p.startDate});
				row.last().addLabel({text:"Planned End Date", float:true});
				row.last().addText({text:p.endDate});
				row = f.form.grid.addRow();
				row.last().addUserBlock({type:"label", text:"Project Managers"});
				row.last().addUserBlock({type:"company", text:"Anna Fiore"});
				row.last().addUserBlock({type:"external", text:"AJ"});
				row.last().addUserBlock({type:"company", text:"Carlo Abruzzo"});
				row.last().addUserBlock({type:"external", text:"John Cutler"});
				row = f.form.grid.addRow();
				row.last().addUserBlock({type:"label", text:"Project Team"});
				row.last().addUserBlock({type:"group", text:"Innovair"});
				// Footer buttons:
				f.footer.addButton({name:"b-org-edit", type:"edit", side:"right", onclick:function(node) {
					PMO.editProject(p, node.wrapper.fluidColumn);
				}});
				f.footer.addButton({name:"b-org-h", type:"history"});
			},
			onFailure: null
		});
		request.send();
	},
	
	editProject: function(p, c) {
		c = Fluid.edit(c);
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Title", mandatory:true});
		var wg = row.last().addTextBox({name:"title", width:c.getMaxNodeWidth(), text:p.name});
		wg.node.focus();
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Description", mandatory:true});
		row.last().addTextArea({name:"description", width:c.getMaxNodeWidth(), height:100, text:p.description});
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Start Date", mandatory:true});
		row.last().addDatePicker({name:"startDate", text:p.startDate});
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Planned End Date"});
		row.last().addDatePicker({name:"endDate", text:p.endDate});
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Project Managers", mandatory:true});
		wg = row.last().addText({text:"Select one or more project managers for this project. Project managers are able to edit project details (including selecting the project team and other project managers) and are responsible for completing the project's status reports.", margin:true});
		row.last().addUserBlock({type:"company", text:"Carlo Abruzzo"});
		var row = c.form.grid.addRow();
		row.last().addLabel({text:"Project Team", mandatory:true});
		row.last().addText({text:"Select users that are allowed to collaborate in this project. Note that by default projects are open to your company; if you prefer to select individual users, please remove Innovair from the team.", margin:true});
		row.last().addUserBlock({type:"group", text:"Innovair"});
		// Footer buttons:
		c.footer.addButton({name:"b-proj-save", type:"save-inactive", onclick:function(node) {
			//TODO PMO.editProject(p, node.wrapper.fluidColumn);
		}});
		c.footer.addButton({name:"b-proj-h", type:"history"});
		// TODO this must be called automatically
		Fluid.packColumn(c);
	},
	
	viewStatus: function(id) {
		Fluid.releaseFrom(7);
		Fluid.addForm({width:500, title:"Status", isSubtitle:true});
	}
};

