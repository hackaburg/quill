angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    'AutocompleteService',
    function($scope, $rootScope, $state, $http, currentUser, Settings, Session, UserService, AutocompleteService){

      // Set up the user
      $scope.user = currentUser.data;

      var currentYear = new Date().getFullYear();
      $scope.graduationYears = [];
      for (var i = -1; i <= 10; i++) {
        $scope.graduationYears.push(currentYear + i);
      }


      // Populate the school dropdown
      populateSchools();
      populateDescriptions();
      populateNations();
      _setupForm();

      $scope.regIsClosed = Date.now() > Settings.data.timeClose;

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){
        AutocompleteService
          .getSchoolDomains()
          .then(function(res){
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]){
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        AutocompleteService
          .getOtherSchools()
          .then(function(res){ 
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,     
                onSelect: function(result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });          
      }

      function populateDescriptions(){
        AutocompleteService
          .getUserDescriptions()
          .then(function(res){ 
            var descriptions = res.data
                                  .trim()
                                  .split('\n')
                                  .map(function (description) {
                                    return {
                                      title: description.trim(),
                                    };
                                  });

            $('#description.ui.search')
              .search({
                source: descriptions,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.description = result.title.trim();
                }
              });
          });
      }

      function populateNations() {
        AutocompleteService
          .getNations()
          .then(function(res){
            $scope.nations = res.data;
          });
      }

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .success(function(data){
            sweetAlert({
              title: "Awesome!",
              text: "Your application has been saved.",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        $.fn.form.settings.rules.professionSelected = function(value) {
          var profession = $("input[name='profession']:checked").val();

          console.log(profession);

          return profession == "W" || profession == "S";
        };

        $.fn.form.settings.rules.schoolSelectedAndEmpty = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return (profession == "S" && value.length > 0) || profession == "W";
        };

        $.fn.form.settings.rules.workSelectedAndEmpty = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return (profession == "W" && value.length > 0) || profession == "S";
        };

        $.fn.form.settings.rules.travelReimbursementSelected = function(value) {
          var travelReimbursement = $("input[name='travel-reimbursement']:checked").val();

          console.log(travelReimbursement);

          return travelReimbursement == "Y" || travelReimbursement == "N";
        };

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            age: {
              identifier: 'age',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your age.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            nationality: {
              identifier: 'nationality',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your nationality.'
                }
              ]
            },

            profession: {
              identifier: 'profession',
              rules: [
                {
                  type: 'professionSelected',
                  prompt: 'Please select your profession.'
                }
              ]
            },

            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },

            subjectOfStudy: {
              identifier: 'subject-of-study',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please enter your subject of studies.'
                }
              ]
            },

            yearOfStudies: {
              identifier: 'year-of-studies',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please select your year of studies.'
                }
              ]
            },

            graduationYear: {
              identifier: 'graduation-year',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },

            workExperience: {
              identifier: 'work-experience',
              rules: [
                {
                  type: 'workSelectedAndEmpty',
                  prompt: 'Please enter your work experience.'
                }
              ]
            },

            travelReimbursement: {
              identifier: 'travel-reimbursement',
              rules: [
                {
                  type: 'travelReimbursementSelected',
                  prompt: 'Please select whether you need travel reimbursement.'
                }
              ]
            },

            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please describe yourself.'
                }
              ]
            },

            mlhTerms: {
              identifier: 'mlh-terms',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please accept the terms of MLH.'
                }
              ]
            },

            mlhCoc: {
              identifier: 'mlh-coc',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please accept the MLH code of conduct.'
                }
              ]
            },
          }
        });
      }



      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
        else{
          sweetAlert("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);
