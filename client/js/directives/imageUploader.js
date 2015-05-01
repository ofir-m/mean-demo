app.directive('imageUploader', function($timeout, Images,$rootScope)
{
    return {
        restrict: 'E',

        scope:
        {
            index: '@',
            member: '='
        },
        templateUrl: '/templates/imageUploader.html',
        replace: true,
        controller: function($scope, $element, $attrs, $timeout, fileReader, fileUpload)
        {
            var folder='/fileUpload/' + $scope.member._id+'/';
            var images = $scope.member.images;
            var image = images[$scope.index];
            var img=$element.find('img.uploaded-image')[0];
            $scope.showPreloader=false;
            $scope.src = image.path;
            $scope.showBtnChoose = !$scope.src;
            $scope.width = image.width;
            $scope.height = image.height;
            $scope.pressHiddenInput = function(argument)
            {
                $timeout(function()
                {
                    $element.find('input[type="file"]').click();
                }, 0);

            }
            $scope.$watch('myFile', function(file)
            {
                if (file)
                {

                    img.onload = function()
                    {
                        console.log(this.width + " " + this.height);
                        if (this.width > this.height)
                        {
                            this.style.width = '200px';
                            this.style.height = 'auto';
                        }
                        else
                        {
                            this.style.height = '200px';
                            this.style.width = 'auto';
                        }

                    };
                    $scope.showBtnChoose = false;
                    showImagePreview(file);
                };
            })

            $scope.$on('imageUploadedSuccess', function (args) {
              $scope.src =  folder+$scope.myFile.name;
            })

            $scope.uploadFileToServer = function()
            {
                var file = $scope.myFile;
                console.log('file is ' + JSON.stringify(file));
              //  var uploadUrl = "/fileUpload/" + $scope.member._id;
                fileUpload.uploadFileToUrl(file, folder, ($scope.index * 1 + 1).toString(), img.style.width, img.style.height);
            };

            function showImagePreview(file)
            {
                $scope.showPreloader=true;
                $scope.src = "//:0";
                fileReader.readAsDataUrl(file, $scope)
                    .then(function(result)
                    {
                        $scope.showPreloader=false;
                        $scope.src = result;
                        //  };
                    });

            }
            $scope.deleteImage = function(argument)
            {
               // $scope.src = "//:0";
                $scope.src="Images/default-image.png"
                img.style.width = "80px";
                img.style.height = "100px";
                $scope.showBtnChoose = true;
                // var filepath = "/fileUpload/" + $scope.member._id + "/" + $scope.myFile.name;
                var email = $scope.member._id;
                var index = ($scope.index * 1 + 1).toString();
                Images.remove(
                {
                    email: email,
                    index: index
                });
            }

        }

    }
});
