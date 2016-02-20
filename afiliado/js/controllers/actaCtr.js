app.controller("actaCtr", function($scope,$filter, NgTableParams) {

	var activeItemMenu = function(){
		for (i = 1; i <= 2; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 2 ).addClass( "active" );  
	};
	activeItemMenu();

	$scope.modalActa = function(ban,index){ // ban A: activo y I: inactivo
		if( ban == 'A') {

		} else {

		}


		$("label").addClass('active');

	    $('#mActa').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

});