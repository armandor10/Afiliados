app.controller("actaCtr", function($scope,$filter, NgTableParams, actaService) {

    var permisos = function(){
      var rol = sessionStorage.getItem("rol");
      var cedula = sessionStorage.getItem("noDocumento");
      if ( rol == 'ADMIN' 
      	   || sessionStorage.getItem("cargo_id") == '5' 
      	   ||  cedula == "1102861249" ) {

      } else {
      	window.location.href = "index.html";
      }
    };

    permisos();

	$scope.actas = [];
	$scope.actaSelected = {};

	var activeItemMenu = function(){
		for (i = 1; i <= 2; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 2 ).addClass( "active" );  
	};
	activeItemMenu();

	function loadngtable(){
		//$scope.tableParams = new NgTableParams({}, { dataset: $scope.libros});
		$scope.tableParams =  new NgTableParams({
	                page: 1,
	                count: 10
	            }, {
	                total: $scope.actas.length, 
	                getData: function ($defer, params) {
					   $scope.data = params.sorting() ? $filter('orderBy')($scope.actas, params.orderBy()) : $scope.actas;
					   $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					   $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					   $defer.resolve($scope.data);
	                }
	            });
	};

	function loadActas(){
		var promiseGet = actaService.getAll();
        promiseGet.then(function (pl) {
            $scope.actas = pl.data;
            loadngtable();
        },
        function (err) {
        	if(err.status == 401){
        	 alert(err.data.message);
        	 console.log(err.data.exception);
        	}else{
        		Materialize.toast("Error al procesar la solicitud",3000,'rounded');
        	}
        	console.log(err);
        });
	};

	function loading(){
	    $('#loading').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	function load(callback){
		callback();
		loadActas();
		$('#loading').closeModal();		
	};

	load(loading);

	$scope.save = function(){
		var promiseGet;
		$scope.actaSelected.fecha = $('#fecha').val();

		if( isEmpty($scope.actaSelected.acta) || isEmpty($('#fecha').val()) ){
			Materialize.toast("Digite los campos de acta y fecha!!!",3000,'rounded');
			return true;
		}

		if( $scope.actaSelected.ban == 'A' ) {			
			promiseGet = actaService.update($scope.actaSelected);
		} else{
			promiseGet = actaService.save($scope.actaSelected);
		}

        promiseGet.then(function (pl) {
        	if(pl.data.state == "OK") {
	        	if($scope.actaSelected.ban == 'A'){
	        		$scope.actas[$scope.actaSelected.index] = $scope.actaSelected;

	        	} else{
	        		$scope.actas.push(pl.data.request);
	        		$scope.actaSelected = pl.data.request;
	        	}
        	}

        	$scope.uploadActa();
        	$scope.tableParams.reload();
       		Materialize.toast(pl.data.message ,3000,'rounded');
        },
        function (err) {
        	if(err.status == 401){
        	 alert(err.data.message);
        	 console.log(err.data.exception);
        	}else{
        		Materialize.toast("Error al procesar la solicitud",3000,'rounded');
        	}
        	console.log(err);
        });

	};

	$scope.uploadActa = function() {
		/*if( $scope.actaSelected.ban != "A" ){
			Materialize.toast("Seleccione primero el acta",3000,'rounded');
			return true;
		}*/

        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        fd.append('idacta', $scope.actaSelected.id);

        var promiseGet = actaService.uploadActa(fd);
        promiseGet.then(function (pl) {
        	//console.log(pl.data);
        	/*Materialize.toast(pl.data,3000,'rounded');*/
        },
        function (err) {
        	if(err.status == 401){
        	 alert(err.data.message);
        	 console.log(err.data.exception);
        	}else{
        		Materialize.toast("Error al procesar la solicitud",3000,'rounded');
        	}
        	console.log(err);
        });
	};

	$scope.VerActa = function(){
		if( $scope.actaSelected.ban != 'A'){
			Materialize.toast("Seleccione primero el acta",3000,'rounded');
			return true;
		}
		var promiseGet = actaService.getActa($scope.actaSelected);
        promiseGet.then(function (pl) {
        	if( pl.data.state == 'OK' ) {
        		if( isEmpty(pl.data.request.path) ){
        			Materialize.toast("Esta acta no tiene un documento asignado",3000,'rounded');
        		} else{
        			window.open( uri + '/' + pl.data.request.path);
        		}
        		
        	} else {
        		Materialize.toast("Documento no encontrado",3000,'rounded');
        	}        	
        },
        function (err) {
        	if(err.status == 401){
        	 alert(err.data.message);
        	 console.log(err.data.exception);
        	}else{
        		Materialize.toast("Error al procesar la solicitud",3000,'rounded');
        	}
        	console.log(err);
        });

	};

	$scope.openActa = function(ban,index){
		$scope.actaSelected = $scope.actas[index];
		$scope.actaSelected.ban = ban;
		$scope.VerActa();
	};

	$scope.modalActa = function(ban,index){ // ban A: activo(Actualizar acta) y I: inactivo(Nueva Acta)
		$( '#first_name' ).prop( "disabled", false );
		$scope.actaSelected = {};
		if( ban == 'A') {
			$( '#first_name' ).prop( "disabled", true );
			$scope.actaSelected = angular.copy($scope.actas[index]);
			$scope.actaSelected.index = index;
			$('#fecha').val($scope.actaSelected.fecha);
		} else {			
			var now = new Date();
			var day = ("0" + now.getDate()).slice(-2);
			var month = ("0" + (now.getMonth() + 1)).slice(-2);
			var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
			$('#fecha').val(today);
		}

		$scope.actaSelected.ban = ban;
		$("label").addClass('active');

	    $('#mActa').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$(".snumero").keypress(function (e) {
	  //if the letter is not digit then display error and don't type anything
	  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	    return false;
	  }
	});

	function isEmpty(obj) {
	  // null and undefined are "empty"
	  if (obj == null) return true;
	  // Assume if it has a length property with a non-zero value
	   // that that property is correct.
	   if (obj.length > 0)    return false;
	   if (obj.length === 0)  return true;
	   // Otherwise, does it have any properties of its own?
	    // Note that this doesn't handle
	    // toString and valueOf enumeration bugs in IE < 9
	    for (var key in obj) {
	      if (hasOwnProperty.call(obj, key)) return false;
	    }
	    return true;
	};

});