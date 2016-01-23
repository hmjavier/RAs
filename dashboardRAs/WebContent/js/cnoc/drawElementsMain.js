/**
 * Title: Main Script Dashboard RA's
 * Autor: hmjavier
 * Version: 1.0
 */

var drawElementsMain = {
		
	/**
	 * Init function 
	 */
	dateFrom: null,
	dateTo: null, 
	dataSeriesComparativo : [],	
	init : function () {

		drawElementsMain.getFilter('#listSector', '#listSectorG', 'Sector', null, null);
		drawElementsMain.getFilter('#listProvider', '#listProviderG', 'Proveedor', null, null);
		drawElementsMain.getFilter('#listCustomer', '#listCustomerG', 'Cliente', 1, 1);
		drawElementsMain.getFilter('#listDivisional', '#listDivisionalG', 'Divisional', null, null);
		
		$("#tiempoSolComp").chosen({
			allow_single_deselect : true
		}).change(function(){
			var flag = parseInt($("#tiempoSolComp option:selected").val().trim());
			drawElementsMain.createSeriesComparativo(drawElementsMain.dataSeriesComparativo, flag, "#fallaTiempoSolucionTelmexComparativo");
		});
		
		var dateTmp = ((new Date().getTime() / 1000 | 0)-(365 * 24 * 3600));
		drawElementsMain.dateFrom = new Date(dateTmp * 1000).getFullYear()+"-"+(new Date(dateTmp * 1000).getMonth()+1)+"-01";
		drawElementsMain.dateTo = new Date().getFullYear()+"-0"+(new Date().getMonth()+1)+"-01";
		
		console.log("Fecha");
		console.log(new Date().getMonth());
		console.log(drawElementsMain.dateTo);
		drawElementsMain.getDataGlobal();
		
		
		drawElementsMain.getGlobalByDivisional("#invGralChartDivisionalG","#invGralChartDivisional", "divisional", "Inventario General", "Por Divisional");
		drawElementsMain.getGlobalByDivisional("#invGralChartSectorG","#invGralChartSector", "sector", "Inventario General", "Por Sector");
		drawElementsMain.getGlobalByDivisional("#invGralChartProveedorG","#invGralChartProveedor", "proveedor", "Inventario General", "Por Proveedor");
		drawElementsMain.getFallaPie("#fallaResponsableG","#fallaResponsable",  "Fallas ", "Por Responsable: Global","", "");
		
		
		/*var now = new Date();
		//var monthAbbrvName = now.toDateString().substring(4, 7);
		var monthAbbrvName = now.toString();
		console.log(monthAbbrvName);*/
		
		Date.prototype.getMonthName = function() {
	          var monthNames = [ "enero", "febrero", "marzo", "abril", "mayo", "junio", 
	                        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ];
	          return monthNames[this.getMonth()-1];
	     };

	      var month_Name =  new Date().getMonthName();

		$("#titleGlobal").html("Informaci&oacute;n De Servicios Administrados Inventario General: "+new Date().getFullYear()+"-"+month_Name);
		
		
	}, getDataGlobal: function(){
		
		//drawElementsMain.getInventarioGeneral(drawElementsMain.dateFrom, drawElementsMain.dateTo, null, null, null, "global");
		drawElementsMain.getCumplimientoSla(drawElementsMain.dateFrom, drawElementsMain.dateTo, null, null,null);
		drawElementsMain.getFallaTiempoSolucion(drawElementsMain.dateFrom, drawElementsMain.dateTo, null, null,null);
		drawElementsMain.getFallaTiempoSolucionTelmex(null, null,drawElementsMain.dateFrom, drawElementsMain.dateTo);
		drawElementsMain.getFallaTiempoSolucionTelmexComparativo(drawElementsMain.dateFrom, drawElementsMain.dateTo);

	},main: function(){
		
		if($('#dateTo').val() !== ''){
			drawElementsMain.dateFrom = $('#dateFrom').val()+"-01";
			drawElementsMain.dateTo = $('#dateTo').val()+"-01";
		}

		var sector = $("#listSectorG option:selected").val();
		var provider = $("#listProviderG option:selected").val();
		var customer = $("#listCustomerG option:selected").val();
		
		var texto = null;
		var sectorFilter = null;
		var providerFilter = null;
		var customerFilter = null;
		
		if(customer === '' && provider === ''){
			console.log("entro 1");
			texto =  $("#listSectorG option:selected").text();
			sectorFilter = " AND s.idSector = "+sector;
		}else if(sector !== ''  && provider !== '' && customer === ''){
			console.log("entro 2");
			texto =  $("#listSectorG option:selected").text()+" - "+$("#listProviderG option:selected").text();
			sectorFilter = " AND s.idSector = "+sector;
			providerFilter =  " AND p.idProveedor = "+provider;
		}else if(sector !== ''  && provider !== '' && customer !== ''){
			console.log("entro 3");
			texto =  $("#listSectorG option:selected").text()+" - "+$("#listProviderG option:selected").text()+" - "+$("#listCustomerG option:selected").text();
			sectorFilter = " AND s.idSector = "+sector;
			providerFilter =  " AND p.idProveedor = "+provider;
			customerFilter = " AND r.idCliente = "+customer;
		}
		
		console.log(sectorFilter);
		console.log(providerFilter);
		console.log(customerFilter);
		
		$("#titleCumplimientoSLA").html("Cumplimiento de SLA Por Sitios: "+texto);
		$("#fallasTiempoSolucion").html("Cantidad de Fallas por Tiempo de Soluci&oacute;n: "+texto);
		$("#infServAdminTipoServicio").html("Informaci&oacute;n De Servicios Administrados Tipo de Servicio: "+texto);
		
		drawElementsMain.getInventarioGeneral(drawElementsMain.dateFrom, drawElementsMain.dateTo, sector, provider, customer, null);
		drawElementsMain.getCumplimientoSla(drawElementsMain.dateFrom, drawElementsMain.dateTo, providerFilter, sectorFilter, customerFilter);
		drawElementsMain.getFallaTiempoSolucion(drawElementsMain.dateFrom, drawElementsMain.dateTo, providerFilter, sectorFilter, customerFilter);
		
		drawElementsMain.getTipoDeSitio(drawElementsMain.dateFrom, drawElementsMain.dateTo, sector, provider, customer);				
		drawElementsMain.getFallaTiempoSolucionTelmex(sectorFilter, null, drawElementsMain.dateFrom, drawElementsMain.dateTo);
		drawElementsMain.getIndiceFallaWan(drawElementsMain.dateFrom, drawElementsMain.dateTo, provider, sector);		

		drawElementsMain.getFallaPie("#fallaResponsableG","#fallaResponsable",  "Fallas ", "Por Responsable: "+texto, sector, customer);
		
	},getFallaPie:function(divContainer, divElement, title, subtitle, sector, cliente){
		
		$(divElement).empty();
		console.log("drawElementsMain.dateTo");
		console.log(drawElementsMain.dateTo);
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFallasPie,
			params : {"mes":drawElementsMain.dateTo, "sector":sector, "cliente":cliente},
			callback : function(response, divContainers, divElements) {
				
				console.log("Response");
				console.log(response);
				var series = [];
			
				series.push({name:"ADSL", y:parseInt(response.records.record.adsl)});
				series.push({name:"CLIENTE", y:parseInt(response.records.record.cliente)});
				//series.push({name:"ISDN", y:parseInt(response.records.record.isdn)});
				series.push({name:"RED UNO", y:parseInt(response.records.record.red_uno)});
				//series.push({name:"SIN CLIENTE", y:parseInt(response.records.record.sin_cliente)});
				series.push({name:"TELMEX", y:parseInt(response.records.record.telmex)});
				series.push({name:"UNINET", y:parseInt(response.records.record.uninet)});
				
				cnocFramework.createPieChart(divElements[0].selector, series, null, title, subtitle);

			},
			divContainers : [ $(divContainer)],
			divElements : [ $(divElement)]
		});
	},getGlobalByDivisional: function(divContainer, divElement, flag, title, subtitle){
		
		$(divElement).empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getInvGeneralGlobalSA,
			params : {"flag":flag},
			callback : function(response, divContainers, divElements) {

				var dataCategories = [];
				var dataDispositivos = [];
				var dataClientes = [];
				var dataSitios = [];
				var series = [];
				
				if(response.records.record.length > 1){
					for(var i=0;  i < response.records.record.length; i++){
						
						dataCategories.push(response.records.record[i].nombre);
						dataDispositivos.push( parseInt(response.records.record[i].dispositivos));
						dataClientes.push( parseInt(response.records.record[i].clientes));
						dataSitios.push( parseInt(response.records.record[i].sitios));
					}
				}
				series.push({ name:"Dispositivos", data: dataDispositivos});
				series.push({ name:"Clientes", data: dataClientes});
				series.push({ name:"Sitios", data: dataSitios});
				
				cnocFramework.createColumnChartGlobal(divElements[0].selector, series, dataCategories, title, subtitle);
				
			},
			divContainers : [ $(divContainer)],
			divElements : [ $(divElement)]
		});
	}
	/*
	 * getFilter
	 * @param : container
	 * @param : elements
	 * @param : filter
	 * @param : id_sector
	 * @param : id_provider
	 */
	,getFilter: function(container, elements, filter, id_sector, id_provider){
		
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFilters,
			params : {"filter" : filter, "id_sector": id_sector, "id_provider": id_provider},
			callback : function(response, divContainers, divElements) {				

				$(divContainers[0].selector).empty();
				$(divContainers[0].selector).append("<select id='"+divElements[0].selector.replace("#","")+"' data-placeholder='Selecciona "+filter+"' style='width:100%' tabindex='1'><option value=''>Selecciona "+filter+"</option></select>");
				
				try{
					if (response.records.record.length > 1) {

						for ( var i = 0; i < response.records.record.length; i++) {
							jQuery(divElements[0].selector).append(
									"<option name = '"+response.records.record[i].nombre.toString()+"' rel='"+response.records.record[i].id.toString()+"' value='"
											+ response.records.record[i].id.toString() + "'>"
											+ response.records.record[i].nombre.toString()
											+ "</option>");
						}
					} else {
						jQuery(divElements[0].selector).append(
								"<option name = '"+response.records.record[i].nombre.toString()+"' rel='"+response.records.record.id.toString()+"' value='"
										+ response.records.record.id.toString()
										+ "'>" + response.records.record.nombre.toString()
										+ "</option>");

					}
				}catch(e){
					$(divElements[0].selector).chosen();
					console.log(e);
				}
								
				
				if(filter !== 'Cliente'){
					
					if(filter === 'Divisional'){
						$(divElements[0].selector).chosen({
							allow_single_deselect : true
						}).change(function(){
							//var sector = $("#listSectorG option:selected").val();
							var divisional = $("#listDivisionalG option:selected").val();
							drawElementsMain.getFallaTiempoSolucionTelmex(null, "AND s.idSector = "+divisional , drawElementsMain.dateFrom, drawElementsMain.dateTo);
						});
					}else{
						$(divElements[0].selector).chosen({
							allow_single_deselect : true
						}).change(function() {

							var sector = $("#listSectorG option:selected").val();
							var provider = $("#listProviderG option:selected").val();
							
													
							drawElementsMain.getFilter('#listCustomer', '#listCustomerG', 'Cliente', sector, provider);
							drawElementsMain.main();
						});

					}
					
				}else{
					$(divElements[0].selector).chosen({
						allow_single_deselect : true
					}).change(function(){
						drawElementsMain.main();
					});
					
				}

			},
			divContainers : [ $(container)],
			divElements : [ $(elements)]
		});
		
		
	}
	/*
	 * getInventarioGeneral
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : sector
	 * @param : provider
	 * @param : customer
	 */
	, getInventarioGeneral: function(dateFrom, dateTo, sector, provider, customer, flag){
		
		
		$("#invGralChart").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getInvGeneralSA,
			params : {"idSector" : sector, "idProveedor": provider, "mesInicio": dateFrom, "mesFin":dateTo, "idCliente":customer, "flag": flag},
			callback : function(response, divContainers, divElements) {
				
				var dataDispositivos = [];
				var dataEnlaces = [];
				var dataSitios = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					for(var i=0;  i < response.records.record.length; i++){
						
						dataDispositivos.push( parseInt(response.records.record[i].dispositivos));
						dataEnlaces.push( parseInt(response.records.record[i].enlaces));
						dataSitios.push( parseInt(response.records.record[i].sitios));
						dataTime.push(response.records.record[i].mes);
						
					}
				}

				dataChart.push({ name:"Dispositivos", data: dataDispositivos});
				dataChart.push({ name:"Enlaces", data: dataEnlaces});
				dataChart.push({ name:"Sitios", data: dataSitios});
				
				
				var title = "Dispositivos: <span class='label label-primary' style='font-size:20px;'>"+dataDispositivos[dataDispositivos.length-1]+"</span>";
				title += "Enlaces: <span class='label label-primary' style='font-size:20px;'>"+dataEnlaces[dataEnlaces.length-1]+"</span>";
				title += "Sitios: <span class='label label-primary' style='font-size:20px;'>"+dataSitios[dataSitios.length-1]+"</span>";
				
				var subtitle = "Último Periodo: "+dataTime[dataTime.length-1]; 
				cnocFramework.createLineChart(divElements[0].selector, dataChart, dataTime, title, subtitle);
				
			},
			divContainers : [ $("#invGralChartG")],
			divElements : [ $("#invGralChart")]
		});
	}/*
	 * getInventarioGeneral
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : sector
	 * @param : provider
	 * @param : customer
	 */
	, getTipoDeSitio: function(dateFrom, dateTo, sector, provider, customer){
		$("#tipoServicioChart").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getTipoServicio,
			params : {"idSector" : sector, "idProveedor": provider, "mesInicio": dateFrom, "mesFin":dateTo, "idCliente":customer},
			callback : function(response, divContainers, divElements) {

				var dataAdsl = [];
				var dataFr = [];
				var dataIde = [];
				var dataIsdn = [];
				var datalan2lan = [];
				var datampls = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					for(var i=0;  i < response.records.record.length; i++){
						
						dataAdsl.push( parseInt(response.records.record[i].adsl));
						dataFr.push( parseInt(response.records.record[i].fr));
						dataIde.push( parseInt(response.records.record[i].ide));
						dataIsdn.push( parseInt(response.records.record[i].isdn));
						datalan2lan.push( parseInt(response.records.record[i].lan2lan));
						datampls.push( parseInt(response.records.record[i].mpls));
						dataTime.push(response.records.record[i].mes);
						
					}
				}

				dataChart.push({ name:"ADSL", data: dataAdsl});
				dataChart.push({ name:"FR", data: dataFr});
				dataChart.push({ name:"IDE", data: dataIde});
				dataChart.push({ name:"ISDN", data: dataIsdn});
				dataChart.push({ name:"LAN 2 LAN", data: datalan2lan});
				dataChart.push({ name:"MPLS", data: datampls});
				
				
				var title = "ADSL: <span class='label label-primary' style='font-size:20px;'>"+dataAdsl[dataAdsl.length-1]+"</span>";
				title += "FR: <span class='label label-primary' style='font-size:20px;'>"+dataFr[dataFr.length-1]+"</span>";
				title += "IDE: <span class='label label-primary' style='font-size:20px;'>"+dataIde[dataIde.length-1]+"</span>";
				title += "ISDN: <span class='label label-primary' style='font-size:20px;'>"+dataIsdn[dataIsdn.length-1]+"</span>";
				title += "LAN 2 LAN: <span class='label label-primary' style='font-size:20px;'>"+datalan2lan[datalan2lan.length-1]+"</span>";
				title += "MPLS: <span class='label label-primary' style='font-size:20px;'>"+datampls[datampls.length-1]+"</span>";
				var subtitle = "Último Periodo: "+dataTime[dataTime.length-1]; 
				
				cnocFramework.createLineChart(divElements[0].selector, dataChart, dataTime, title, subtitle);
				
			},
			divContainers : [ $("#tipoServicioChartG")],
			divElements : [ $("#tipoServicioChart")]
		});
	}
	 /* getCumplimientoSla
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : provider
	 */
	, getCumplimientoSla: function(dateFrom, dateTo, provider, sector, customer){

		$("#cumplimientoSla").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getCumplimientoSLA,
			params : {"idProveedor": provider, "idSector": sector, "idCliente": customer, "mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {

				var dentroSla = [];
				var fueraSla = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					for(var i=0;  i < response.records.record.length; i++){
						
						dentroSla.push( parseInt(response.records.record[i].dentro_sla));
						fueraSla.push( parseInt(response.records.record[i].fuera_sla));
						dataTime.push(response.records.record[i].mes);
						
					}
				}
				
				dataChart.push({ name:"Dentro de SLA", data: dentroSla, type: 'spline'});
				dataChart.push({ name:"Fuera de SLA", data: fueraSla, yAxis: 1});
				
				cnocFramework.createTwoAxis(divElements[0].selector, dataChart, dataTime, null, null);
				
			},
			divContainers : [ $("#cumplimientoSlaG")],
			divElements : [ $("#cumplimientoSla")]
		});
	}, 
	 /* getFallaTiempoSolucion
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : sector
	 */
	getFallaTiempoSolucion: function(dateFrom, dateTo, sector, provider, sector, customer){
		$("#fallaTiempoSolucion").empty();
		
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFallaTiempoSolucion,
			params : {"idProveedor": provider, "idSector": sector, "idCliente": customer, "mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {
				
				var minor3_6_hr = [];
				var in_7_2hrs = [];
				var max7_2h_r = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					var mes = null;
					for(var i=0;  i < response.records.record.length; i++){
						
						var idRango = parseInt(response.records.record[i].idrango);
						
						if(mes !== response.records.record[i].mes){
							mes = response.records.record[i].mes;
							dataTime.push(response.records.record[i].mes);
						}
						
						if(idRango === 1){
							minor3_6_hr.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 2){
							in_7_2hrs.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 3){
							max7_2h_r.push( parseInt(response.records.record[i].column1));
						}						
					}
				}
				
				dataChart.push({ name:"Menor a 3.6 HRS", data: minor3_6_hr});
				dataChart.push({ name:"Entre 3.6 y 7.2 HRS", data: in_7_2hrs});
				dataChart.push({ name:"Mayor a 7.2", data: max7_2h_r});
				
				var title = " < 3.6 HRS: <span class='label label-primary' style='font-size:20px;'>"+minor3_6_hr[minor3_6_hr.length-1]+"</span>  Entre 3.6 y 7.2 HRS: <span class='label label-primary' style='font-size:20px;'>"+in_7_2hrs[in_7_2hrs.length-1]+"</span>   > 7.2 HRS: <span class='label label-primary' style='font-size:20px;'>"+max7_2h_r[max7_2h_r.length-1]+"</span>";
				var subtitle = "Último Periodo: "+dataTime[dataTime.length-1];
				
				cnocFramework.createBarChart(divElements[0].selector, dataChart, dataTime, title, subtitle);
				
			},
			divContainers : [ $("#fallaTiempoSolucionG")],
			divElements : [ $("#fallaTiempoSolucion")]
		});
	}, /* getFallaTiempoSolucionTelmex
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : sector
	 * @param : divisional
	 */
	getFallaTiempoSolucionTelmex: function(sector, divisional,  dateFrom, dateTo){

		$("#fallaTiempoSolucionTelmex").empty();
		
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFallaTiempoSolucionTelmex,
			params : {"idSector" : sector, "idDivisional":divisional, "mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {
				
				var minor3_6_hr = [];
				var in_7_2hrs = [];
				var max7_2h_r = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					var mes = null;
					for(var i=0;  i < response.records.record.length; i++){
						
						var idRango = parseInt(response.records.record[i].idrango);
						
						if(mes !== response.records.record[i].mes){
							mes = response.records.record[i].mes;
							dataTime.push(response.records.record[i].mes);
						}
						
						if(idRango === 1){
							minor3_6_hr.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 2){
							in_7_2hrs.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 3){
							max7_2h_r.push( parseInt(response.records.record[i].column1));
						}
					}					
				}
				dataChart.push({ name:"Menor a 3.6 HRS", data: minor3_6_hr});
				dataChart.push({ name:"Entre 3.6 y 7.2 HRS", data: in_7_2hrs});
				dataChart.push({ name:"Mayor a 7.2", data: max7_2h_r});
				
				var title = " < 3.6 HRS: <span class='label label-primary' style='font-size:20px;'>"+minor3_6_hr[minor3_6_hr.length-1]+"</span>  Entre 3.6 y 7.2 HRS: <span class='label label-primary' style='font-size:20px;'>"+in_7_2hrs[in_7_2hrs.length-1]+"</span>   > 7.2 HRS: <span class='label label-primary' style='font-size:20px;'>"+max7_2h_r[max7_2h_r.length-1]+"</span>";
				var subtitle = "Último Periodo: "+dataTime[dataTime.length-1];
				
				cnocFramework.createBarChart(divElements[0].selector, dataChart, dataTime, title, subtitle);
				
			},
			divContainers : [ $("#fallaTiempoSolucionTelmexG")],
			divElements : [ $("#fallaTiempoSolucionTelmex")]
		});
	}, 
	 /* getFallaTiempoSolucionTelmexComparativo
	 * @param : dateFrom
	 * @param : dateTo
	 */
	getFallaTiempoSolucionTelmexComparativo: function(dateFrom, dateTo){

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFallaDivisionalesComparativo,
			params : {"mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {
								
				drawElementsMain.dataSeriesComparativo = response.records.record;
				
				drawElementsMain.createSeriesComparativo(drawElementsMain.dataSeriesComparativo, 1, divElements[0].selector);

			},
			divContainers : [ $("#fallaTiempoSolucionTelmexComparativoG")],
			divElements : [ $("#fallaTiempoSolucionTelmexComparativo")]
		});
	},
	/* createSeriesComparativo
	 * @series
	 * @flag
	 * @container
	 * */
	createSeriesComparativo: function(series, flag, container){

		$("#fallaTiempoSolucionTelmexComparativo").empty();
		
		var noroeste = [];
		var noreste = [];
		var metro = [];
		var sur = [];
		var telnor = [];
		var internacional = [];
		var dataChart = [];
		var dataTime = [];

		if(series.length > 1){
			
			for(var i=0;  i < series.length; i++){
				
				var valTmp = 0;
				if(flag === 1){
					valTmp = parseFloat(series[i].rango1);
				}else if(flag === 2){
					valTmp = parseFloat(series[i].rango2);
				}else if(flag === 3){
					valTmp = parseFloat(series[i].rango3);
				}
				
				if(parseInt(series[i].iddivisional) === 1 ){
					noroeste.push( valTmp );
				}else if(parseInt(series[i].iddivisional) === 2 ){
					noreste.push( valTmp );
				}else if(parseInt(series[i].iddivisional) === 3 ){
					metro.push( valTmp );
				}else if(parseInt(series[i].iddivisional) === 4 ){
					sur.push( valTmp );
				}else if(parseInt(series[i].iddivisional) === 5 ){
					telnor.push( valTmp );
				}else if(parseInt(series[i].iddivisional) === 6 ){
					internacional.push( valTmp );
					dataTime.push(series[i].mes);
				}						
			}
		}

		dataChart.push({ name:"Noroeste", data: noroeste});
		dataChart.push({ name:"Noreste", data: noreste});
		dataChart.push({ name:"Metro", data: metro});
		dataChart.push({ name:"Sur", data: sur});
		dataChart.push({ name:"Telnor", data: telnor});
		dataChart.push({ name:"Internacional", data: internacional});

		cnocFramework.createColumnChartComparativo(container, dataChart, dataTime, null, null);

	},
	
	/* getIndiceFallaWan
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : provider
	 * @param : sector
	 */
	getIndiceFallaWan: function(dateFrom, dateTo, provider, sector){
		
		$("#indiceFallasWan").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getIndiceFallaWan,
			params : {"idProveedor": provider, "idSector":sector, "mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {

				var noroeste = [];
				var noreste = [];
				var metro = [];
				var sur = [];
				var telnor = [];
				var internacional = [];
				var dataChart = [];
				var dataTime = [];
				
				if(response.records.record.length > 1){

					for(var i=0;  i < response.records.record.length; i++){
						
						if(parseInt(response.records.record[i].iddivisional) === 1 ){
							noroeste.push( parseFloat(response.records.record[i].indice_fallas_wan));
						}else if(parseInt(response.records.record[i].iddivisional) === 2 ){
							noreste.push( parseFloat(response.records.record[i].indice_fallas_wan));
						}else if(parseInt(response.records.record[i].iddivisional) === 3 ){
							metro.push( parseFloat(response.records.record[i].indice_fallas_wan));
						}else if(parseInt(response.records.record[i].iddivisional) === 4 ){
							sur.push( parseFloat(response.records.record[i].indice_fallas_wan));
						}else if(parseInt(response.records.record[i].iddivisional) === 5 ){
							telnor.push( parseFloat(response.records.record[i].indice_fallas_wan));
						}else if(parseInt(response.records.record[i].iddivisional) === 6 ){
							internacional.push( parseFloat(response.records.record[i].indice_fallas_wan));
							dataTime.push(response.records.record[i].mes);
						}						
					}
				}

				dataChart.push({ name:"Noroeste", data: noroeste});
				dataChart.push({ name:"Noreste", data: noreste});
				dataChart.push({ name:"Metro", data: metro});
				dataChart.push({ name:"Sur", data: sur});
				dataChart.push({ name:"Telnor", data: telnor});
				dataChart.push({ name:"Internacional", data: internacional});
				
				cnocFramework.createLineChart(divElements[0].selector, dataChart, dataTime, "Indice de Falla WAN", null);
				
			},
			divContainers : [ $("#indiceFallasWanG")],
			divElements : [ $("#indiceFallasWan")]
		});
	},
	/* getSlaRegion
	 * @param : dateFrom
	 * @param : dateTo
	 */
	getSlaRegion: function(dateFrom, dateTo){
		
		$("#slaRegion").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getCumplimientoSlaRegion,
			params : {"mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {

				var noroesteIn = [];
				var noresteIn = [];
				var metroIn = [];
				var surIn = [];
				var telnorIn = [];
				var internacionalIn = [];
				var noroesteOut = [];
				var noresteOut = [];
				var metroOut = [];
				var surOut = [];
				var telnorOut = [];
				var internacionalOut = [];
				var dataChart = [];
				var dataTime = [];
				
				if(response.records.record.length > 1){
					
					for(var i=0;  i < response.records.record.length; i++){
						
						if(parseInt(response.records.record[i].iddivisional) === 1 ){
							noroesteIn.push( parseInt(response.records.record[i].dentro_sla));
							noroesteOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
						}else if(parseInt(response.records.record[i].iddivisional) === 2 ){
							noresteIn.push( parseInt(response.records.record[i].dentro_sla));
							noresteOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
						}else if(parseInt(response.records.record[i].iddivisional) === 3 ){
							metroIn.push( parseInt(response.records.record[i].dentro_sla));
							metroOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
						}else if(parseInt(response.records.record[i].iddivisional) === 4 ){
							surIn.push( parseInt(response.records.record[i].dentro_sla));
							surOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
						}else if(parseInt(response.records.record[i].iddivisional) === 5 ){
							telnorIn.push( parseInt(response.records.record[i].dentro_sla));
							telnorOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
						}else if(parseInt(response.records.record[i].iddivisional) === 6 ){
							internacionalIn.push( parseInt(response.records.record[i].dentro_sla));
							internacionalOut.push( (parseInt(response.records.record[i].fuera_sla)) * -1);
							
							dataTime.push(response.records.record[i].mes);
						}						
					}
				}

				dataChart.push({ name:"Noroeste Dentro", data: noroesteIn});
				dataChart.push({ name:"Noroeste Fuera", data: noroesteOut});
				dataChart.push({ name:"Noreste Dentro", data: noresteIn});
				dataChart.push({ name:"Noreste Fuera", data: noresteOut});
				dataChart.push({ name:"Metro Dentro", data: metroIn});
				dataChart.push({ name:"Metro Fuera", data: metroOut});
				dataChart.push({ name:"Sur Dentro", data: surIn});
				dataChart.push({ name:"Sur Fuera", data: surOut});
				dataChart.push({ name:"Telnor Dentro", data: telnorIn});
				dataChart.push({ name:"Telnor Fuera", data: telnorOut});
				dataChart.push({ name:"Internacional Dentro", data: internacionalIn});
				dataChart.push({ name:"Internacional Fuera", data: internacionalOut});
				
				cnocFramework.createBarChartNegative(divElements[0].selector, dataChart, dataTime, null, null);
				
			},
			divContainers : [ $("#slaRegionG")],
			divElements : [ $("#slaRegion")]
		});
	}
};