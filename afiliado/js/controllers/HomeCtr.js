app.controller("HomeCtr", function($scope) {
	$scope.usuario = {};
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

	autenticar();
	//tipoUsuario();

    $scope.salir = function(){
      sessionStorage.clear();
      window.location.href = "index.html";
    };

});