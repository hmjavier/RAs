/**
 * Title: Navigation Bar
 * Autor: Oscar Escamilla
 * Version: 1.0
 */

var navigation = {		
	
	/**
	 * Load Network Codes
	 *  
	 * @param : init function
	 *  
	 */
	getNetworkCodes : function (init) {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getNetworkCodes,
			params : null,
			callback : function(response, divContainers) {
				result = response.records.record;
				$.each(result, function(k, v) {
					divContainers[0].append(
							'<option value="' + v.network_code + '">' + v.dept_name + '</option>'
						);
				});				
				
				// Call page init function
				init(divContainers[0].val());
				
				// Initialize Select2 Element
		        divContainers[0].select2().on("change", function(e) {
		        	cnocFramework.networkCode = $(this).val();
		        	init(cnocFramework.networkCode); // Call page init function
		          });
				
			},
			divContainers : [ $('#selectCustomer') ]
		});
	},
	
	/*** Load Username ***/
	loadUser : function() {
		cnocFramework.invokeMashup({
			invokeUrl : endpoint.getCurrentUser,
			params : null,
			callback : function(response) {
				$( '#userName' ).text(response.user.firstName + ' ' + response.user.lastName);
			},
			divContainers : [ $('#userNameContainer') ]
		});
		
		/*** Logout User ***/
		$( '#logout' ).click(function() {
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: endpoint.logout,
				success: function(response) {	    				
					window.location = endpoint.path;
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					window.location = endpoint.path;
				}
			});
		});
	}
};