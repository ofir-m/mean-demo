app.directive('textbox', function ($location, $timeout, $rootScope, Cities, validator)
{
    return {
        restrict: 'E',

        scope: {
            item: '=',
            defaultText: '@'

        },
        templateUrl: '/templates/textbox.html',
        replace: true,
        controller: function ($scope, $element, $attrs, $timeout)
        {
            var rules = [];
            //if($attrs.validationRules)
            //{
            //    rules=  $attrs.validationRules.split(', ');
            //
            //}


            $scope.$watch('item', function (newVal)
            {
                if (newVal)
                {
                    $scope.value = $scope.item;
                }


            }, true);
            $scope.notInList = false;
            $scope.currentIndex = -1;
            $scope.items = 0;
            $scope.label = $attrs.label;
            $scope.selectItem = function (item)
            {
                item.selected = true;
                $scope.value = item;
                $scope.items = []
            }
            $scope.closeSelectBoxes = function ()
            {
                $rootScope.$broadcast('documentClicked', $attrs.item);
            }

            $scope.validate = function ()
            {
                $scope.validationError = validator.validate($scope.value, $attrs.validationRules);

            }

        }

    }
});
