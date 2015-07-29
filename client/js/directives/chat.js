app.directive('chat', function ($rootScope,chatManager)
{
    return {
        restrict: 'E',
        replace: true,
        scope: {
            receiverEmail: '@'
          //  chats:'='

        },
        link: function ($scope, $element, attrs)
        {
            //$scope.me = $rootScope.me;
            $scope.senderEmail = $rootScope.me.email;
           // $scope.receiverEmail = $scope.member.email;
            $scope.show = true;

            var content = $element.find('#content')
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
            $scope.remove = function ()
            {
                $element.remove();
                $scope.$destroy()
            }
            //$scope.$on('$destroy', function(){
            //    alert('Put unbind handlers for timers etc. here')
            //})

        },

        templateUrl: '/templates/chat.html'
    }
});
