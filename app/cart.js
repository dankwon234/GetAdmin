var app = angular.module('CartModule', []);

app.controller('CartController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.cart = null;

	
	$scope.init = function(){
		console.log('Cart Controller: INIT');
		
		var url = '/api/account';
        $http.get(url).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.profile = results['profile'];
            $scope.token = results['token'];

            fetchCart();
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	function fetchCart(){
		var url = '/api/mycarts';
        var headers = {headers: {'Authorization': $scope.token}};
        $http.get(url, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.cart = results['carts'];
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	



	
}]);