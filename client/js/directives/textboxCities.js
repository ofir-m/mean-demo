app.directive('textboxCities', function ($location, $timeout, $rootScope, Cities)
{
    return {
        restrict: 'E',

        scope: {
            items: '='

        },
        templateUrl: '/templates/textboxCities.html',
        replace: true,
        controller: function ($scope, $element, $attrs, $timeout)
        {
            $scope.filteredItems = [];
            var input = $element.find('input.real')[0];
            $scope.$watch('filteredItems', function (newVal)
            {
                if (newVal)
                {
                    var appearsInFilteredItems = false;
                    var filteredItemsLength=$scope.filteredItems.length
                    for (var i = 0 ; i < filteredItemsLength; i++)
                    {
                        var city = $scope.filteredItems[i];
                        if (city.name == $scope.autocomplete.name)
                        {
                            $scope.currentIndex = i;
                            appearsInFilteredItems = true;
                        }
                    }
                    if (appearsInFilteredItems == false)
                    {
                        $scope.autocomplete = ""
                    }
                    var userEnteredFullCityName=filteredItemsLength == 1 && $scope.value == $scope.filteredItems[0].name
                    $scope.showList = userEnteredFullCityName ? false : true;

                }
            }, true);

            var watch = $scope.$watch('items', function (newVal)
            {
                if (newVal)
                {
                    watch();//remove the watch
                    $scope.value = getSelectCity($scope.items).name;

                }
            }, true);
            $scope.closeSelectBoxes = function ()
            {
                $rootScope.$broadcast('closeSelectBoxes', $attrs.items);
            }
            $scope.notInList = false;
            $scope.currentIndex = -1;
            $scope.listItems = 0;
            $scope.label = $attrs.label;
            $scope.autocomplete = ""


            function changeCurrentIndex(step)
            {
                var firstIndex = 0;
                var lastIndex = $scope.filteredItems.length - 1;
                $scope.currentIndex = $scope.currentIndex + step;
                if ($scope.currentIndex > lastIndex)
                {
                    $scope.currentIndex = firstIndex;
                }
                if ($scope.currentIndex < firstIndex)
                {
                    $scope.currentIndex = lastIndex;
                }
                $scope.autocomplete = $scope.filteredItems[$scope.currentIndex]


            }

            $scope.highlightCities = function ($event)
            {

                // $scope.autocomplete =""
                if (event.which === 40) //down
                {
                    changeCurrentIndex(1);
                    return;
                }
                else if (event.which === 38) //up
                {
                    event.preventDefault();//prevent cursor jump to start
                    changeCurrentIndex(-1);
                    var strLength = input.value.length;

                    if (input.setSelectionRange !== undefined)
                    {
                        input.setSelectionRange(strLength, strLength);
                    } else
                    {
                        $(input).val(input.value);
                    }

                    return;
                }
                else if (event.which === 13)
                {

                    var city = $scope.filteredItems[$scope.currentIndex]
                    $scope.selectCity(city)
                    return;
                }
                ;
            }

            $scope.selectCity = function (city)
            {
                $scope.value = city.name
                // var city= getCityFromItems(city)
                for (var i = 0, length = $scope.items.length; i < length; i++)
                {
                    if ($scope.items[i].name == city.name)
                    {
                        $scope.items[i].selected = true;
                    }
                    else
                    {
                        $scope.items[i].selected = false;
                    }
                }

            }

            function getSelectCity(item)
            {
                for (var i = 0, length = item.length; i < length; i++)
                {
                    var city = item[i];
                    if (city.selected)
                    {
                        return city;
                    }
                }
                return null;

            }

            //$scope.getCities = function($event)
            //{
            //    $scope.currentIndex = -1;
            //    Cities.query(
            //    {
            //        'prefix': $scope.value.name
            //    }, function(data)
            //    {
            //              $scope.listItems = data;
            //        $scope.notInList = $scope.listItems.length == 0 ? true : false;
            //
            //    });
            //
            //}
        }

    }
});
