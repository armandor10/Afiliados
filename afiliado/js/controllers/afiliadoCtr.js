app.controller("afiliadoCtr", function($scope,$filter, NgTableParams,documentosService, afiliadoService, actaService) {

	$scope.msgTag = "";
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");

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

	$scope.munsImp = angular.copy($scope.municipios);
	$scope.munsImp.push( { id:"15", municipio:"Todos" } );

	var activeItemMenu = function(){
		for (i = 1; i <= 2; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

	var loadVigencia = function(){
		var promiseGet = actaService.getVigencia();
        promiseGet.then(function (pl) {
            $scope.vigencias = pl.data;
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

	var loadAfiliados = function(){
		var promiseGet = afiliadoService.getAll();
        promiseGet.then(function (pl) {
            $scope.afiliados = pl.data.afiliados;
            $scope.gral = {
            	            tInactivos:pl.data.tInactivos,
            	            tActivos:pl.data.tActivos,
            	            total: parseInt(pl.data.tActivos) + parseInt(pl.data.tInactivos)
            	          };
            $scope.afiliados = setdiaCumpleanos($scope.afiliados);
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

	function loadCumpleanos() {
		var promiseGet = afiliadoService.getbirthdays();
        promiseGet.then(function (pl) {
            $scope.afiliados = pl.data.afiliados;
            $scope.gral = {
            	            tInactivos:pl.data.tInactivos,
            	            tActivos:pl.data.tActivos,
            	            total: parseInt(pl.data.tActivos) + parseInt(pl.data.tInactivos)
            	          };
            $scope.afiliados = setdiaCumpleanos($scope.afiliados);
            loadngtable();
            $scope.msgTag = "Cumpleaños" ;
            $("#chipFiltro").css( "visibility","visible" );
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
		if(cumpleanos != "S"){
			loadAfiliados();
		} else {
			loadCumpleanos();
		}
		loadVigencia();
		$('#loading').closeModal();		
	};

	function setInfoActa(){
		//console.log($scope.afiliadoSelected.acta.toString() ,isEmpty($scope.afiliadoSelected.acta.toString()) );
		$scope.msgActa = "";
		if( ! isEmpty($scope.afiliadoSelected.acta) ){
		    $scope.msgActa = "Acta de Afiliación " + $scope.afiliadoSelected.acta + " del " + $scope.afiliadoSelected.fechaActa;			
		}

		if ( ! isEmpty($scope.afiliadoSelected.actaC)  ) {
			$scope.msgActa = $scope.msgActa + " - " + " Acta de Cancelación " + $scope.afiliadoSelected.actaC + " del " + $scope.afiliadoSelected.fechaActaC;
			
		} else if ( isEmpty($scope.msgActa) ) {
			$scope.msgActa = "El afiliado no tiene acta asignada"
		}		
	};

	load(loading);

	$scope.reiniciar = function () {
		cumpleanos = "N";
		load(loading);
	};

	$scope.editar = function(){
		$('input').prop('disabled', false);
		$('#identificacion').prop('disabled', true);	

	};

	$scope.guardar = function(){
		if( validarAfiliado() ) {
       		Materialize.toast("Complete los Campos requeridos!!!" ,3000,'rounded');
       		return true;
		}
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

		$scope.afiliadoSelected.municipio = $('#municipio option:selected').text();		

		if($scope.afiliadoSelected.ban != 'A'){
			promiseGet = afiliadoService.save($scope.afiliadoSelected);
		}else{
			promiseGet = afiliadoService.update($scope.afiliadoSelected);
		}

        promiseGet.then(function (pl) {
        	if(pl.data.state == "OK") {
	        	if($scope.afiliadoSelected.ban == 'A'){
	        		$scope.afiliados[$scope.afiliadoSelected.index] = $scope.afiliadoSelected;
	        		if( $('#estado').prop('checked') ) {
			            $scope.gral.tInactivos = parseInt($scope.gral.tInactivos) - 1;
			            $scope.gral.tActivos = parseInt($scope.gral.tActivos) + 1;
	        		} else{
			            $scope.gral.tInactivos = parseInt($scope.gral.tInactivos) + 1;
			            $scope.gral.tActivos = parseInt($scope.gral.tActivos) - 1;
	        		}
	        	} else{
	        		$scope.afiliados.push(pl.data.request);
	        		if( $('#estado').prop('checked') ) {
	        			$scope.gral.tActivos = parseInt($scope.gral.tActivos) + 1;
	        		} else {
			            $scope.gral.tInactivos = parseInt($scope.gral.tInactivos) + 1;	        			
	        		}
	        		$scope.gral.total = parseInt($scope.gral.total) + 1;
	        	}
        	}

        	$scope.tableParams.reload();
       		Materialize.toast(pl.data.message ,3000,'rounded');
       		$('#modal2').closeModal();
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

	$scope.guardarHisActa = function(){

		var tActa; /* A: Afiliación y C: Cancelacón */
		if( $('#act1').prop('checked') ) {
			tActa = 'A';
		} else {
			tActa = 'C';		
		}

		var obj = {
					"afiliado":$scope.afiliadoSelected.id,
					"Acta": $scope.actaToAsignar.id ,
					"fecha": toDay(),
					"tActa": tActa
				  };
		var promiseGet = actaService.saveHisActa(obj);
        promiseGet.then(function (pl) {
        	if(pl.data.state == "OK") {
        		if( tActa == 'A' ) {
	        		$scope.afiliados[$scope.afiliadoSelected.index].acta = $scope.actaToAsignar.acta ;
	        		$scope.afiliados[$scope.afiliadoSelected.index].fechaActa = $scope.actaToAsignar.fecha ;

        		} else {
	        		$scope.afiliados[$scope.afiliadoSelected.index].actaC = $scope.actaToAsignar.acta ;
	        		$scope.afiliados[$scope.afiliadoSelected.index].fechaActaC = $scope.actaToAsignar.fecha ;

        		}
        	}

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
	$scope.imprimir = function(){
		if( isEmpty($scope.municipioSelected) ){
			return true;
		}

		$.get("templates/printAfiliados.html", function (data) {
			var m,e;
			if(	$scope.municipioSelected.id == "15"	){
				m = "T";
			} else {
				m = $scope.municipioSelected.municipio;
			}

			if( $('#tes1').prop('checked') ) {
				e = "A";
			} else {
				if( $('#tes2').prop('checked') ){
					e = "I";
				} else {
					e = "T";
				}
			}

			var obj = { municipio: m, estado: e};

			var promiseGet = afiliadoService.getMunicipioEstado(obj);
	        promiseGet.then(function (pl) {
	        	pl.data.afiliados = setdiaCumpleanos(pl.data.afiliados);
	        	imprimirAfiliados(data,pl.data.afiliados, pl.data,"Municipio: " + $scope.municipioSelected.municipio);
	        	
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

		});
	};

	$scope.imprimirActual = function () {

		$.get("templates/printAfiliados.html", function (data) {
			var msg2 = "";
			$scope.gral.activos = $scope.gral.tActivos;
			$scope.gral.inactivos = $scope.gral.tInactivos;
			if(cumpleanos != "S"){
				msg2 = " del "+ $scope.vigenciaSelected.vigencia;
			} else {
				msg2 = " desde " + toDay() + " hasta " + getFechaMes();
			} 
			imprimirAfiliados(data,$scope.afiliados, $scope.gral,$scope.msgTag + msg2 );
		});
	};

	var imprimirAfiliados = function (data,afiliados,gral,msg) {
				var lAfi = ""; var act1 = ""; var act2 = "";
	        	
	       		angular.forEach(afiliados, function(value, key) {
	       			var est, tper;
	       			if( value.estado == "A" ){
	       				est = "Activo";
	       			} else {
	       				est = "Inactivo";
	       			}

	       			if( value.tPersona == "N" ){
	       				tper = "Natural";
	       			} else{
	       				tper = "Jurídica";
	       			}

	       			if( !isEmpty(value.acta) ){
	       				act1 = value.acta +" del " + value.fechaActa;
	       			}
	       			if( !isEmpty(value.actaC) ){
	       				act2 = value.actaC + " del " + value.fechaActaC;
	       			}


	       			lAfi = lAfi + "<tr>"+
	       			                   "<td>" + (parseInt(key) + 1) + "</td>"+
	       			                   "<td>" + est + "</td>"+ 
	       			                   "<td>" + tper + "</td>"+ 
	       			                   "<td>" + value.nombre + "</td>"+ 
	       			                   "<td>" + value.noIdentificacion  + "</td>"+ 
	       			                   "<td>" + value.matricula + "</td>"+
	       			                   "<td>" + act1 + "</td>"+ 
	       			                   "<td>" + act2 + "</td>"+ 
	       			                   "<td>" + value.cumpleanos+ "</td>"+ 
	       			                   "<td>" + value.direccion + "</td>"+ 	       			                   
	       			                   "<td>" + value.municipio  + "</td>"+
	       			               "</tr>";
	       		});
	        
				data = data.replace("{{data}}", lAfi) ;
				data = data.replace("{{activos}}", gral.activos );
				data = data.replace("{{inactivos}}", gral.inactivos );
				data = data.replace("{{total}}", gral.total );
				data = data.replace("{{municipio}}", msg );

				//console.log(data);
				// Esta es la parte que te abre la ventana de imprecion...
				var win;
				win = window.open();
				win.document.write(data);
				win.print();
				win.close();
	}

    $scope.uploadFile = function(classDoc , f){
        var file = f;
        var fd = new FormData();
        fd.append('file', file);
        fd.append('afiliado', $scope.afiliadoSelected.id);
        fd.append('claseDocumento', classDoc);

        var promiseGet = documentosService.uploadFileToUrl(fd);
        promiseGet.then(function (pl) {
        	Materialize.toast(pl.data,3000,'rounded');
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

    $scope.verDocumento = function(classDoc){
		var promiseGet = documentosService.verDocumento({
			                                              claseDocumento:classDoc,
			                                              afiliado:$scope.afiliadoSelected.id
			                                          });
        promiseGet.then(function (pl) {
        	if( pl.data.state == 'OK' ) {
        		window.open( uri + '/' + pl.data.request.path);
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

	Array.prototype.getIndexBy = function (name, value) {
	    for (var i = 0; i < this.length; i++) {
	        if (this[i][name] == value) {
	            return i;
	        }
	    }
	    return -1;
	};

	$scope.modalFiltro = function () {
		$('label').addClass('active');
	    $('#mFiltro').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.modalAfiliado = function(ban, afi){ // ban A: activo y I: inactivo
		if( ban == 'A') {		

			$scope.afiliadoSelected = angular.copy( $scope.afiliados[ $scope.afiliados.getIndexBy("id", afi.id) ] );
			$scope.afiliadoSelected.index = $scope.afiliados.getIndexBy("id", afi.id);

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

			setInfoActa();

		} else {

			$scope.msgActa = "";

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

	$scope.modalDocumentos = function(afi){
		$scope.afiliadoSelected = $scope.afiliados[ $scope.afiliados.getIndexBy("id", afi.id) ] ;
	    $('#mDocumentos').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.modalActa = function(afi) {
		$scope.afiliadoSelected = $scope.afiliados[ $scope.afiliados.getIndexBy("id", afi.id) ] ;
		$scope.afiliadoSelected.index = $scope.afiliados.getIndexBy("id", afi.id);
		setInfoActa();
		$('label').addClass('active');
	    $('#mActas').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.modalImprimir = function(){
	    $('#mImprimir').openModal({
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

	$scope.changeVigencia = function(vigencia) {
		$scope.vigenciaSelected = vigencia;
		$('select').material_select();
	};

	$scope.changeActa = function(acta) {
		$scope.actaToAsignar = acta;
	};

	$scope.filtroxActa = function () {
		/*console.log($scope.acta);*/
		var tActa,tActaN; /* A: Afiliación y C: Cancelación */
		if( $('#acta1').prop('checked') ) {
			tActa = 'A';
			tActaN = "Afil.";
		} else if ( $('#acta2').prop('checked') ) {
			tActa = 'C';
			tActaN = "Canc.";			
		} else {
			tActa = 'T';
			tActaN = "Todas.";	
		}

		if ( isEmpty($scope.acta) ) {
        	Materialize.toast("Elija un acta!!!",3000,'rounded');
			return true;
		}

		var obj = {
					"tActa":tActa,
					"idActa": $scope.acta.id 
				  };
		var promiseGet = afiliadoService.getAfixActa(obj);
        promiseGet.then(function (pl) {
            $scope.afiliados = pl.data.afiliados;
            $scope.gral = {
            	            tInactivos:pl.data.tInactivos,
            	            tActivos:pl.data.tActivos,
            	            total: parseInt(pl.data.tActivos) + parseInt(pl.data.tInactivos)
            	          };
            $scope.afiliados = setdiaCumpleanos($scope.afiliados);
            loadngtable();
            $scope.msgTag = "T. Acta: " + tActaN + " Acta: " + $scope.acta.acta ;
            $("#chipFiltro").css( "visibility","visible" );
            $('#mFiltro').closeModal();
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

    var setdiaCumpleanos = function (afiliados) {
    	angular.forEach(afiliados, function(value, key) {
    		var f = new Date(value.fecha);
    		//console.log(value.fecha,f)
    		f.setFullYear( (new Date()).getFullYear() );
    		f.setDate(f.getDate() + 1);
    		//console.log(f,f.getDay(),f.getDate())
    		value.cumpleanos = diasSemana[f.getDay()]  + ", " 
    		+ ( f.getDate() ) + " de " + meses[f.getMonth()] +' de '+ f.getFullYear();
    	});
    	return afiliados;
    };

	$scope.cerrarChipFiltro = function () {
		$("#chipFiltro").css( "visibility","hidden" );
	};

	$scope.evento = function(){
		//alert($('#municipio').val());
		$('input').prop('disabled', false);
	};

	function validarAfiliado() {
		var afi = $scope.afiliadoSelected;

		/* Campos obligatorios */
		if(    isEmpty($('#fecha').val()) 
			|| isEmpty(afi.noIdentificacion)
			|| isEmpty(afi.nombre) 
			|| isEmpty(afi.matricula) 
			|| isEmpty(afi.direccion)  
			|| isEmpty($('#municipio option:selected').val())  
			|| isEmpty(afi.telefono) ) {
			return true;
		}

		/* Campos no obligatorios */
		if( isEmpty($scope.afiliadoSelected.celular) ){
			$scope.afiliadoSelected.celular = "";
		}

		if( isEmpty($scope.afiliadoSelected.fax) ){
			$scope.afiliadoSelected.fax = "";
		}

		if( isEmpty($scope.afiliadoSelected.correo) ){
			$scope.afiliadoSelected.correo = "";
		}

		return false;
	};

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$('select').material_select();
    });

    function toDay(){
    	var now = new Date();
    	var day = ("0" + now.getDate()).slice(-2);
    	var month = ("0" + (now.getMonth() + 1)).slice(-2);
    	return now.getFullYear()+"-"+(month)+"-"+(day) ;
    };

    $scope.toDay = toDay();

    function getFechaMes() {
    	var fecha = new Date();
    	fecha.setDate(fecha.getDate() + 30);
    	var day = ("0" + fecha.getDate()).slice(-2);
    	var month = ("0" + (fecha.getMonth() + 1)).slice(-2);
    	return fecha.getFullYear()+"-"+(month)+"-"+(day) ;
    };

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

	$(".snumero").keypress(function (e) {
	  //if the letter is not digit then display error and don't type anything
	  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	    return false;
	  }
	});

});

