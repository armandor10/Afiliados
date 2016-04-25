app.service("actaService", function ($http) {

    this.getAll = function() {
        var req = $http.get(uri + '/Acta'); 
        return req;
    };

    this.getActa = function(acta) {
        var req = $http.get(uri + '/Acta/' + acta.id); 
        return req;
    };

    this.getVigencia = function() {
        var req = $http.get(uri + '/Vigencia'); 
        return req;
    };

    this.save = function(acta) {
        var req = $http.post(uri + '/Acta',acta); 
        return req;
    };

    this.saveHisActa = function(HisActa) {
        var req = $http.post(uri + '/HisActas',HisActa); 
        return req;
    };

    this.update = function(acta) {
        var req = $http.put(uri + '/Acta/' + acta.id ,acta); 
        return req;
    };

    this.uploadActa = function(fd){
        var req = $http.post(uri + "/Acta/upload", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        return req;
    };
    this.verDocumento = function(obj){
        var req = $http.post(uri + "/Afiliado/Documento", obj);
        return req;
    }

});