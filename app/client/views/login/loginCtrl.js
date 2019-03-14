angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    function($scope, $http, $state, settings, Utils, AuthService){
      $scope.isBusy = false;

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function startWork() {
        $scope.isBusy = true;
      }

      function finishWork() {
        $scope.isBusy = false;
      }

      function onSuccess() {
        $state.go('app.dashboard');
        finishWork();
      }

      function onError(data){
        $scope.error = data.message;
        finishWork();
      }

      function resetError(){
        $scope.error = null;
      }

      function isFormValid() {
        if (!$scope.email) {
          onError({
            message: "Please provide your mail address",
          });

          return false;
        }

        if (!$scope.password) {
          onError({
            message: "Please provide a password",
          });

          return false;
        }

        return true;
      }

      $scope.login = function(){
        if (!isFormValid()) {
          return;
        }

        startWork();
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        if (!isFormValid()) {
          return;
        }

        startWork();
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        sweetAlert({
          title: "Don't Sweat!",
          text: "An email should be sent to you shortly.",
          type: "success",
          confirmButtonColor: "#e76482"
        }, function () {
          $scope.setLoginState("login");
        });
      };

    }
  ]);
