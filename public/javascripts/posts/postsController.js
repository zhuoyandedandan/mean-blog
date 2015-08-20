var posts = angular.module('posts', ['ngMessages', 'ngFileUpload', 'ui.bootstrap']);

var PublishController = function($scope, $http) {
    $scope.submitted = false;
    $scope.submitForm = function() {
        if ($scope.publishForm.$valid) { // 正常提交
            $http({
                method: 'POST',
                url: '/posts/publish',
                data: {
                    title: $scope.publish.title,
                    content: $scope.publish.content
                }
            }).success(function(data) {
                if (data.result === true) {
                    window.location = '/';
                } else {
                    $scope.publishForm.content.$setValidity('confirm', false);
                }
            }).error(function(error) {
                console.log(error);
            });
        } else {
            $scope.submitted = true;
        }
    };
};

var EditController = function($scope, $http) {
    $scope.submitted = false;
    $scope.submitForm = function() {
        if ($scope.editForm.$valid) { // 正常提交
            $http({
                method: 'POST',
                url: '/posts/edit',
                data: {
                    title: $scope.edit.title,
                    content: $scope.edit.content
                }
            }).success(function(data) {
                if (data.result === true) {
                    window.location = '/';
                } else {
                    $scope.editForm.content.$setValidity('confirm', false);
                }
            }).error(function(error) {
                console.log(error);
            });
        } else {
            $scope.submitted = true;
        }
    };
};

var UploadController = function($scope, Upload) {
    $scope.$watch('files', function() {
        $scope.upload($scope.files);
    });

    /* optional: set default directive values */
    //Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );

    $scope.log = '';
    $scope.uploadeds = [];

    $scope.upload = function(files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/posts/upload',
                    file: file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                        evt.config.file.name + '\n';
                }).success(function(data, status, headers, config) {
                    $scope.uploadeds.push(data);
                });
            }
        }
    };
};


var PostController = function($scope, $http) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;
    console.log($scope.totalItems );

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function($http) {
        $http({
                method: 'GET',
                url: '/posts/user/:username?p=' + $scope.currentPage,
            }).error(function(error) {
                console.log(error);
            });
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
};

PublishController.$inject = ['$scope', '$http'];
EditController.$inject = ['$scope', '$http'];
PostController.$inject = ['$scope', '$http'];
UploadController.$inject = ['$scope', 'Upload'];

posts.controller('PublishController', PublishController);
posts.controller('EditController', EditController);
posts.controller('PostController', PostController);
posts.controller('UploadController', UploadController);