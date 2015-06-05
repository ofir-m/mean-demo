/**
 * Created by maorof on 15/05/15.
 */

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
        //.state('login',
        //{
        //    url: '/login',
        //    templateUrl: '/views/login.html',
        //    controller: 'LoginController'
        //})
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

