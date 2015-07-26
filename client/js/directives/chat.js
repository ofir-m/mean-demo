app.directive('chat', function ($rootScope,chatManager)
{
    return {
        restrict: 'E',
        replace: true,
        scope: {
            member: '='

        },
        link: function ($scope, element, attrs)
        {
            $scope.me = $rootScope.me;
            $scope.senderEmail = $scope.me.email;
            $scope.receiverEmail = $scope.member.email;
            $scope.show = true;

            var content = element.find('#content')
            var socket =$rootScope.socket;
           // var socket = io.connect();
            $scope.message = '';

            socket.on('get message', function (data)
            {
                $scope.show = true;
                //   $scope.senderEmail = $scope.member.email;
                content.append($rootScope.me.email + ',' + data + '</br>')

            })

            $scope.sendMessage = function ()
            {
                socket.emit('send message', {
                    message: $scope.message,
                    senderEmail: $scope.senderEmail,
                    receiverEmail: $scope.receiverEmail
                });
                $scope.message = '';
            }


        },

        templateUrl: '/templates/chat.html'
    }
});
