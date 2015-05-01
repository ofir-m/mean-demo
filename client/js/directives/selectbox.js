app.directive('selectbox', function($location, $timeout, $rootScope)
{
    return {
        restrict: 'E',

        scope:
        {
            items: '='

        },
        templateUrl: '/templates/selectbox.html',
        replace: true,
        controller: function($scope, $element, $attrs, $timeout)
        {
            $scope.showList = false;
            $scope.label = $attrs.label;
            $scope.$emit('register', $attrs.items);

            $scope.$on('closeSelectBoxes', function(event, args)
            {
                if ($attrs.items != args)
                {
                    $scope.showList = false;
                };

            });

            $scope.toggleList = function()
            {

                $rootScope.$broadcast('closeSelectBoxes', $attrs.items);
                $scope.showList = !$scope.showList;
            }
            $scope.selectItem = function(item)
            {
                unselectAllItems();
                item.selected = true;
                // $scope.selectedItemId = item.id
                $scope.caption = item.name;
                $scope.showList = false;
            }

            function unselectAllItems(argument)
            {
                for (var i = 0; i < $scope.items.length; i++)
                {
                    var item = $scope.items[i];
                    item.selected = false;
                };
            }

            $scope.$watch('items', function(newVal)
            {
                if (newVal)
                {
                    for (var i = 0; i < $scope.items.length; i++)
                    {
                        var item = $scope.items[i];
                        if (item.selected == true)
                        {
                            $scope.caption = item.name;
                        }

                    };
                    if(!$scope.caption)
                    {
                        $scope.caption="בחר...";

                    }

                }
            }, true);

            $scope.$on('onRepeatLast', function(scope, element, attrs)
            {
                // for (var i = 0; i < $scope.items.length; i++)
                // {
                //     var item = $scope.items[i];
                //     if (item.selected == true)
                //     {
                //         $scope.caption = item.name;
                //     }

                // };
                // $scope.$apply();
            });

        }

    }
});
