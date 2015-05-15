app.directive('textbox', function($location, $timeout, $rootScope, Cities,validator)
{
    return {
        restrict: 'E',

        scope:
        {
            item: '=',
            defaultText: '@'

        },
        templateUrl: '/templates/textbox.html',
        replace: true,
        controller: function($scope, $element, $attrs, $timeout)
        {
          //  var validator=new validator()
            $scope.showValidationError=false;

            $scope.$watch('item', function(newVal)
            {
                if (newVal)
                {
                    $scope.value = $scope.item;
                }


            }, true);
            $scope.notInList=false;
            $scope.currentIndex = -1;
            $scope.items = 0;
            $scope.label = $attrs.label;
            $scope.selectItem = function(item)
            {
                item.selected = true;
                $scope.value = item;
                $scope.items = []
            }
            $scope.closeSelectBoxes = function ()
            {
                $rootScope.$broadcast('closeSelectBoxes', $attrs.item);
            }

            $scope.validate = function()
            {
             //   validator.validate();
              //var obj= validator.validate($scope.value,"email");
              //  $scope.showValidationError=obj.showValidationError;
              //        $scope.ValidationError=obj.ValidationError;

            }
            //function validateEmail(email) {
            //    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            //    return re.test(email);
            //}
            //$scope.validate = function($event)
            //{
            //    if($scope.value=='')
            //    {
            //        $scope.showValidationError=true;
            //        $scope.ValidationError="זהו שדה חובה";
            //        //$scope.value=$scope.defaultText;
            //    }else
            //    if(!validateEmail($scope.value))
            //    {
            //        $scope.showValidationError=true;
            //        $scope.ValidationError="האימייל שהזנת אינו תקין";
            //    }
            //    else{
            //        $scope.showValidationError=false;
            //    }
            //
            //
            //}
        }

    }
});
