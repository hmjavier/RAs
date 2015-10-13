/**
 * Title: Incidents Script
 * Autor: Oscar Escamilla
 * Version: 1.0
 */

var incidents = {
		
	/**
	 * Init function 
	 * @param : networkCode
	 */
	init : function (networkCode) {
		// Set Network Code
		cnocFramework.networkCode = networkCode;
//		console.log(cnocFramework.networkCode);
		
		incidents.renderTops();
		incidents.incidentsByRange();
		incidents.listTotals("open");
	},	
		
	/*** Rendering Incidents Total Boxes ***/
	renderTops : function () {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getTotals,
			params : {"networkCode" : cnocFramework.networkCode},
			callback : function(response, divContainers, divElements) {				
				var total = 0;				
				$.each(response.records.record, function(key,value) {
					total += parseInt(value.value);
					if (value.type === "open") // Set Open
						divElements[1].text(value.value);
					if (value.type === "closed") // Set Total
						divElements[2].text(value.value);
				});				
				// Set Total
				divElements[0].text(total);
			},
			divContainers : [ $('#containerTotal'), $('#containerOpen'), $('#containerClosed') ],
			divElements : [ $('#topTotal'), $('#topOpen'), $('#topClosed') ]
		});
	},
	
	/*** Draw Stacked Bar Chart ***/
	incidentsByRange : function() {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getIncidentsByRange,
			params : {"networkCode" : cnocFramework.networkCode},
			callback : function(response, divContainers, divElements) {
				
				divElements[0].empty();
				
				var options = {
					chart : { 
						type : 'bar',
						height: 600,
					},
					title : {
						text : 'Incidents by opening time' 
					},
					xAxis : { categories : [ ] },
					yAxis : {
						min : 0,
						title : { text : 'Total incidents' }
					},
					plotOptions : {
						series : {
							stacking : 'normal'
						}
					},
					series : [ ],
					colors : [ '#00a65a', '#f39c12', '#dd4b39' ],
					plotOptions: {
			            series: {
			                cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
//			                            console.log('Category: ' + this.category + ', value: ' + this.y);
//			                            console.log(this.series.name);
			                            incidents.listByRange(cnocFramework.networkCode, this.category, this.series.name);
			                        }
			                    }
			                }
			            }
			        },
			        credits: {
			            enabled: false
			        }
				};
				
				var serieLegends = ['0 a 3:59 hrs.', '4:00 a 7:59 hrs.', '8:00 hrs.'];
				
				$.each(response.records.record, function(k,v) {
					options.xAxis.categories.push(v.location.toString());
				});
				
				$.each(serieLegends, function(key,value) {
					var data = [];
					$.each(response.records.record, function(k,v) {
						var dataArray = v.value.toString().split(",");
						if (value === serieLegends[0])
							data.push(parseInt(dataArray[0]));
						else if (value === serieLegends[1])
							data.push(parseInt(dataArray[1]));
						else if (value === serieLegends[2])
							data.push(parseInt(dataArray[2]));
					});
					options.series.push( {
						name : value,
						data : data
					});
				});
				
				divElements[0].highcharts(options);
			},
			divContainers : [ $('#incidentsContainer') ],
			divElements : [ $('#incidentsChart') ]
		});
	},
	
	/*** Add listeners ***/
	addlisteners : function() {
		$( '#alistTotal' ).click(function() {
			incidents.listTotals("total");
		});
		
		$( '#alistOpen' ).click(function() {
			incidents.listTotals("open");			
		});
		
		$( '#alistClosed' ).click(function() {
			incidents.listTotals("closed");
		});
	},
	
	/*
	 * Invoke List by range
	 * @param : networkCode
	 * @param : location
	 * @param : range
	 */
	listByRange : function (networkCode, location, range) {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getIncidentList,
			params : {"networkCode" : networkCode,
				"location" : location,
				"range" : range
			},
			callback : function(response, divContainers, divElements) {
				incidents.listIncidents(response, range, divContainers, divElements);				
			},
			divContainers : [ $('#incidentList') ],
			divElements : [ $('#incidentsTable') ]
		});
	},
	
	/*
	 * List Top Totals by status
	 * @param : status
	 */
	listTotals : function (status) {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getincidentListStatus,
			params : {"networkCode" : cnocFramework.networkCode,
				"status" : status
			},
			callback : function(response, divContainers, divElements) {
				incidents.listIncidents(response, "", divContainers, divElements);				
			},
			divContainers : [ $('#incidentList') ],
			divElements : [ $('#incidentsTable') ]
		});
	},
	
	/*
	 * Invoke List by range
	 * @param : response
	 * @param : divContainers
	 * @param : divElements
	 */
	listIncidents : function (response, range, divContainers, divElements) {
		var columns = [
						{ "title": "IM" },
						{ "title": "Interaction" },
						{ "title": "Brief Description" },
						{ "title": "Location" },
						{ "title": "Company" },
						{ "title": "Range" },
						{ "title": "Open Time" },
						{ "title": "Last Update" },
						{ "title": "Problem Status" },
						{ "title": "Operator" },
						{ "title": "Opened by" },
						{ "title": "Closure Code" },
						{ "title": "Close Time" } 					
					];
		
		var data = [];
		
		try {
			if (response.records.record.length > 1) {
				$.each(response.records.record, function(k,v) {
					var row = [];
					row.push(v.number.toString());
					row.push(v.interaction.toString());
					row.push(v.brief_description.toString());
					row.push(v.location.toString());
					row.push(v.company.toString());
					row.push(range);
					row.push(v.open_time.toString());
					row.push(v.last_update.toString());
					row.push(v.problem_status.toString());
					row.push(v.operator.toString());
					row.push(v.opened_by.toString());
					row.push(v.closure_code.toString());
					row.push(v.close_time.toString());
					data.push(row);
				});
				
			} else {
				var row = [];
				row.push(response.records.record.number.toString());
				row.push(response.records.record.interaction.toString());
				row.push(response.records.record.brief_description.toString());
				row.push(response.records.record.location.toString());
				row.push(response.records.record.company.toString());
				row.push(range);
				row.push(response.records.record.open_time.toString());
				row.push(response.records.record.last_update.toString());
				row.push(response.records.record.problem_status.toString());
				row.push(response.records.record.operator.toString());
				row.push(response.records.record.opened_by.toString());
				row.push(response.records.record.closure_code.toString());
				row.push(response.records.record.close_time.toString());
				data.push(row);
			}				
			
			cnocFramework.createTable(divContainers[0], divElements[0].selector, columns, data);
			
		} catch (e) {
			console.log(e);
		}		
	}
};