app.directive('textboxCities', function ($location, $timeout, $rootScope, validator)
{
    return {
        restrict: 'E',

        scope: {
            items: '='

        },
        templateUrl: '/templates/textboxCities.html',
        replace: true,
        controller: function ($scope, $element, $attrs, $timeout, startsWithFilter)
        {
            //   var startsWith=$filter('startsWith')
            $scope.filteredItems = [];
            var input = $element.find('input.real')[0];
            $scope.$watch('filteredItems', function (newVal)
            {
                if (newVal)
                {
                    var appearsInFilteredItems = false;
                    var filteredItemsLength = $scope.filteredItems.length
                    for (var i = 0; i < filteredItemsLength; i++)
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
                    var userEnteredFullCityName = filteredItemsLength == 1 && $scope.value == $scope.filteredItems[0].name
                    $scope.showList = userEnteredFullCityName ? false : true;

                }
            }, true);


            //$scope.$watch('value', function (newVal)
            //{
            //    if (newVal)
            //    {
            //
            //        $scope.validate(newVal);
            //    }
            //}, true);

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
                $rootScope.$broadcast('documentClicked', $attrs.items);
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
                    var city = $scope.filteredItems[$scope.currentIndex] || getCityFromItems($scope.value);
                    if (!city)
                    {
                        $scope.value = '';
                        $scope.validate();
                    }
                    else
                    {
                        $scope.selectCity(city);
                    }


                }
            }

            $scope.validate = function ()
            {
                $scope.validationError = validator.validate($scope.value, $attrs.validationRules);

            }
            function getCityFromItems(city)
            {
               // var cities =startsWithFilter($scope.items, city);
              for(var i= 0,length=$scope.items.length;i<length;i++)
              {
                  var currentCity=$scope.items[i].name;
                  if(city===currentCity)
                  {
                      return city
                  }
              }
                return  null;
            }

            $scope.$on('documentClicked', function(event, args)
            {
                var city =  getCityFromItems($scope.value);
                console.log($scope.value)
                if (!city)
                {
                    $scope.value = '';
                    $scope.validate();
                }

            });

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
                //$scope.currentIndex=-1
                input.blur();
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


        }

    }
});
