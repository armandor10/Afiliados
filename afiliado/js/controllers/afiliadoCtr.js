app.controller("afiliadoCtr", function($scope,$filter, NgTableParams,afiliadoService) {

    $scope.afiliadoSelected = {};
	function init(){
		$scope.afiliadoSelected = {
			                    	estado:"",
			                    	tPersona: "",
			                    	razonSocial_nombre:"",
			                    	no_identificacion:"",
			                    	matricula:"",
			                    	fecha:"",
			                    	municipio:"",
			                    	direccion:"",
			                    	telefono:"",
			                    	celular:"",
			                    	fax:"",
			                    	correo:""
			                     }
	};

	$scope.cAfiliado = {
		                  nombre:"Nombre",
		                  numero:"Número de Identificación",
		                  fecha:"Fecha de Nacimiento"
	                   };

	$scope.municipios = [
						  {
	                      	id:"1",
	                      	municipio:"Agustín Codazzi"
	                      },
	                      {
	                      	id:"2",
	                      	municipio:"Astrea"
	                      },
	                      {
	                      	id:"3",
	                      	municipio:"Becerril"
	                      },
						  {
	                      	id:"4",
	                      	municipio:"Bosconia"
	                      },
	                      {
	                      	id:"5",
	                      	municipio:"Chimichagua"
	                      },
	                      {
	                      	id:"6",
	                      	municipio:"Chiriguaná"
	                      },
						  {
	                      	id:"7",
	                      	municipio:"El Copey"
	                      },
	                      {
	                      	id:"8",
	                      	municipio:"El Paso"
	                      },
	                      {
	                      	id:"9",
	                      	municipio:"La Jagua de Ibirico"
	                      },
						  {
	                      	id:"10",
	                      	municipio:"La Paz"
	                      },
	                      {
	                      	id:"11",
	                      	municipio:"Manaure Balcón del Cesar"
	                      },
	                      {
	                      	id:"12",
	                      	municipio:"Pueblo Bello"
	                      },
	                      {
	                      	id:"13",
	                      	municipio:"San Diego"
	                      },
	                      {
	                      	id:"14",
	                      	municipio:"Valledupar"
	                      }
	                    ];

	var activeItemMenu = function(){
		for (i = 1; i <= 2; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

	var loadAfiliados = function(){
		var promiseGet = afiliadoService.getAll();
        promiseGet.then(function (pl) {
            $scope.afiliados = pl.data;
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

	function loadngtable(){
		//$scope.tableParams = new NgTableParams({}, { dataset: $scope.libros});
		$scope.tableParams =  new NgTableParams({
	                page: 1,
	                count: 10
	            }, {
	                total: $scope.afiliados.length, 
	                getData: function ($defer, params) {
					   $scope.data = params.sorting() ? $filter('orderBy')($scope.afiliados, params.orderBy()) : $scope.afiliados;
					   $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					   $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					   $defer.resolve($scope.data);
	                }
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
		loadAfiliados();
		$('#loading').closeModal();		
	};

	load(loading);

	$scope.editar = function(){
		$('input').prop('disabled', false);
		$('#identificacion').prop('disabled', true);	

	};

	$scope.guardar = function(){
		var promiseGet;

		if( $('#test1').prop('checked') ) {
			$scope.afiliadoSelected.tPersona = 'N';
		} else {
			$scope.afiliadoSelected.tPersona = 'J';
		}

		if( $('#estado').prop('checked') ) {
			$scope.afiliadoSelected.estado = 'A';

		} else{
			$scope.afiliadoSelected.estado = 'I';
		}

		//console.log( $scope.afiliadoSelected, $('#fecha').val() );
		$scope.afiliadoSelected.fecha = $('#fecha').val() ;

		if($scope.afiliadoSelected.ban != 'A'){
			promiseGet = afiliadoService.save($scope.afiliadoSelected);
		}else{
			promiseGet = afiliadoService.update($scope.afiliadoSelected);
		}

        promiseGet.then(function (pl) {
        	if(pl.data.state == "OK") {
	        	if($scope.afiliadoSelected.ban == 'A'){
	        		$scope.afiliados[$scope.afiliadoSelected.index] = $scope.afiliadoSelected;

	        	} else{
	        		$scope.afiliados.push(pl.data.request);
	        	}
        	}

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

	$scope.eliminar = function(){
		var promiseGet = afiliadoService.delete( $scope.afiliadoSelected );
        promiseGet.then(function (pl) {
        	$scope.afiliados.splice( $scope.afiliadoSelected.index, 1);
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

	$scope.modalAfiliado = function(ban,index){ // ban A: activo y I: inactivo
		if( ban == 'A') {
			
			$scope.afiliadoSelected = angular.copy( $scope.afiliados[index] );
			$scope.afiliadoSelected.index = index;

			$scope.tpersona($scope.afiliadoSelected.tPersona);

			if($scope.afiliadoSelected.estado == 'A'){
				$('#estado').prop('checked', true);
			}else{
				$('#estado').prop('checked', false);
			}

			if($scope.afiliadoSelected.tPersona == 'N'){
				$('#test1').prop('checked', true);
			}else{
				$('#test2').prop('checked', true);
			}

			$('#fecha').val( $scope.afiliadoSelected.fecha );

			//$('select option[value="'+ $scope.afiliadoSelected.idMunicipio +'"]').prop('selected',true);
			//$('select option:contains("Valledupar")').prop('selected',true);
			$("select option").filter(function() {
			    //may want to use $.trim in here
			    return $(this).text() == $scope.afiliadoSelected.municipio; 
			}).prop('selected', true);
			$('select').material_select();

			$('input').attr('disabled', 'true');

		} else {
			var now = new Date();
			var day = ("0" + now.getDate()).slice(-2);
			var month = ("0" + (now.getMonth() + 1)).slice(-2);
			var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
			$('#fecha').val(today);

			$('input').prop('disabled', false);
			init();
		}

        // Bandera de nuevo o antiguo afiliado
        $scope.afiliadoSelected.ban = ban;

		$("label").addClass('active');

	    $('#modal2').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.modalDocumentos = function(){
	    $('#mDocumentos').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.modalEliminar = function(index) {
		$scope.afiliadoSelected =  $scope.afiliados[index];
		$scope.afiliadoSelected.index = index;
	    $('#mEliminar').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.tabSelected = function(id){
		$('ul.tabs').tabs('select_tab', id);
	};

	$scope.tpersona = function(persona){
		if(persona == "J"){
			$scope.cAfiliado = {
				                  nombre:"Razón Social",
				                  numero:"NIT",
				                  fecha:"Fecha de Matrícula"
			                   };
		}else{
			$scope.cAfiliado = {
				                  nombre:"Nombre",
				                  numero:"Número de Identificación",
				                  fecha:"Fecha de Nacimiento"
			                   };
		}
	};

	$scope.evento = function(){
		//alert($('#municipio').val());
		$('input').prop('disabled', false);
	};

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$('select').material_select();
    });
});

