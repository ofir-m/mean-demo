/**
 * Created by maorof on 15/05/15.
 */
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