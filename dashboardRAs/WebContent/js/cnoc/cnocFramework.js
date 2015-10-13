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
							window.location = endpoint.main;
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
				},
				statusCode: {
					404: function() {
						alert("Insuficientes Prvilegios");
						window.location = endpoint.main;
					},
					401: function() {
						alert("Insuficientes Prvilegios");
						window.location = endpoint.main;
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
	                text: ""
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
	}	
};
