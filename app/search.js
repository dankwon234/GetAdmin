var app = angular.module('SearchModule', []);

app.controller('SearchController', ['$scope', '$http', function($scope, $http){
	$scope.searchInput = '';
	$scope.productResults = new Array();
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.cart = null;


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
            fetchCarts();
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	function fetchCarts(){
			var url = '/api/mycarts';
	        var headers = {headers: {'Authorization': $scope.token}};
	        $http.get(url, headers).success(function(data, status, headers, config) {
	        	var results = data['results'];
	        	console.log(JSON.stringify(results));
	        	
	            if (results.confirmation != 'success'){
	                alert(results['message']);
	                return;
	            }
	            
	            $scope.cart = results['carts'][0];
				
	        }).error(function(data, status, headers, config){
	            console.log("error", data, status, headers, config);
	        });
		}

	$scope.addToCart = function(item, site, result){
		var addItem = {'id':item.id, 'name':result.name, 'brand':result.brand, 'image':result.images[0], 'price':item.price, 'seller':item.seller, 'sku':site.sku, 'url':site.url};
		$scope.cart['items'].push(addItem);
		console.log(JSON.stringify($scope.cart));

		var json = JSON.stringify($scope.cart);
		var url = '/api/carts/'+$scope.cart['id'];
		var headers = {headers: {'Authorization': $scope.token}};
		$http.put(url, json, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	alert("Added to Cart");
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	$scope.delete = function(item){
		var index = $scope.cart['items'].indexOf(item);
		console.log(index);
    	$scope.cart['items'].splice(index, 1);
    	console.log(JSON.stringify($scope.cart));

    	var json = JSON.stringify($scope.cart);
		var url = '/api/carts/'+$scope.cart['id'];
		var headers = {headers: {'Authorization': $scope.token}};
		$http.put(url, json, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
			
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
		$scope.loading = true;
		var url = '/api/search?query='+ $scope.searchInput + '&offset=' +$scope.productResults.length;
		console.log('SEARCH: '+url);
		
		var headers = {headers: {'Authorization': $scope.token}};
        $http.get(url, headers).success(function(data, status, headers, config) {
        	var results = data['results'];
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }

			$scope.loading = false;
			var list = results.products;
			for (var i=0; i<list.length; i++)
				$scope.productResults.push(list[i]);
			
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	
	
	
}]);