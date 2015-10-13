/**
 * Title: Main Script
 * Autor: hmjavier
 * Version: 1.0
 */

var drawElementsMain = {
		
	/**
	 * Init function 
	 */
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
		
	},main: function(){
		
		var dateFrom = $('#dateFrom').val()+"-01";
		var dateTo = $('#dateTo').val()+"-01";
		var sector = $("#listSectorG option:selected").val();
		var provider = $("#listProviderG option:selected").val();
		var customer = $("#listCustomerG option:selected").val();
		
		
		drawElementsMain.getInventarioGeneral(dateFrom, dateTo, sector, provider, customer);
		drawElementsMain.getTipoDeSitio(dateFrom, dateTo, sector, provider, customer);
		drawElementsMain.getCumplimientoSla(dateFrom, dateTo, provider);
		drawElementsMain.getFallaTiempoSolucion(sector, dateFrom, dateTo);
		drawElementsMain.getFallaTiempoSolucionTelmex(sector, 1, dateFrom, dateTo);
		drawElementsMain.getIndiceFallaWan(dateFrom, dateTo, provider, sector);
		drawElementsMain.getSlaRegion(dateFrom, dateTo);
		drawElementsMain.getFallaTiempoSolucionTelmexComparativo(dateFrom, dateTo);
		
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
				$(divContainers[0].selector).append("<select id='"+divElements[0].selector.replace("#","")+"' data-placeholder='Selecciona "+filter+"' style='width:100%' tabindex='1'><option value='0'>Selecciona "+filter+"</option></select>");
				
				try{
					if (response.records.record.length > 1) {

						for ( var i = 0; i < response.records.record.length; i++) {
							jQuery(divElements[0].selector).append(
									"<option rel='"+response.records.record[i].id.toString()+"' value='"
											+ response.records.record[i].id.toString() + "'>"
											+ response.records.record[i].nombre.toString()
											+ "</option>");
						}
					} else {
						jQuery(divElements[0].selector).append(
								"<option rel='"+response.records.record.id.toString()+"' value='"
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
							var sector = $("#listSectorG option:selected").val();
							var divisional = $("#listDivisionalG option:selected").val();
							var dateFrom = $('#dateFrom').val()+"-01";
							var dateTo = $('#dateTo').val()+"-01";
							drawElementsMain.getFallaTiempoSolucionTelmex(sector, divisional , dateFrom, dateTo);
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
	, getInventarioGeneral: function(dateFrom, dateTo, sector, provider, customer){
		
		
		$("#invGralChart").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getInvGeneralSA,
			params : {"idSector" : sector, "idProveedor": provider, "mesInicio": dateFrom, "mesFin":dateTo, "idCliente":customer},
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
	}/*
	 * getInventarioGeneral
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : sector
	 * @param : provider
	 * @param : customer
	 */
	, getCumplimientoSla: function(dateFrom, dateTo, provider){
		$("#cumplimientoSla").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getCumplimientoSLA,
			params : {"idProveedor": provider, "mesInicio": dateFrom, "mesFin":dateTo},
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
				
				dataChart.push({ name:"Dentro de SLA", data: dentroSla});
				dataChart.push({ name:"Fuera de SLA", data: fueraSla});
				
				cnocFramework.createBarChart(divElements[0].selector, dataChart, dataTime, null, null);
				
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
	getFallaTiempoSolucion: function(sector, dateFrom, dateTo){
		$("#fallaTiempoSolucion").empty();
		
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getFallaTiempoSolucion,
			params : {"idSector" : sector, "mesInicio": dateFrom, "mesFin":dateTo},
			callback : function(response, divContainers, divElements) {
				
				var minor3_6_hr = [];
				var in_7_2hrs = [];
				var max7_2h_r = [];
				var dataTime = [];
				var dataChart = [];
				
				if(response.records.record.length > 1){
					for(var i=0;  i < response.records.record.length; i++){
						
						var idRango = parseInt(response.records.record[i].idrango);
						
						if(idRango === 1){
							minor3_6_hr.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 2){
							in_7_2hrs.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 3){
							max7_2h_r.push( parseInt(response.records.record[i].column1));
						}
						
						dataTime.push(response.records.record[i].mes);
						
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
	},
	/* getCumplimientoSla
	 * @param : dateFrom
	 * @param : dateTo
	 * @param : provider
	 */
	getCumplimientoSla: function(dateFrom, dateTo, provider){
		
		$("#cumplimientoSla").empty();

		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getCumplimientoSLA,
			params : {"idProveedor": provider, "mesInicio": dateFrom, "mesFin":dateTo},
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
				
				dataChart.push({ name:"Dentro de SLA", data: dentroSla});
				dataChart.push({ name:"Fuera de SLA", data: fueraSla});
				
				cnocFramework.createBarChart(divElements[0].selector, dataChart, dataTime, null, null);
				
			},
			divContainers : [ $("#cumplimientoSlaG")],
			divElements : [ $("#cumplimientoSla")]
		});
	}, 
	 /* getFallaTiempoSolucionTelmex
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
					for(var i=0;  i < response.records.record.length; i++){
						
						var idRango = parseInt(response.records.record[i].idrango);
						
						if(idRango === 1){
							minor3_6_hr.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 2){
							in_7_2hrs.push( parseInt(response.records.record[i].column1));
						}else if(idRango === 3){
							max7_2h_r.push( parseInt(response.records.record[i].column1));
						}
						
						dataTime.push(response.records.record[i].mes);
						
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
					console.log("entro 1");
					valTmp = parseFloat(series[i].rango1);
				}else if(flag === 2){
					console.log("entro 2");
					valTmp = parseFloat(series[i].rango2);
				}else if(flag === 3){
					console.log("entro 3");
					valTmp = parseFloat(series[i].rango3);
				}else {
					console.log("No entro a nada");
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
		
		console.log(dataChart);
		
		cnocFramework.createColumnChartComparativo(container, dataChart, dataTime, null, null);

	},
	
	/* getCumplimientoSla
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
	/* getCumplimientoSla
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