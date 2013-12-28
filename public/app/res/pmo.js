
var PMO = {

	listOrgs: function() {
		Fluid.releaseFrom(1);
		var f = Fluid.addForm({width:250, title:"Organisations"});
		f.form.grid.rows[0].cols[0].node.children[0].style.textAlign = "center";

		// Create Home and Personal links:
		f.header.node.className = "fluid-form";
		f.header.grid = new Widgets.Table().attachTo(f.header.node);
		var row = f.header.grid.addRow();
		var block = row.cols[0].addBlock({text:"HOME"});
		block.node.onclick = function() {
			PMO.displayHome();
		}
		f.blockGroup = new Group({widget:"block"});
		f.blockGroup.push(block.node);
		block = row.cols[0].addBlock({text:"PERSONAL"});
		block.node.onclick = function() {
			PMO.displayPersonal();
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
						PMO.displayOrg(node.wrapper.id);
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

	displayHome: function() {
		Fluid.releaseFrom(2);
		Fluid.addForm({width:500, title:"Home"});
	},

	displayPersonal: function() {
		Fluid.releaseFrom(2);
		//Fluid.addForm({width:500, title:"Personal"});
		PMO.displayProject(1);
	},
	
	displayOrg: function(org) {
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
				f.form.grid.addRow().last().addButtonGrid({buttons:buttons});
				f.form.grid.addRow().last().addText({text:org.domain, href:"http://"+org.domain});
				f.form.grid.addRow().last().addText({text:org.employees+" employees"});
				f.form.grid.addRow().last().addText({text:org.description});
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
		f = Fluid.addListForm({width:430, title:"Programs", data:data, display:function(node, item) {
			node.onclick = function() {
				PMO.displayProgram(item.id);
			}
			var table = new Widgets.Table().attachTo(node);
			var row = table.addRow();
			row.last().addText({text:item.name, title:true, margin:true});
			row.last().addText({text:item.projects + " projects"});
		}});
	},
	
	listPeople: function(org) {
		Fluid.releaseFrom(3);
		Fluid.addForm({width:280, title:"People"});
	},
	
	displayProgram: function(id) {
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
		f = Fluid.addListForm({width:430, title:"Projects", data:data, display:function(node, item) {
			node.onclick = function() {
				PMO.displayProject(item.id);
			}
			var table = Widgets.Table().attachTo(node);
			var row = table.addRow();
			row.last().addText({text:item.name, title:true, margin:true});
			row.last().addText({text:item.people? item.people+" people" : "open to all employees", margin:true});
			row.last().addText({text:item.startDate + " to " + item.endDate});
		}});
	},
	
	displayProject: function(id) {
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
					PMO.displayStatus(p.id);
				}});
				buttons.push({text:"Risks", action:function() {
					alert("Not set!");
				}});
				buttons.push({text:"Issues", action:function() {
					alert("Not set!");
				}});
				f.form.grid.addRow().last().addButtonGrid({buttons:buttons});
				f.form.grid.addRow().last().addText({text:p.description});
				var row = f.form.grid.addRow();
				row.last().addLabel({text:"Start Date:", float:true, margin:true});
				row.last().addText({text:p.startDate});
				row = f.form.grid.addRow();
				row.last().addLabel({text:"Planned End Date:", float:true, margin:true});
				row.last().addText({text:p.endDate});
				
				f.footer.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.footer.addButton({name:"b-org-h", type:"history"});

				/*
				
				section = f.addSection();
				section.add(new Fluid.Label({text:"Project Managers"}));
				section.add(new Fluid.Person({id:1, name:"Carlo Abruzzo", external:false}));
				section = f.addSection();
				section.add(new Fluid.Label({text:"Project Team"}));
				section.add(new Fluid.Group({id:1, name:"Innovair"}));
				*/
				

			},
			onFailure: null
		});
		request.send();
	},
	
	displayStatus: function(id) {
		Fluid.releaseFrom(7);
		Fluid.addForm({width:500, title:"Status", isSubtitle:true});
	}
};

