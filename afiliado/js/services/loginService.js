app2.service("loginService", function ($http) {

    this.login = function (usuario) {
        var req = $http.post(uritimeit + '/usuario/autenticar', usuario); 
        return req;
    };

});