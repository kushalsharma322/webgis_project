var app = angular.module("app", ["leaflet-directive"]);
var urlString = "http://127.0.0.1:3000";
app.controller("TheController", ["$scope","$http", function($scope,$http) {
  angular.extend($scope, {
    castellon: {
      lat: 39.98685368305097,
      lng: -0.04566192626953125,
      zoom: 16
    },
    tiles: {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  })

  //To track the id based on the addition of the new Marker
  $scope.markers = new Array();
  $scope.counter = $scope.markers.length;

  //Markers array updater
  $(document).ready( function () {
    $scope.update_markers();
  });

  $scope.update_markers = function (){
    $.ajax({
      url: urlString+"/catalog",
      type: 'GET'
    }).done (function (resp){
        // $.each(resp, function (index, value){
        //   $scope.markers.push(resp);
        // })

        console.log(resp);
        console.log("this");

        console.log("The length of array is " + $scope.markers.length);
        console.log($scope.markers);
    })
  };


  //double click on left button gives the new marker and also zooms the map
  // $scope.$on("leafletDirectiveMap.click", function (event,args) {
  //     var latlng = args.leafletEvent.latlng;
  //     $scope.markers.push({
  //         lat: latlng.lat,
  //         lng: latlng.lng,
  //         message: "Hello"
  //     });
  // });


  //Right is for marker and left button is for zooming
  // $scope.$on("leafletDirectiveMap.mousedown", function(event, args) {
  //   var mouseButton = args.leafletEvent.originalEvent.button;
  //
  //   if (mouseButton == 2) { // Right button
  //     var latlng = args.leafletEvent.latlng;
  //
  //     $scope.markers.push({
  //       lat: latlng.lat,
  //       lng: latlng.lng,
  //       message: "Hello",
  //       dueDate: new Date()
  //     });
  //   }
  // });

//Gets the lat long from the map
  $scope.$on("leafletDirectiveMap.mousedown", function (event,args) {
    console.log("The number of counter is " + $scope.counter);
    var mouseButton = args.leafletEvent.originalEvent.button;
    if(mouseButton == 2) { // Right button
        latlng = args.leafletEvent.latlng;
        reverseGeocoding(latlng);
    }
});


//Ask for postal address
function reverseGeocoding(latlng) {
    var urlString = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" +
    latlng.lat + "&lon=" +
    latlng.lng + "&zoom=18&addressdetails=1";
    $http.get(urlString).then(addMarker);
}

//Adds the marker to the map
function addMarker(response) {
    var marker = {
        id: $scope.counter,
        lat: parseFloat(response.data.lat),
        lng: parseFloat(response.data.lon),
        message: "Hello there",
        dueDate: new Date(),
        postalAddress: response.data.display_name
    };
    $scope.counter++;
    $scope.markers.push(marker);
    $scope.currentMarker = marker;
    $scope.post_marker();
}

  $scope.currentMarker = {};

  $scope.showInfo = function(index) {
    $scope.currentMarker = $scope.markers[index];
  }

  $scope.focus = function(index) {
    $scope.currentMarker = $scope.markers[index];
    $scope.currentMarker.focus=true;
    $scope.castellon.lat=$scope.currentMarker.lat;
    $scope.castellon.lng=$scope.currentMarker.lng;
  }

  $scope.removeInfo = function(index) {
    $scope.currentMarker = $scope.markers.splice(index,1);

  }


  //To delete the items from the catalog
//   $scope.removeInfo = function(id) {
//     $.ajax({
//   url: urlString+"/catalog/"+id,
//   method: 'DELETE',
//   contentType: 'application/json',
//   success: function(result) {
//       console.log("successfully deleted " + id);
//       //$("#form-message").html("<p>Successfully deleted: </p>"+id);
//         $scope.$apply();
//   },
//   error: function(request,msg,error) {
//       alert(error);
//   }
// });
//   }

//Adding new marker info to the database
  $scope.post_marker = function(){
        $.ajax({
          url: urlString+"/catalog",
          method: 'POST',
          data : JSON.stringify($scope.currentMarker),
          contentType: 'application/json',
          success : function (res){
            console.log(res);
            $scope.$apply();
        },
        error: function (xhr, status, error) {
          console.log('Error: ' + status);
          }
      })
    }

}]);
