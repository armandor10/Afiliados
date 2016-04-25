app.controller("HomeCtr", function($scope,afiliadoService,$route) {
	$scope.usuario = {};
	$scope.afiliados = [];

    var cargo_id_presidencia = "9";
    var cargo_id_digitalizador = "35";

	function autenticar(){
		if( sessionStorage.getItem("usuario") ){
			$scope.usuario.usuario = sessionStorage.getItem("usuario");
			$scope.usuario.nombre = sessionStorage.getItem("nombre");
			$scope.usuario.rol = sessionStorage.getItem("rol");
			$scope.usuario.cargo_id = sessionStorage.getItem("cargo_id");
			$scope.usuario.cedula = sessionStorage.getItem("noDocumento");

		}else{
			window.location.href = "index.html";
		};
	};

	function tipoUsuario(){

		$("#m1").css("display", "block");
		$("#m2").css("display", "block");
		$("#m3").css("display", "block");

		if($scope.usuario.cargo_id == cargo_id_digitalizador){
			$("#m3").css("display", "none");
		}else{
			$("#m1").css("display", "none");
			$("#m2").css("display", "none");
		}

		if( $scope.usuario.cargo_id == '5' ) {
			$("#m1").css("display", "block");
			$("#m2").css("display", "block");
			$("#m3").css("display", "block");
		}
	}

	function loadBirthdays() {
		var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
		var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");

		var promiseGet = afiliadoService.getbirthdays();
        promiseGet.then(function (pl) {
			angular.forEach(pl.data.afiliados, function(value, key) {
				var f = new Date(value.fecha);
				//console.log(value.fecha,f)
				f.setFullYear( (new Date()).getFullYear() );
				f.setDate(f.getDate() + 1);
				//console.log(f,f.getDay(),f.getDate())
                value.dia = diasSemana[f.getDay()]  + ", " 
                            + ( f.getDate() ) + " de " + meses[f.getMonth()];
			});
            $scope.afiliados = pl.data.afiliados;
            $scope.total = pl.data.total;
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

	$scope.verCumpleanos = function () {
		cumpleanos = "S";		
		window.location.href = "home.html#/afiliado";
		$route.reload();
	};

	autenticar();
	//tipoUsuario();
	loadBirthdays();

    $scope.salir = function(){
      sessionStorage.clear();
      window.location.href = "index.html";
    };

});