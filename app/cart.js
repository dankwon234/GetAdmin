var app = angular.module('CartModule', []);

app.controller('CartController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.items = new Array();
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
		var cartId = request.getResourceIdentifier();
		var url = '/api/carts/'+cartId;
        var headers = {headers: {'Authorization': $scope.token}};
        $http.get(url, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.cart = results['carts'];
            $scope.items = $scope.cart.items;
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	$scope.checkout = function(){
		return;
	}
	




}]);