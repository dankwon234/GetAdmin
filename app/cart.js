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
	
	
	$scope.update = function(){
		var required = ['firstName', 'lastName', 'email', 'address', 'city', 'state'];
		var missing = null;
		for (var i=0; i<required.length; i++){
			var property = required[i];
			if ($scope.profile[property].length == 0){
				missing = property;
				break;
			}
		}
		
		if (missing != null){
			alert('Please enter your '+missing);
			return;
		}
		
		$scope.loading = true;
		var json = JSON.stringify($scope.profile);
		console.log('UPDATE: '+json);
		
		var url = '/api/profiles/'+$scope.profile.id;
		var headers = {headers: {'Authorization': $scope.token}};
        $http.put(url, json, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.loading = false;
            alert('Profile Updated');
            $scope.profile = results['profile'];
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	
	
	
	
}]);