app.controller("afiliadoCtr", function($scope,$filter, NgTableParams) {

	$scope.afiliados = [
	                    {
	                    	estado:"I",
	                    	tPersona: "J",
	                    	razonSocial_nombre:"Instria Costa",
	                    	no_identificacion:"87654321",
	                    	matricula:"324354",
	                    	fecha:"2015/01/15",
	                    	idMunicipio:"14",
	                    	municipio:"Valledupar",
	                    	direccion:"Cll 43 No 34-2",
	                    	telefono:"2345678",
	                    	celular:"87543456",
	                    	fax:"23456789",
	                    	correo:"an@gmail.com"
	                    }
	                  ];

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

	function load(callback){
		callback();		
		loadngtable();
		$('#loading').closeModal();		
	};

	function loading(){
	    $('#loading').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	load(loading);

	$scope.editar = function(){
		$('input').prop('disabled', false);
	};

	$scope.modalAfiliado = function(ban,index){ // ban A: activo y I: inactivo
		if( ban == 'A') {
			
			$scope.afiliadoSelected = $scope.afiliados[index];

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

			var fecha = $scope.afiliadoSelected.fecha.split("/");
			$('#fecha').val( fecha[0]+'-'+ fecha[1]+'-'+ fecha[2]  );

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

			$scope.editar();
			init();
		}


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

