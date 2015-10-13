/**
 * Title: Endpoints Loader
 * Autor: Oscar Escamilla
 * Version: 1.0
 */
var endpoint = {
	getproperties : function() {
		$.ajax({
		    async: false,
		    url: "../properties/endpoint.json",
		    success: function( data ) {
		    	endpoint.main = data.main;
				endpoint.logout = endpoint.main + data.logout;
				endpoint.getCurrentUser = endpoint.main + data.getCurrentUser;				
				endpoint.getFilters = endpoint.main + data.getFilters;
				endpoint.getInvGeneralSA = endpoint.main + data.getInvGeneralSA;
				endpoint.getTipoServicio = endpoint.main + data.getTipoServicio;
				endpoint.getCumplimientoSLA = endpoint.main + data.getCumplimientoSLA;
				endpoint.getFallaTiempoSolucion = endpoint.main + data.getFallaTiempoSolucion;
				endpoint.getFallaTiempoSolucionTelmex = endpoint.main + data.getFallaTiempoSolucionTelmex;
				endpoint.getIndiceFallaWan = endpoint.main + data.getIndiceFallaWan;
				endpoint.getCumplimientoSlaRegion = endpoint.main + data.getCumplimientoSlaRegion;
				endpoint.getFallaDivisionalesComparativo = endpoint.main + data.getFallaDivisionales;
			}
		});
	}
};