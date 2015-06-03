var app = angular.module('AccountModule', []);

app.controller('AccountController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;

	
	
	$scope.init = function(){
		console.log('Account Controller: INIT');
		
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