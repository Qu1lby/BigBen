angular.module('myApp', []).controller('authController', function ($scope, $http) {
   
  $scope.sendLogin = function() {
    
    var username = $scope.LogUsername;
    var password = $scope.LogPassword;
    var data = {
            username: username,
            password: password
    };
    
    $http.post("/login", data).success(function(data, status) {
        console.log(data);
    })
  }       
    
  $scope.sendSignin = function() {
    var username = $scope.SignUsername;
    var password = $scope.SignPassword;
    var email = $scope.SignEmail;
    var data = {
            username: username,
            password: password,
            email: email
    };
    
    $http.post("/signin", data).success(function(data, status) {
        console.log(data);
    })
  }                   
});