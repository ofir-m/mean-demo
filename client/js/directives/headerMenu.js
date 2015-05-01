app.directive('headerMenu', function($rootScope) {
	return {
		restrict: 'E',
		//replace: true,
		scope: {
			itemsPerPage: '=',
			sumOfItems: '='
		},
		link: function($scope, element, attrs) {
			
			$scope.membersClicked = function() {
				$rootScope.$broadcast('membersClicked', [1,2,3]);
			}
		},
		
		
		templateUrl: '/templates/headerMenu.html',
	}
});