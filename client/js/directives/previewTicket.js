app.directive('previewTicket', function () {
    return {
            restrict : 'E',
            replace: true,  
             scope: {
            member: '=' 
        },  
            templateUrl: '/templates/previewTicket.html',
    }
});