var app = angular.module('CartModule', []);

app.controller('CartController', ['$scope', '$http', function($scope, $http){
	var status = null;
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.cart = null;
	
	// TWO TAP STUFF:
	$scope.twoTapCartId = null;
	$scope.twoTapCartData = null;
	// $scope.products = new Array();
	$scope.checkoutInfo = null;
	$scope.finalPrice = null;
	$scope.salesTax = null;
	$scope.shippingPrice = null;

	
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

			var requestInfo = parseLocation('admin');
    		console.log(JSON.stringify(requestInfo));
    	
    		if (requestInfo.params.id==null){
        		console.log('CartController: MISSING CART ID');
       		 	return;
    		}
    	
			fetchCart(requestInfo.params.id);

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	
	function fetchCart(cartId){
		var url = '/api/carts/'+cartId;
        var headers = {headers: {'Authorization': $scope.token}};
         $http.get(url, headers).success(function(data, status, headers, config) {
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
	

	$scope.registerCart = function(){
		var items = $scope.cart['items'];
		var urls = [];
		for (var i=0; i<items.length; i++){
			var item = items[i];
			urls.push(item.url);
			console.log(JSON.stringify(urls));
		}

		var json = JSON.stringify({'products':urls});
		console.log(json);
		
		var url = '/twotap/cart';
        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	$scope.twoTapCartId = results.twoTapResponse.cart_id;
        	$scope.loading = true;
        	status = setInterval($scope.getStatus(), 5000);
        	
            if (results.confirmation != 'success'){
                alert(results['message']);
                return;
            }
            
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	$scope.getStatus = function(){
		console.log('GET STATUS: ');
 		if ($scope.twoTapCartId==null)
 			return;
 		
		var url = '/twotap/status?cart='+$scope.twoTapCartId;
		$http.get(url).success(function(data, status, headers, config) {
        	var message = data['message'];
        	if (message == 'has_failures'){
        		$scope.loading=false;
        		clearInterval(status);
        		alert("TwoTap Cart Registration Has Failures");
        		return;
        	}
        	
        	if (message != 'still_processing'){
        		$scope.twoTapCartData = data;
        		$scope.estimateTaxAndShipping();
        	}
        	
        	console.log(JSON.stringify(data));

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	$scope.estimateTaxAndShipping = function(){
		if ($scope.twoTapCartData == null){
			// can't continue
			return;
		}
		
		// prepare package with necessary info to send to backend for estimates:
		$scope.checkoutInfo = {'cart_id':$scope.twoTapCartData.cart_id};
		
		var sites = $scope.twoTapCartData['sites'];
		var keys = Object.keys(sites); // this gives back and array
		// console.log(JSON.stringify(keys));

		var shipping = {};
		shipping['shipping_country'] = 'United States of America';
		shipping['shipping_state'] = 'New York';
		shipping['shipping_first_name'] = 'Alex';
		shipping['shipping_city'] = 'new york';
		shipping['shipping_address'] = '53 Park Place';
		shipping['shipping_zip'] = '10007';
		shipping['shipping_last_name'] = 'Kelleher';
		shipping['shipping_telephone'] = '16469440155';
		
		var fields_input = {};
		for (var i=0; i<keys.length; i++){
			var key = keys[i]; // each key is a 'site ID'
			fields_input[key] = {'addToCart':'','noauthCheckout':''};
			var s = sites[key];
			var addToCart = s['add_to_cart'];
			var productId = Object.keys(addToCart).toString();
			var requiredFields = {};
			fields_input[key].addToCart = { productId:requiredFields };
			fields_input[key].noauthCheckout = shipping;
		}
		
		$scope.checkoutInfo['fields_input'] = fields_input;

		
		var json = JSON.stringify($scope.checkoutInfo);
		console.log('Estimate Tax And Shipping: '+json);

		var url = '/twotap/estimates';
        $http.post(url, json).success(function(data, status, headers, config) {
        	clearInterval(status);
        	var results = data['results'];
        	console.log(JSON.stringify(data));
        	$scope.finalPrice = results.twoTapResponse.estimates[key].prices.final_price;
			$scope.salesTax = results.twoTapResponse.estimates[key].prices.sales_tax;
			$scope.shippingPrice = results.twoTapResponse.estimates[key].prices.shipping_price;
        	$scope.loading = false;
        	
            if (results.confirmation != 'success'){
                 alert(results['message']);
                 return;
            }

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	$scope.purchase = function(){
		return;
	}
	
	$scope.checkout = function(){
		return;
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