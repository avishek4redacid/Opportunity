'use strict';
app.controller('genrelistController', ['$scope', '$resource', function($scope, $resource) {
  var baseUrl;
  $("#earliest_start_date").datepicker({dateFormat: 'yy-mm-dd'});

  $("#latest_end_date").datepicker({dateFormat: 'yy-mm-dd'});

  $("#applications_close_date").datepicker({
    changeYear: true,
    minDate: '+30D',
    maxDate: '+90D',
    dateFormat: 'yy-mm-dd'
  });

  baseUrl = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/backgrounds?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
  $resource(baseUrl).query().$promise.then(function(data) {
    $scope.allBackgrounds = data;

  });

  baseUrl = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/skills?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
  $resource(baseUrl).query().$promise.then(function(data) {
    $scope.allSkills = data;

  });

  baseUrl = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/currencies?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
  $resource(baseUrl).query().$promise.then(function(data) {
    $scope.allCurrencies = data;
  });

  $scope.genreName = '';
  baseUrl = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/3?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
  $resource(baseUrl).get().$promise.then(function(data) {
    $scope.selectedBackgrounds = [];
    $scope.selectedSkills = [];
    $scope.selectedCurrency = null;
    $scope.opportunity = data;
    angular.forEach(data.backgrounds, function(background) {
      $scope.selectedBackgrounds.push(background.id);
    });

    angular.forEach(data.skills, function(skill) {
      $scope.selectedSkills.push(skill.id);
    });

    $scope.selectBackgroundOptions = {
      placeholder: "Select Backgrounds...",
      dataTextField: "name",
      dataValueField: "id",
      maxSelectedItems: 3,
      valuePrimitive: true,
      autoBind: false,
      dataSource: $scope.allBackgrounds
    };

    $scope.selectSkillOptions = {
      placeholder: "Select Skills...",
      dataTextField: "name",
      dataValueField: "id",
      valuePrimitive: true,
      autoBind: false,
      dataSource: $scope.allSkills
    };

    $scope.selectCurrencyOptions = {
      placeholder: "Select Currency...",
      dataTextField: "name",
      dataValueField: "id",
      maxSelectedItems: 1,
      valuePrimitive: true,
      autoBind: false,
      dataSource: $scope.allCurrencies
    };
  });

  $scope.callPatch = function() {
    $scope.backgroundsToPatch = [];
    $scope.skillsToPatch = [];
    $scope.currencyToPatch = [];
    angular.forEach($scope.allBackgrounds, function(background) {
      angular.forEach($scope.selectedBackgrounds, function(backgroundID) {
        if (background.id == backgroundID) {
          $scope.backgroundsToPatch.push({id: background.id, name: background.name, option: "required", "level": null});
        }
      });
    });

    angular.forEach($scope.allSkills, function(skill) {
      angular.forEach($scope.selectedSkills, function(skillID) {
        if (skill.id == skillID) {
          $scope.skillsToPatch.push({id: skill.id, name: skill.name, option: "required", "level": 1});
        }
      });
    });

    if ($scope.selectedCurrency.length = 1) {
      angular.forEach($scope.allCurrencies, function(currency) {
        if (currency.id == $scope.selectedCurrency[0]) {
          $scope.currencyToPatch = {id:currency.id,name:currency.name,alphabetic_code:"alphabetic_code"};
        }
      });
    }

    $scope.earliest_start_dateToPatch = new Date($scope.opportunity.earliest_start_date).toString();
    var param = {
      opportunity: {
        title: $scope.opportunity.title,
        description: $scope.opportunity.title,
        applications_close_date: $scope.opportunity.applications_close_date,
        earliest_start_date: $scope.opportunity.earliest_start_date,
        latest_end_date: $scope.opportunity.latest_end_date,
        backgrounds: $scope.backgroundsToPatch,
        skills: $scope.skillsToPatch,
        role_info: {
          selection_process: $scope.opportunity.role_info.selection_process
        },
        specifics_info: {
          salary: $scope.opportunity.specifics_info.salary,
          salary_currency: $scope.currencyToPatch,
          salary_periodicity: $scope.opportunity.specifics_info.salary_periodicity
        }
      }
    };


    $resource("http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/3?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c", null, {
      'update': {method: 'PATCH'}
    }).update(param).$promise.then(function() {
      alert("opportunity has been Successfully Updated");
    });
  };
}]);