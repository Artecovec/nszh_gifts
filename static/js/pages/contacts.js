$(function(){

  var windowWidth = $(window).width();
  var $body = $('body');
  // var myPoints = {
  //   'sbs': [55.72006896182018,37.628273228836065],
  //   'sbg':[55.72085686035579,37.61026381349177]
  // };

  var offsetDesctop = [0.001, 0];
  var offsetMob = [0.0023, 0];

  $body.addClass('b-contact-page');

  ymaps.ready(function () {

    var myMap = new ymaps.Map('map', {
        center: (windowWidth >= 768) ? [myPoints.coords[0]+offsetDesctop[0], myPoints.coords[1]-offsetDesctop[1]] : [myPoints.coords[0]+offsetMob[0], myPoints.coords[1]-offsetMob[1]],
        zoom: 17,
        controls: []
      }, {
        searchControlProvider: 'yandex#search'
      }),
      clusterer = new ymaps.Clusterer(),
      getPointData = function (index) {
        return;
      },
      points = [
        myPoints.coords
      ],
      geoObjects = [];

    myMap.controls.add(
      'zoomControl', {
        position: {
          top: 60,
          right: 20
        }
      }).add('geolocationControl', {
        position: {
          top: 20,
          right: 20
        }
    });

    for (var i = 0, len = points.length; i < len; i++) {
      geoObjects[i] = new ymaps.Placemark(
        points[i],
        getPointData(i),
        {
          iconLayout: 'default#imageWithContent',
          iconImageHref:'/static/i/new/i-map-point.svg',
          iconImageSize: [57, 57],
          iconImageOffset: [-28, -28]
        }
      );
    }

    clusterer.add(geoObjects);
    myMap.behaviors.disable('scrollZoom');
    myMap.geoObjects.add(clusterer);

  });

  $(window).on('resize', function () {
    windowWidth = $(window).width();
  });


});