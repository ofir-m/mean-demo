/**
 * Created by maorof on 15/05/15.
 */
app.directive('fileModel', ['$parse', function($parse)
{
    return {
        restrict: 'A',
        link: function(scope, element, attrs)
        {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function()
            {
                scope.$apply(function()
                {
                    modelSetter(scope, element[0].files[0]);
                });
            });
            scope.$watch(model, function(newValue)
            {
                if (newValue)
                {
                    element[0].value = ""; //delete all files from list
                };
            })
        }
    };
}]);
app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
app.directive('fileOnChange', function($parse)
{
    return {
        restrict: 'A',
        link: function(scope, element, attrs)
        {
            var fileOnChange = $parse(attrs.fileOnChange);
            element.on('change', function(e)
            {
                // The event originated outside of angular,
                // We need to call $apply
                // scope.$apply(function()
                // {
                fileOnChange(scope,
                    {
                        $event: e
                    });
                // });
            });
        }
    };
});
app.directive('datepicker', function()
{
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl)
        {
            $(function()
            {
                element.datepicker(
                    {
                        dateFormat: 'dd/mm/yy',
                        changeMonth: true,
                        changeYear: true,
                        onSelect: function(date)
                        {
                            ngModelCtrl.$setViewValue(date);
                            scope.$apply();
                        }
                    });
            });
        }
    }
});
app.directive('onLastRepeat', function($rootScope)
{
    return function(scope, element, attrs)
    {
        if (scope.$last) setTimeout(function()
        {
            $rootScope.$broadcast('onRepeatLast', element, attrs);

        }, 1);
    };
})
