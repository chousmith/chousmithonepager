jQuery(function($){
  var scrollthrottler = false,
      lastscrolltop = 0,
      newscrolltop = 0,
      topr = 0,
      topw = 0,
      topc = 0,
      mhei = 0,
      $banner = $('#top'),
      $navbar = $banner.next();

  // http://appelsiini.net/projects/lazyload
  $('img[data-original]').lazyload({
    effect: 'fadeIn'
  });

  // smooth scroll catch
  $('a[href*="#"]').click(function(e) {
    e.preventDefault();
    var whash = $(this).attr('href');
    var $tar = $( whash );
    // console.log('clicked '+ $tar);
    if ( $tar.size() > 0 ) {
      // sooth scroll
      var $top = $tar.offset();
      $top = $top.top;
      // if scrolling down, dont adjust
      if ( $top < $(window).scrollTop() ) {
        $top -= mhei;
      }
      $('html, body').animate({
        'scrollTop': $top
      }, 800, function() {
        // window.location.hash = whash;
      });
    }
  });

  // mbar catching
  $(window).on('resize', function() {
    // navbar height
    mhei = parseInt( $navbar.css('height'), 10 );
    // top of resume section = bottom of banner + navbar height
    topr = ($('#about').offset()).top - mhei;
    // console.log('topr take 2: '+ topr2);
    // work / portfolio
    topw = ($('#work').offset()).top;
    // contact
    topc = ($('#contact').offset()).top;
  }).trigger('resize')
  .on('resetnav', function() {
    $navbar.removeAttr('style');//.find('nav a:eq(0)').trigger('navactive');
    $banner.css('margin-bottom', 0);
  })
  .on('scrollthrottle', function() {
    if ( newscrolltop > topr ) {
      if ( lastscrolltop > newscrolltop ) {
        // scrolled up. check if still below bottom of top navbar
        if ( !$navbar.is('[style]') ) {
          $navbar.stop().css({'position': 'fixed', 'top': -1 * mhei });
          $banner.css('margin-bottom', mhei);
          $navbar.animate({
            top: 0
          }, 200);
        }
      } else {
        if ( $navbar.is('[style]') ) {
          $navbar.stop().animate({
            top: -1 * mhei
          }, 200, function() {
            $(window).trigger('resetnav');
          });
        }
      }
    }
    lastscrolltop = newscrolltop;
  })
  .on('scroll', function(e) {
    newscrolltop = $(this).scrollTop();

    clearTimeout( scrollthrottler );

    if ( newscrolltop <= topr ) {
      // make sure navvar is un fixed
      $(window).trigger('resetnav');
    }

    scrollthrottler = setTimeout( function() {
      $(window).trigger('scrollthrottle');
    }, 100 );
  });

  // em fx
  $('#contact').find('a[title=Email]').each(function() {
    var th = $(this).html();
    th = th.replace(' [ at ] ', '@') +'.com';
    $(this).attr('href', 'mailto:'+ th).html(th).addClass('link hover-blue');
  });

  // ftr yr
  $('.year').html( ( new Date() ).getUTCFullYear() );
});
