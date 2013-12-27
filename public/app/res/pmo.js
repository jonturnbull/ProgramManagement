
var PMO = {

	listOrgs: function() {
		Fluid.releaseFrom(1);
		var f = Fluid.addForm2({width:250, title:"Organisations"});
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
				f.addButtonGrid(buttons);
				f.addLabel({text:org.domain, href:"http://"+org.domain});
				f.addLabel({text:org.employees+" employees"});
				f.addLabel({text:org.description});
				f.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.addButton({name:"b-org-h", type:"history"});
				f.addButton({name:"b-org-leave", type:"leave", side:"left"});
				//PMO.listPrograms(org);
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
		f = Fluid.addList({width:430, title:"Programs", data:data, display:function(node, item) {
			node.onclick = function() {
				PMO.displayProgram(item.id);
			}
			var table = DOM.addNode(node, "table");
			table.className = "fluid-grid";
			// Name
			var tr1 = DOM.addNode(table, "tr");
			var td1 = DOM.addNode(tr1, "td");
			td1.className = "fluid-cell-padded";
			td1.style.fontSize = "14px";
			td1.innerHTML = "<strong>"+item.name+"</strong>";
			// Projects:
			var tr2 = DOM.addNode(table, "tr");
			var td2 = DOM.addNode(tr2, "td");
			td2.className = "fluid-cell-padded";
			td2.innerHTML = item.projects + " projects";
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
				var f = Fluid.addForm({width:280, title: p.name});
				var buttons = new Array();
				buttons.push({text:"Projects", action:function() {
					PMO.listProjects(p.id);
				}});
				buttons.push({text:"Status", action:function() {
					alert("Not set!");
				}});
				f.addButtonGrid(buttons);
				f.addLabel({text: p.description});
				f.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.addButton({name:"b-org-h", type:"history"});
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
		f = Fluid.addList({width:430, title: "Projects", data: data, display: function(node, item) {
			node.onclick = function() {
				PMO.displayProject(item.id);
			}
			var table = DOM.addNode(node, "table");
			table.className = "fluid-grid";
			// Name
			var tr1 = DOM.addNode(table, "tr");
			var td1 = DOM.addNode(tr1, "td");
			td1.className = "fluid-cell-padded";
			td1.style.fontSize = "14px";
			td1.innerHTML = "<strong>"+item.name+"</strong>";
			// People:
			var tr2 = DOM.addNode(table, "tr");
			var td2 = DOM.addNode(tr2, "td");
			td2.className = "fluid-cell-padded";
			if(item.people) {
				td2.innerHTML = item.people + " people";
			}
			else {
				// TODO get company name via item.parent.name
				td2.innerHTML = "open to all employees";
			}
			// Dates:
			var tr3 = DOM.addNode(table, "tr");
			var td3 = DOM.addNode(tr3, "td");
			td3.className = "fluid-cell-padded";
			td3.innerHTML = item.startDate + " to " + item.endDate;
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
				var f = Fluid.addForm({width:280, title: p.name});
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
				f.addButtonGrid(buttons);
				f.addLabel({text: p.description});
				/*
				
				var row = f.form.grid.addRow();
				row.last().label({text:"Start Date"});
				new Widgets.Label({text:"Start Date"}).attachTo(row.last().node);
				
				var section = f.addSection();
				section.add(new Fluid.Label({text:"Start Date"}));
				section.add(new Fluid.Text({text:p.startDate});
				section = f.addSection();
				section.add(new Fluid.Label({text:"Planned End Date"}));
				section.add(new Fluid.Text({text:p.endDate}));
				section.add(new Fluid.Label({text:"Planned End Date"}));
				section.add(new Fluid.Text({text:p.endDate}));
				section = f.addSection();
				section.add(new Fluid.Label({text:"Project Managers"}));
				section.add(new Fluid.Person({id:1, name:"Carlo Abruzzo", external:false}));
				section = f.addSection();
				section.add(new Fluid.Label({text:"Project Team"}));
				section.add(new Fluid.Group({id:1, name:"Innovair"}));
				*/
				
								
				//f.addLabel({text: "<span style='font-weight:bold; color:#333333'>Start Date</span> "+p.startDate});
				//f.addLabel({text: "<span style='font-weight:bold; color:#333333'>Planned End Date</span> "+p.startDate});
				f.addButton({name:"b-org-edit", type:"edit", side:"right"});
				f.addButton({name:"b-org-h", type:"history"});
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

