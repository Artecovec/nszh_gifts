/***slider***/
$(document).on('ready', function() {          
    $(".regular").slick({
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });              
  });
  /***spoiler***/
$(document).ready(function(){
  $('.spoiler-links').click(function(){
   $(this).next('.spoiler-body').toggle('normal');   
   return false;
  });
 });