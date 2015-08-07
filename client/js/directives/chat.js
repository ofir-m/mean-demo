app.directive('chat', function ($rootScope, chatManager)
{
    return {
        restrict: 'E',
        replace: true,
        scope: {
            memberEmail: '@theMemberEmail',
            memberUsername: '@theMemberUsername',
            initialMessage: '@theInitialMessage'

        },
        link: function ($scope, $element, attrs)
        {
            $("#id_of_textbox").keyup(function(event){
                if(event.keyCode == 13){
                    $("#id_of_button").click();
                }
            });
            $scope.myEmail = $rootScope.me.email;
            $scope.myUsername = $rootScope.me.username;
            $scope.show = true;

            var content = $element.find('.content');
            var button = $element.find('button');
            var input = $element.find('input');
            input.keyup(function(event){
                if(event.keyCode == 13){
                    button.click();
                }
            });
            var socket = $rootScope.socket;
            $scope.message = '';
            if ($scope.initialMessage)
            {
                content.append($scope.memberUsername + ' :' +$scope.initialMessage+ '</br>')
            }
            //socket.on('get message', function (data)
            //{
            //    $scope.show = true;
            //    content.append($rootScope.me.email + ',' + data + '</br>')
            //
            //})
            $scope.$on('message arrived', function (event, data)
            {
                $scope.show = true;
                if (data.senderEmail == $scope.memberEmail )
                {
                    content.append($scope.memberUsername  + ' :' + data.message + '</br>')
                }
                else if(data.senderEmail == $scope.myEmail && data.receiverEmail == $scope.memberEmail)
                {
                    content.append($scope.myUsername  + ' :' + data.message + '</br>')
                }


            })

            $scope.sendMessage = function ()
            {
                socket.emit('send message', {
                    message: $scope.message,
                    senderEmail: $scope.myEmail,
                    receiverEmail: $scope.memberEmail
                });
                $scope.message = '';
            }
            $scope.close = function ()
            {
                $element.remove();
                $scope.$emit('chat closed',$scope.memberEmail)
                //$scope.$destroy();

            }


        },

        templateUrl: '/templates/chat.html'
    }
});
