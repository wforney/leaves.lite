var env = {};
if(window){  
	Object.assign(env, window.__env);
}

var app = angular.module('leavesNext');
(function(app){

	"use strict";

	app.constant('ENV', env);

	disableLogging.$inject = ['$logProvider', 'ENV'];

	// app config
	function disableLogging($logProvider, ENV) {
		$logProvider.debugEnabled(ENV.ENABLEDEBUG);
	}

	app.controller('mainController', ['$scope', '$http', '$state', '$location', '$rootScope','ENV', function($scope, $http, $state, $location, $rootScope, ENV) {

		$rootScope.isidexit = 0
    	$rootScope.readerFromInbox = true
		var tags_list = []
    	$rootScope.listArray = []
    	$rootScope.leaves = []
		$scope.userLoggedIn = false
	    $scope.tagsArray = []

	    $http({
	        method: 'GET',
	        url: ENV.LEAVES_API_URL + '/api/tags',
	        params: {
	            access_token: ENV.LEAVES_API_ACCESSTOKEN
	        }
	    }).then(function(success) {
	        angular.forEach(success.data, function(value) {
	            var slug = value.label.split(' ').join('-')
	            tags_list.push({
	                id: value.id,
	                label: value.label,
	                slug: slug,
                	active: false
	            })
	        })
	    }).catch(function(response) {
	        $scope.error = response
	    })
	    $scope.tags = tags_list

	    $scope.goToHome = function() {
	        $state.go('home', {
	            tag: 'home'
	        })
            $rootScope.cardViewActive = true
        	$scope.tagsArray = []
	    }

	    function sortTagArray(){
	        $scope.tags.sort(function(x, y) {
	            // true values first
	            return (x.active === y.active)? 0 : x.active? -1 : 1;
	            // false values first
	            // return (x === y)? 0 : x? 1 : -1;
	        });
	    }

	    $scope.multipleTagSelect = function(tagsArrayValues, tagSlug){
	        var tagIndex = $scope.tagsArray.indexOf(tagSlug)
	        var slugIndex = $scope.tags.findIndex(obj => obj.slug == tagSlug);
	        if(tagIndex < 0){
	            $scope.tagsArray.push(tagSlug)
	            $scope.tags[slugIndex]['active'] = true
	        }else{
	            removeItem($scope.tagsArray, tagIndex)
	            $scope.tags[slugIndex]['active'] = false
	        }
	        $state.go('home', {tag:$scope.tagsArray.join(',')})
	        sortTagArray()
	    }

	    function removeItem(items, i){
	        $scope.tagsArray.splice(i, 1)
	    }

	    $scope.selectionTag=[];

		$scope.toggleSelection = function toggleSelection(gender) {
			var idx = $scope.selectionTag.indexOf(gender);
			if (idx > -1) {
				// is currently selected
				$scope.selectionTag.splice(idx, 1);
			}
			else {
				// is newly selected
				$scope.selectionTag.push(gender);
			}
		};

}])
})(app);