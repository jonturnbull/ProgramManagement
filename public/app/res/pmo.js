
var PMO = {

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
			td1.className = "form-c";
			td1.style.fontSize = "14px";
			td1.innerHTML = "<strong>"+item.name+"</strong>";
			// Projects:
			var tr2 = DOM.addNode(table, "tr");
			var td2 = DOM.addNode(tr2, "td");
			td2.className = "form-c";
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
			td1.className = "form-c";
			td1.style.fontSize = "14px";
			td1.innerHTML = "<strong>"+item.name+"</strong>";
			// People:
			var tr2 = DOM.addNode(table, "tr");
			var td2 = DOM.addNode(tr2, "td");
			td2.className = "form-c";
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
			td3.className = "form-c";
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

