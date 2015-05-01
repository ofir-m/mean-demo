var app = angular.module('richrach', ['ngResource', 'ngRoute', 'ui.router']);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider)
    {
        /*$routeProvider.
        when('/register', {
            templateUrl: '/views/register.html',
            controller: 'RegisterController'
        }).when('/members/pages/:pageId', {
            templateUrl: 'views/members.html',
            controller: 'MembersController'
        }).otherwise({
            redirectTo: '/AddNewOrder'
        });*/
        $locationProvider.html5Mode(true);
    }
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)
{
    //$urlRouterProvider.otherwise('/shows');

    $stateProvider
        .state('register',
        {
            url: '/register',
            templateUrl: '/views/register.html',
            controller: 'RegisterController'
        })
        .state('myImages',
        {
            url: '/myImages',
            templateUrl: '/views/myImages.html',
            controller: 'ImagesController'
        })
        .state('members',
        {
            url: '/members',
            abstract: true,
            templateUrl: 'views/members.html',
            controller: 'MembersController'
        }).state('members.page',
        {
            url: '/page/:pageId',
            templateUrl: 'views/members-page.html',
            controller: 'MembersPageController'
        })
    $urlRouterProvider.when('/members', '/members/page/1');
}]);

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

jQuery(function($)
{
    $.datepicker.regional['he'] = {
        closeText: 'סגור',
        prevText: '&#x3c;הקודם',
        nextText: 'הבא&#x3e;',
        currentText: 'היום',
        monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
            'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ],
        monthNamesShort: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'
        ],
        dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
        dayNamesShort: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        dayNamesMin: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        weekHeader: 'Wk',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: true,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['he']);
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

app.service('fileUpload', function($http,$rootScope)
{
    this.uploadFileToUrl = function(file, folder, index, width, height)
    {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('index', index);
        fd.append('width', width);
        fd.append('height', height);

        $http.post(folder, fd,
            {
                transformRequest: angular.identity,
                headers:
                {
                    'Content-Type': undefined
                }
            }).success(function(data, status, headers, config) {
               // alert('imageUploadedSuccess')
                $rootScope.$broadcast('imageUploadedSuccess');
            }).error(function(data, status, headers, config) {
               // alert('imageUploadedError')
                $rootScope.$broadcast('imageUploadedError');
            });
    }
});
app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});

app.factory("fileReader", function($q, $log)
{

    var onLoad = function(reader, deferred, scope)
    {
        return function()
        {
            scope.$apply(function()
            {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function(reader, deferred, scope)
    {
        return function()
        {
            scope.$apply(function()
            {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope)
    {
        return function(event)
        {
            scope.$broadcast("fileProgress",
            {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function(deferred, scope)
    {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function(file, scope)
    {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
});

app.filter('startsWith', function ()
{
    function strStartsWith(str, prefix)
    {
        return (str).indexOf(prefix) === 0;
    }

    return function (items, prefix)
    {
        var filtered = [];
        if(!items||prefix.length<2)return filtered;
        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            if(strStartsWith(item.name, prefix))
            {
              filtered.push(item);
            }
        }
        return filtered;
    };
});
//app.filter('startWith', function() {
//
//
//
//
//    return function( items, amount) {
//
//
//        var filtered = [];
//
//        angular.forEach(items, function(item) {
//            if(strStartsWith(item.amount, amount)){
//                filtered.push(item);
//            }
//        });
//
//        return filtered;
//    };
//});
app.factory('Member', function($resource)
{
    return $resource('/api/member');
}).factory('Member1', function($resource)
{
    return $resource('/api/member/:id', {},
        {
            update: { method: 'PUT' }
        });
}).factory('MemberDetails', function($resource)
{
    return $resource('/api/member/details/:email');
}).factory('Cities', function($resource)
{
    return $resource('/api/cities/:prefix');
}).factory('Count', function($resource)
{
    return $resource('/api/members/count');
}).factory('Members', function($resource)
{
    return $resource('/api/members/page/:pageId');
}).factory('Genders', function($resource)
{
    return $resource('/api/genders');
}).factory('Habits', function($resource)
{
    return $resource('/api/habits');
}).factory('Zodiacs', function($resource)
{
    return $resource('/api/zodiacs');
}).factory('Images', function($resource)
{
    return $resource('/api/images/:email/:index',
    {},
    {
        remove:
        {
            method: 'DELETE'
        }
    });
});
