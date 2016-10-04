jQuery(function($){
  var scrollthrottler = false,
      lastscrolltop = 0,
      newscrolltop = 0,
      topr = 0,
      topw = 0,
      topc = 0,
      mhei = 0,
      $banner = $('#top').parent(),
      $navbar = $banner.next();

  // console.log('and then?');

  // http://appelsiini.net/projects/lazyload
  $('img[data-original]').lazyload({
    effect: 'fadeIn'
  });

  // smooth scroll catch
  $('a[href*="#"]').on('navactive', function() {
    $(this).removeClass('link white-70 hover-blue').addClass('white').siblings('.white').removeClass('white').addClass('link white-70 hover-blue');
  }).click(function(e) {
    e.preventDefault();
    var whash = $(this).attr('href');
    var $tar = $( whash );
    // console.log('clicked '+ $tar);
    if ( $tar.size() > 0 ) {
      // sooth scroll
      var $top = $tar.offset();
      $top = $top.top - mhei;
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
    topr = ($('#about').parent().offset()).top - mhei;
    // console.log('topr take 2: '+ topr2);
    // work / portfolio
    topw = ($('#work').parent().offset()).top;
    // contact
    topc = ($('#contact').parent().offset()).top;
  }).trigger('resize')
  .on('resetnav', function() {
    $navbar.removeAttr('style').find('nav a:eq(0)').trigger('navactive');
    $banner.css('margin-bottom', 0);
  })
  .on('scrollthrottle', function() {
    // console.log('scrollthrottled : last top  = '+ lastscrolltop +' : new = '+ newscrolltop);
    if ( newscrolltop <= topr ) {
      // console.log('reset whash?');
      // window.location.hash = '';
    } else {
      if ( newscrolltop >= topc ) {
        // window.location.hash = '#contact';
        $navbar.find('nav a:last').trigger('navactive');
      } else if ( newscrolltop >= topw ) {
        // window.location.hash = '#work';
        $navbar.find('nav a:eq(2)').trigger('navactive');
      } else {
        // window.location.hash = '#about';
        $navbar.find('nav a:eq(1)').trigger('navactive');
      }

      if ( lastscrolltop > newscrolltop ) {
        // scrolled up. check if still below bottom of top navbar
        // if ( newscrolltop > topr ) {
          // console.log('scrolldup');
          if ( !$navbar.is('[style]') ) {
            $navbar.stop().css({'position': 'fixed', 'top': -1 * mhei });
            $banner.css('margin-bottom', mhei);
            $navbar.animate({
              top: 0
            }, 200);
          }
        // }
      } else {
        // console.log('scrolled down');
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
    // else {
      scrollthrottler = setTimeout( function() {
        $(window).trigger('scrollthrottle');
      }, 100 );
    // }
  });

  // em fx
  $('#contact').next().next().children('a').each(function() {
    var th = $(this).html();
    th = th.replace(' [ @ ] ', '@') +'.com';
    $(this).attr('href', 'mailto:'+ th).html(th).addClass('link hover-blue');
  });

  // ftr yr
  $('.year').html( ( new Date() ).getUTCFullYear() );
});
