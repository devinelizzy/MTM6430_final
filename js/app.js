angular.module("myApp", ['ngRoute', 'firebase'])
  // adds ngrout array into the module
  .constant('firebaseConfig', {
    // firebase config
    apiKey: "AIzaSyAij_OWbdsVbxTcfOtrioYUWEN-OZKU4T4",
    authDomain: "mtm6430-final.firebaseapp.com",
    databaseURL: "https://mtm6430-final.firebaseio.com",
    projectId: "mtm6430-final",
    storageBucket: "mtm6430-final.appspot.com",
    messagingSenderId: "470714633259"
  })
  .config(function($routeProvider, $locationProvider) {
    // adds in the routeprovider and locationprovider functions
    // these functions look at the url an bring in the specified template and controller based on parameters below
    $routeProvider
      .when('/', {
        templateUrl: 'views/all.html',
        controller: 'allCtrl'
        // brings in placeholder and no addition to url
      })
      .when('/details/home', {
        templateUrl: 'views/home.html',
        controller: 'allCtrl'
        // sends to detailsCtrl template when item id in url
        // uses details Crtl to define which item in array
      })
      .when('/details/work', {
        templateUrl: 'views/work.html',
        controller: 'allCtrl'
        // sends to detailsCtrl template when item id in url
        // uses details Crtl to define which item in array
      })
      .when('/details/school', {
        templateUrl: 'views/school.html',
        controller: 'allCtrl'
        // sends to detailsCtrl template when item id in url
        // uses details Crtl to define which item in array
      })
      .otherwise({
        redirectTo: '/'
      })
    // if none of these goes back to start (aka placeholder)
  })


  .run(firebaseConfig => firebase.initializeApp(firebaseConfig))
  .service('dbRefRoot', function() {
    return firebase.database()
      .ref()
  })
  .service('todos', todos)

  .controller('placeholderCtrl', function($scope, todos) {
    // populates the objects with keys
    this.getNewTodo = function getNewTodo() {
      return {
        task: '',
        date: '',
        category: '',
        importance: '',
        comments: '',
        done: false
      }
    }
    // adds new items
    this.newTodo = this.getNewTodo()
    this.todos = todos.getAll()
    this.addTodo = function addTodo(newTodo) {
      this.todos
        .$add(newTodo)
        .then(newRef => {
          this.newTodo = this.getNewTodo()
        })
    }
    // cleard form after prompt
    $scope.confirmClear = function(todos) {
      if (confirm("Are your sure you want to clear the form?")) {
        document.forms.myForm.reset()
      }
    }
  })

  .controller('allCtrl', function($scope, todos) {
    $scope.todos = todos.getAll()

    // delete entry - WORKS!
    $scope.removeThisTodo = function(todos) {
      if (confirm("Are your sure you want to delete this todo?")) {
        $scope.todos.$remove(todos)
      }
    }
    // saved changes - edit function - WORKS!
    $scope.saveThisTodo = function(todos) {
      console.log(todos);
      $scope.todos.$save(todos)
    };
    // toggle done for check button
    $scope.toggleDone = function(todo) {
      todo.done = !todo.done
      $scope.saveThisTodo(todo);
    }

  })

  // adds in form template for each category
  .directive('todoForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/form.html'
    };
  })

  // adds in complete template for each category
  .directive('todoComplete', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/complete.html'
    };
  })



// function which is called into each controller as needed

function todos(dbRefRoot, $firebaseObject, $firebaseArray) {
  const dbReftodos = dbRefRoot.child('todos')
  //moves to referemce point in code that points to customers

  // this. accesses variables tied to the controller (eg. ng-controler= customerCtrl as ctrl)
  this.get = function get(itemID) {
    return $firebaseObject(dbReftodos.child(itemID))
  }

  this.getAll = function getAll() {
    return $firebaseArray(dbReftodos)
  }
}
