app.service("afiliadoService", function ($http) {

    this.getAll = function() {
        var req = $http.get(uri + '/Afiliado'); 
        return req;
    };

    this.save = function(afiliado) {
        var req = $http.post(uri + '/Afiliado',afiliado); 
        return req;
    };

    this.update = function(afiliado) {
        var req = $http.put(uri + '/Afiliado/' + afiliado.id ,afiliado); 
        return req;
    };

    this.delete = function(afiliado){
        var req = $http.delete(uri + '/Afiliado/' + afiliado.id); 
        return req;
    };

});