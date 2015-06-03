var app = angular.module('SearchModule', []);

app.controller('SearchController', ['$scope', '$http', function($scope, $http){
	$scope.searchInput = '';
	$scope.productResults = new Array();
	$scope.profile = null;
	$scope.token = null;

//This guy, man. AMIRITE?
	$scope.init = function(){
		console.log('Search Controller: INIT');
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

	$scope.search = function(isInitial){
        if ($scope.searchInput == ''){
            alert("Enter a Search Value!");
			return;
        }
		
		console.log('INIIAL: '+isInitial);
		if (isInitial=='yes')
			$scope.productResults = new Array();
		
		
//		var url = 'http://www.get-gt.appspot.com/api/search?query='+ $scope.searchInput + '&offset=' +$scope.productResults.length;
		var url = '/api/search?query='+ $scope.searchInput + '&offset=' +$scope.productResults.length;
		console.log('SEARCH: '+url);
		
		var headers = {headers: {'Authorization': $scope.token}};
        $http.get(url, headers).success(function(data, status, headers, config) {
            if (data['results'].confirmation != 'success'){
                alert(data['message']);
                return;
            }
			
			var list = data['results'].products;
			for (var i=0; i<list.length; i++)
				$scope.productResults.push(list[i]);
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	
	
	
}]);