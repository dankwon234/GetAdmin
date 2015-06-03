var app = angular.module('LoginModule', []);

app.controller('LoginController', ['$scope', '$http', function($scope, $http){
	$scope.profile = {'email':'', 'password':''};
	$scope.newUser = {'firstName':'', 'lastName':'', 'email':'', 'password':''};
	$scope.loading = false;



	$scope.init = function(){
		console.log('Login Controller: INIT');
	}

	$scope.register = function(){
		if ($scope.newUser.firstName.length==0){
			alert('Please enter your first name.');
			return;
		}
		
		if ($scope.newUser.lastName.length==0){
			alert('Please enter your last name.');
			return;
		}
		
		if ($scope.newUser.email.length==0){
			console.log(JSON.stringify($scope.profile));
			alert('Please enter your email.');
			return;
		}

		if ($scope.newUser.email.indexOf('@')==-1){
			alert('Please enter a valid email.');
			return;
		}
		
		if ($scope.newUser.password.length==0){
			alert('Please enter your password.');
			return;
		}

		$scope.loading = true;
		var json = JSON.stringify($scope.newUser);
    	var url = '/api/profiles';
        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
            console.log('CONFIRMATION: '+ results['confirmation']);
            
            if (results['confirmation'] != 'success'){
                alert(results['message']);
                $scope.loading = false;
                return;
            }
            
            window.location.href = '/admin/account';
            
            
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
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
		
		$scope.loading = true;
		var json = JSON.stringify($scope.profile);
		console.log('Login: '+json);
		var url = '/api/login';

        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                $scope.loading = false;
                return;
            }
			
            window.location.href = '/admin/account';
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
		
		
		
		
		
	}
	
	
	
	
}]);