jQuery(function($){
  console.log('and then?');
  // http://appelsiini.net/projects/lazyload
  $('img[data-original]').lazyload({
    effect: 'fadeIn'
  });
});
