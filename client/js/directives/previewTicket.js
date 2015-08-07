app.directive('previewTicket', function ($rootScope,chatManager)
{
    return {
        restrict: 'E',
        replace: true,
        scope: {
            member: '='
        },
        templateUrl: '/templates/previewTicket.html',
        link: function ($scope, element, attrs)
        {

            $scope.startChat = function ()
            {

                $rootScope.$broadcast('startChat',$scope.member.email,$scope.member.username);
               // chatManager.addChat($scope,$scope.member.email);
            }

        }
    }
});