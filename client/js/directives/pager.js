app.directive('pager', ['$location', function (location)
{
    return {
        restrict: 'E',
        //replace: true,
        scope: {
            itemsPerPage: '=',
            sumOfItems: '='
        },
        link: function ($scope, element, attrs)
        {

            $scope.$location = location;
            $scope.$watch('sumOfItems', function (newValue, oldValue)
            {
                if (newValue)
                {
                    var sumOfPages = Math.ceil(newValue / $scope.itemsPerPage);
                    $scope.range = new Array(sumOfPages);
                }
            });
            $scope.click = function (selectedIndex)
            {
                $scope.selectedIndex = selectedIndex;
            }

            $scope.$watch('$location.path()', function (newValue, oldValue)
            {
                $scope.selectedIndex = newValue.substring(newValue.lastIndexOf("/") + 1);
            });
        },

        templateUrl: '/templates/pager.html'
    }
}]);