var app = angular.module('LoginModule', []);

app.controller('LoginController', ['$scope', '$http', function($scope, $http){
	$scope.profile = {'email':'', 'password':''};


	$scope.init = function(){
		console.log('Login Controller: INIT');
	}

	$scope.login = function(){
		if ($scope.profile.email.length == 0){
			alert('Please Enter Your Email');
			return;
		}

		if ($scope.profile.password.length == 0){
			alert('Please Enter Your Password');
			return;
		}
		
		var json = JSON.stringify($scope.profile);

		console.log('Login: '+json);
		var url = '/api/login';

        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
			
            window.location.href = '/admin/account';
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
		
		
		
		
		
	}
	
	
	
	
}]);