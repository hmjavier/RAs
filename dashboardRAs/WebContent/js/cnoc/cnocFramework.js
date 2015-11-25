/**
 * Title: CNOC Framework
 * Autor: Oscar Escamilla
 * Version: 1.0
 */

var cnocFramework = {
		
	networkCode : "",	

	request : {
		invokeUrl : "", // RESTfull Service endpoint
		params : null, // RESTfull parameters
		callback : function(response, divContainers, divElements){}, // Function callback
		divContainers : [], // Containers to mask
		divElements : [] // Elements to draw response		
	},
	
	invokeMashup : function(request) { /***** DEV *****/
		
		/*** Mask all div containers ***/
		$.each(request.divContainers, function(k,v) {
			$( v ).mask("Waiting...");
		});
		
		try {
			$.ajax({
				type : 'GET',
				dataType : 'jsonp',
				url : request.invokeUrl,
				data : request.params,				
				success : function(response, divContainers, divElements) {
					try {
						var ce = response.PrestoResponse.PrestoError.ErrorDetails.code;
						if (ce == 401) {
							alert("Insuficientes Prvilegios");
							window.location = endpoint.path;
						}
					} catch (err) {
						/*** Invoke function callback ***/
						request.callback(response, request.divContainers, request.divElements);
						/*** Unmask all div containers ***/
						$.each(request.divContainers, function(k,v) {
							$( v ).unmask();
						});
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
					window.location = endpoint.path;
				},
				statusCode: {
					404: function() {
						alert("Insuficientes Prvilegios");
						window.location = endpoint.path;
					},
					401: function() {
						alert("Insuficientes Prvilegios");
						window.location = endpoint.path;
					}
				}
			});
			
		} catch (error) {
			alert(error);
			/*** Unmask all div containers ***/
			$.each(request.divContainers, function(k,v) {
				$( v ).unmask();
			});			
		}	
	},
	
	/*
	 * Create Table
	 * @param : container
	 * @param : idTable
	 * @param : columns
	 * @param : data
	 */
	createTable : function(container, idTable, columns, data) {		
		container.empty();
		container.append('<table id="' + idTable.substring(1) + '" class="table table-bordered table-striped"></table>');
		$(idTable).DataTable({
        	"columns": columns,
			"scrollX": true,
			"data" : data
        });
	}, 
	/*
	 * createLineChart
	 * @param : container
	 * @param : title
	 * @param : series
	 * @param : categories
	 */	
	createLineChart: function(container, series, categories, title, subtitle){
		
		$(container).highcharts({
	        chart: {
	        	type: 'spline',
                zoomType: 'xy'
	        },credits: {
                enabled: false
            },
	        title: {
	            text: title,
	            useHTML : true,
	            style: {
	            	fontSize : "15px",
	            	fontWeight: "bold"
	            }
	        },
	        subtitle: {
	            text: subtitle
	        },
	        xAxis: {
	            categories: categories
	        },
	        yAxis: {
	            title: {
	                text: ""
	            }
	        },tooltip: {
                crosshairs: true,
                shared: true
            },
	        series: series
	    });
		
	},
	/*
	 * createBarChart
	 * @param : container
	 * @param : series
	 * @param : categories
	 */
	createBarChart: function(container, series, categories, title, subtitle){
		$(container).highcharts({
	        chart: {
	            type: 'column'
	        },credits: {
                enabled: false
            },
	        title: {
	            text: title,
	            useHTML : true,
	            style: {
	            	fontSize : "15px",
	            	fontWeight: "bold"
	            }
	        },
	        subtitle: {
	            text: subtitle
	        },
	        xAxis: {
	            categories: categories
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: "Porcentaje"
	            }
	        },
	        tooltip: {
	            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
	            shared: true
	        },
	        plotOptions: {
	            column: {
	                stacking: 'percent'
	            }
	        },
	        series: series
	    });
	},
	/*
	 * createBarChart
	 * @param : container
	 * @param : series
	 * @param : categories
	 */
	createBarChartNegative: function(container, series, categories, title, subtitle){
		$(container).highcharts({
            chart: {
                type: 'column'
            },credits: {
                enabled: false
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + '%';
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'percent'
                }
            },

            tooltip: {
            	/*pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
	            shared: true*/
                formatter: function () {
                    return '<b>' + this.series.name + ': ' + Highcharts.numberFormat(Math.abs(this.point.y), 0) + '</b><br/>';
                }
            },

            series: series
        });
	},createColumnChartComparativo: function(container, series, categories, title, subtitle){
		$(container).highcharts({
	        chart: {
	            type: 'column'
	        },credits: {
                enabled: false
            },
	        title: {
	            text: title
	        },
	        subtitle: {
	            text: subtitle
	        },
	        xAxis: {
	            categories: categories,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series
		});  
	},
	/*
	 * createColumnChartGlobal
	 * @param : container
	 * @param : series
	 * @param : categories
	 * @param : title
	 * @param : subtitle
	 */
	createColumnChartGlobal: function(container, series, categories, title, subtitle){		
		$(container).highcharts({
	        chart: {
	        	type: 'column',
                zoomType: 'xy'
	        },credits: {
                enabled: false
            },
	        title: {
	            text: title,
	            useHTML : true,
	            style: {
	            	fontSize : "15px",
	            	fontWeight: "bold"
	            }
	        },
	        subtitle: {
	            text: subtitle
	        },
	        xAxis: {
	            categories: categories
	        },
	        yAxis: {
	            title: {
	                text: ""
	            }
	        },tooltip: {
                crosshairs: true,
                shared: true
            },plotOptions: {
	            series: {
	                cursor: 'pointer',
	                point: {
	                    events: {
	                        click: function () {
	                        	if(container === "#invGralChartProveedor"){
	                        		//console.log(this.category);
	                        		drawElementsMain.getCumplimientoSla(drawElementsMain.dateFrom, drawElementsMain.dateTo, "AND p.nombre = '"+this.category+"'");
	                        	}	                        	
	                        }
	                    }
	                }
	            }
	        },
	        series: series
	    });		
	},createTwoAxis: function(container, series, categories, title, subtitle){
		 $(container).highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: title
		        },
		        xAxis: {
		            categories: categories
		        },
		        yAxis: [{
		            min: 0,
		            title: {
		                text: 'Dentro de SLA'
		            }
		        }, {
		            title: {
		                text: 'Fuera de SLA'
		            },
		            opposite: true
		        }],
		        legend: {
		            shadow: false
		        },
		        tooltip: {
		            shared: true
		        },
		        plotOptions: {
		            column: {
		                grouping: false,
		                shadow: false,
		                borderWidth: 0
		            }
		        },
		        series: series
		    });
	},createPieChart:function(container, series, categories, title, subtitle){
		console.log(container);
		$(container).highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: title +" "+subtitle
	        },
	        tooltip: {
	            pointFormat: 'Fallas: <b>{point.y}</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} % ',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series:  [{
	            name: 'Fallas',
	            colorByPoint: true,
	            data: series
	        }]
	        /*series: [{
	            name: 'Brands',
	            colorByPoint: true,
	            data: [{
	                name: 'Microsoft Internet Explorer',
	                y: 56.33
	            }, {
	                name: 'Chrome',
	                y: 24.03,
	                sliced: true,
	                selected: true
	            }, {
	                name: 'Firefox',
	                y: 10.38
	            }, {
	                name: 'Safari',
	                y: 4.77
	            }, {
	                name: 'Opera',
	                y: 0.91
	            }, {
	                name: 'Proprietary or Undetectable',
	                y: 0.2
	            }]
	        }]*/
	    });
	}	
};
