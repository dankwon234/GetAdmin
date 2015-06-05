var app = angular.module('CartModule', []);

app.controller('CartController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.cart = null;
	$scope.products = {'products':[]};

	$scope.init = function(){
		// console.log('Cart Controller: INIT');

		// var url = 'http://57.get-gt.appspot.com/api/account';
  //       $http.get(url).success(function(data, status, headers, config) {
  //       	var results = data['results'];
  //       	console.log(JSON.stringify(results));
        	
  //           if (results.confirmation != 'success'){
  //               alert(results['message']);
  //               return;
  //           }
            
  //           $scope.profile = results['profile'];
  //           $scope.token = results['token'];

		// 	var requestInfo = parseLocation('admin');
  //   		console.log(JSON.stringify(requestInfo));
    	
  //   		if (requestInfo.params.id==null){
  //       		console.log('CartController: MISSING CART ID');
  //      		 	return;
  //   		}
    	
		// 	fetchCart(requestInfo.params.id);

  //       }).error(function(data, status, headers, config){
  //           console.log("error", data, status, headers, config);
  //       });
			fetchCart('161afaa7');		

	}
	
	function fetchCart(cartId){
		var url = 'http://57.get-gt.appspot.com/api/carts/'+cartId;
        //var headers = {headers: {'Authorization': $scope.token}};
        // $http.get(url, headers).success(function(data, status, headers, config) {
        $http.get(url).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
            $scope.cart = results['cart'];

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	$scope.checkout = function(){
		return;
	}

	$scope.registerCart = function(){
		var url = 'http://57.get-gt.appspot.com/twotap/cart/';
		$scope.products.products.push('http://www.walmart.com/ip/37603926');
		var json = JSON.stringify($scope.products);
		console.log(json);
		//array called products in json, each item in array is the URL
		// hard code products array. will be 1 item array
        $http.post(url, json).success(function(data, status, headers, config) {

        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	
            // if (results.confirmation != 'success'){
            //     alert(results['message']);
            //     return;
            // }
            

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	function parseLocation(stem){
    	console.log('PARSE LOCATION: '+stem);
    	var resourcePath = location.href.replace(window.location.origin, ''); // strip out the domain root (e.g. http://localhost:8888)
    	var requestInfo = {"resource":null, "identifier":null, 'params':{}};

    	// parse out the parameters:
    	var p = resourcePath.split('?');
    	if (p.length > 1){
    		var paramString = p[1];
    		var a = paramString.split('&');
    		var params = {};
    		for (var i=0; i<a.length; i++){
    			var keyValue = a[i].split('=');
    			if (keyValue.length<1)
    				continue;
    			
    			params[keyValue[0]] = keyValue[1];
    		}
    		
    		requestInfo['params'] = params;
    	}
    	
    	resourcePath = p[0];

    	var parts = resourcePath.split(stem+'/');
    	if (parts.length > 1){
    		var hierarchy = parts[1].split('/');
    		for (var i=0; i<hierarchy.length; i++){
    			if (i==0)
    				requestInfo['resource'] = hierarchy[i]

    			if (i==1) 
    			    requestInfo['identifier'] = hierarchy[i];
    			
    		}
    	}

    	return requestInfo;
    }



}]);