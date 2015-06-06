var app = angular.module('CartModule', []);

app.controller('CartController', ['$scope', '$http', function($scope, $http){
	$scope.profile = null;
	$scope.token = null;
	$scope.loading = false;
	$scope.cart = null;
	
	// TWO TAP STUFF:
	$scope.twoTapCartId = null;
	$scope.twoTapCartData = null;
	$scope.products = new Array();
	$scope.checkoutInfo = null;

	
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
	

	$scope.registerCart = function(){
		$scope.products.push('http://www.abercrombie.com/shop/us/mens-socks-underwear-and-socks/a-and-f-casual-socks-4436081_01'); // batteries
//		$scope.products.push('http://www.barnesandnoble.com/w/in-the-unlikely-event-judy-blume/1120913060');
//		$scope.products.push('http://www.acehardware.com/product/index.jsp?productId=11888727');
		// $scope.products.push('http://www.bobwards.com/SRIXON-Q-Star-Golf-Ball-85622');
		
		
		var json = JSON.stringify({'products':$scope.products});
		console.log(json);
		
		//array called products in json, each item in array is the URL
		// hard code products array. will be 1 item array
		var url = 'http://57.get-gt.appspot.com/twotap/cart';
//		var url = '/twotap/cart/';
        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(results));
        	$scope.twoTapCartId = results.twoTapResponse.cart_id;
        	
            // if (results.confirmation != 'success'){
            //     alert(results['message']);
            //     return;
            // }
            
        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}

	$scope.getStatus = function(){
		if ($scope.twoTapCartId==null){
//			alert('First Register Your Cart by Clicking Step 1');
//			return;
			
			$scope.twoTapCartId = '5572852c41d0cc994d23e237';
		}
		
		var url = 'http://57.get-gt.appspot.com/twotap/status?cart='+$scope.twoTapCartId;
		$http.get(url).success(function(data, status, headers, config) {
        	var message = data['message'];
        	if (message != 'still_processing')
        		$scope.twoTapCartData = data;
        	
        	console.log(JSON.stringify(data));
        	alert(message);

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
//			pkg['fields_input'] = fields_input;
		}
		
		$scope.checkoutInfo['fields_input'] = fields_input;

		
		var json = JSON.stringify($scope.checkoutInfo);
		console.log('Estimate Tax And Shipping: '+json);

		var url = '/twotap/estimates';
        $http.post(url, json).success(function(data, status, headers, config) {
        	var results = data['results'];
        	console.log(JSON.stringify(data));
        	
            if (results.confirmation != 'success'){
                 alert(results['message']);
                 return;
            }

        }).error(function(data, status, headers, config){
            console.log("error", data, status, headers, config);
        });
	}
	
	
	$scope.purchase = function(){
		console.log('PURCHASE');
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