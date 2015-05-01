app.directive('datebox', function ($location, $timeout, $rootScope, Cities)
{
    return {
        restrict: 'E',

        scope: {
            item: '=',
            age:"="
            // sumOfItems: '='
        },
        templateUrl: '/templates/datebox.html',
        replace: true,
        controller: function ($scope, $element, $attrs, $timeout)
        {
            console.log($scope.item)

            $scope.label = $attrs.label;
            $scope.getAge = function (dateString)
            {
                var today = new Date();
                var arr = dateString.split('/')
                var birthDate = new Date(arr[2], arr[1], arr[0]);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = (today.getMonth() + 1) - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
                {
                    age--;
                }
               $scope.age=age;
                return age;
            }
            $scope.closeSelectBoxes = function ()
            {
                $rootScope.$broadcast('closeSelectBoxes', $attrs.item);
            }

        }
    }

});
