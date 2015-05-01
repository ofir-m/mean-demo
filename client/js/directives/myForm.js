app.directive('myForm', function() {
	return {
		restrict: 'AE',
		//replace: true,
		// scope: {
		// 	items: '=',
		// 	columns: '=',
		// 	hideFirstItem: '='
		// 		//selectedItemsIds: '='
		// },
		// templateUrl: '/templates/multiselectbox.html',
		// replace: true,
		// require:'^myForm',
		controller: function($scope, $element, $attrs, $timeout) {
			$scope.fields=[]
			$scope.$on('register', function(event,data) {
				$scope.fields.push(data)
				//console.log($scope.fields)
			});
			$scope.$on('change', function(event,data) {

				$scope.fields[data.prop]=data.value;
				console.log($scope.fields)
			});
			this.callFromChild = function() {
				console.log('child is calling')
			}
		},


	}
});