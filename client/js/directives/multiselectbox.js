app.directive('multiselectbox', function($location, $timeout, $rootScope) {
	return {
		restrict: 'E',
		//replace: true,
		scope: {
			items: '=',
			columns: '=',
			hideFirstItem: '='
				//selectedItemsIds: '='
		},
		templateUrl: '/templates/multiselectbox.html',
		replace: true,
		require: '^myForm',
		link: function(scope, element, attrs, myFormCtrl) {
			myFormCtrl.callFromChild();
		},
		controller: function($scope, $element, $attrs, $timeout) {
			$scope.showList = false;
			$scope.value = '';
			$scope.label = $attrs.label;
			console.log($scope.hideFirstItem)
			$scope.$emit('register', $attrs.items);
			$scope.$on('onRepeatLast', function(scope, element, attrs) {
				$element.find('li').css('width', '200px');
				$element.find('ul').css('width', $scope.columns * 202);

				$scope.value = getValue();
				$scope.$apply();
			});


			// $scope.$watch('value', function(value) {

			// 	$scope.$emit('change', {prop:$attrs.items,value:value});
			// });

			function getValue() {
				var arr = []
				for (var i = 0, length = $scope.items.length; i < length; i++) {
					var selectedItem = $scope.items[i];
					if (selectedItem.selected) {
						arr.push(selectedItem.name)
					};

				};
				var value = arr.join(', ')
				$scope.$emit('change', {
					prop: $attrs.items,
					value: value
				});
				if (value === '') {
					value = $attrs.defaultText || 'בחר...'
				};
				validate()
				return value;

			}

			function validate() {



			}

			function unselectAllItems() {

				for (var i = 0, length = $scope.items.length; i < length; i++) {
					var item = $scope.items[i];
					item.selected = false;

				};


			}

			function getItemByName(name) {

				for (var i = 0, length = $scope.items.length; i < length; i++) {
					var item = $scope.items[i];
					if (item.name == name) {
						return item;
					};

				};
				return null;

			}

			function unselectItem(name) {

				var item = getItemByName(name);
				if (item) {
					item.selected = false;
				};


			}
			$scope.$on('documentClicked', function(event, args) {
				if ($attrs.items!=args) {
					$scope.showList = false;
				};
				
			});

			$scope.toggleList = function() {
				
				$rootScope.$broadcast('documentClicked',$attrs.items);
				$scope.showList = !$scope.showList;
			}


			$scope.toggleItem = function(item) {
				if (item.selected) {
					item.selected = false;
				} else {
					if (item.name == 'לא משנה') {
						unselectAllItems()
					} else {
						unselectItem('לא משנה')

					}

					item.selected = true;

				}
				$scope.value = getValue();

			}

		},


	}
});