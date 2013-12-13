(function() {
  $(function() {
    var center, currentRot, dial, dialTop, dialval, doc, form, fraction, ingredientamount, ingredientmeasure, ingredientname, initTouch, lastDeg, makeString, mobile, newpiemenuback, offset, pieMenuBackButton, piemenu, piemenuback, piemenubutton, rad2deg, rotation, roundToStep, select, startDeg, touchable, val;
    touchable = false;
    mobile = false;
    initTouch = function() {
      var p;
      p = navigator.platform;
      if ((p === 'iPad') || (p === 'iPhone') || (p === 'iPod')) {
        return touchable = true;
      }
    };
    initTouch();
    if (touchable) {
      $('html').removeClass('notouch');
    }
    if (touchable) {
      select = 'tap';
    } else {
      select = 'click';
    }
    doc = $(document);
    form = $('#newingredient');
    ingredientamount = $('#newingredient input[name=ingredient-amount]');
    ingredientmeasure = $('#newingredient input[name=ingredient-measure]');
    ingredientname = $('#newingredient input[name=ingredient-name]');
    piemenu = $('.piemenu');
    newpiemenuback = $("<a class='back' data-value='prev'></a>");
    piemenu.append(newpiemenuback);
    piemenuback = $(".piemenu .back");
    pieMenuBackButton = function() {
      if ($('.piemenu ul .active').is('li:first-child')) {
        return piemenuback.hide();
      } else {
        return piemenuback.show();
      }
    };
    pieMenuBackButton();
    ingredientamount.on(select, function(e) {
      var activecontrol;
      e.preventDefault();
      $(this).focus();
      activecontrol = $("#visualcontrols div.active");
      activecontrol.removeClass('active');
      return dial.addClass('active');
    });
    ingredientmeasure.on(select, function(e) {
      var activecontrol;
      e.preventDefault();
      $(this).focus();
      activecontrol = $("#visualcontrols div.active");
      activecontrol.removeClass('active');
      return piemenu.addClass('active');
    });
    ingredientname.on(select, function(e) {
      e.preventDefault();
      return $(this).focus();
    });
    piemenubutton = $('.piemenu a');
    piemenubutton.on(select, function(e) {
      var activepiemenu, val;
      e.preventDefault();
      activepiemenu = $('.piemenu ul li.active');
      val = $(this).attr('data-value');
      if (val === "next") {
        activepiemenu.removeClass('active');
        activepiemenu.next('li').addClass('active');
        return pieMenuBackButton();
      } else if (val === "prev") {
        activepiemenu.removeClass('active');
        activepiemenu.prev('li').addClass('active');
        return pieMenuBackButton();
      } else {
        ingredientmeasure.val(val);
        ingredientname.focus();
        return ingredientname.click();
      }
    });
    dial = $('.dial');
    dialval = $('.dial .value');
    val = parseFloat(dialval.attr("data-value"));
    dialTop = dial.find('.top');
    startDeg = -1;
    currentRot = 0;
    rotation = 0;
    lastDeg = 0;
    rad2deg = 180 / Math.PI;
    offset = dial.offset();
    center = {
      y: offset.top + dial.height() / 2,
      x: offset.left + dial.width() / 2
    };
    roundToStep = function(n) {
      if ((n % 8) >= 4) {
        return (parseInt(n / 8) * 8) + 8;
      } else {
        return parseInt(n / 8) * 8;
      }
    };
    fraction = function(dec) {
      switch (dec) {
        case 0:
          return "";
        case 0.125:
          return "1/8";
        case 0.25:
          return "1/4";
        case 0.375:
          return "3/8";
        case 0.5:
          return "1/2";
        case 0.625:
          return "5/8";
        case 0.75:
          return "3/4";
        case 0.875:
          return "7/8";
      }
    };
    makeString = function(v) {
      var dec, valstring, whole;
      dec = v % 1;
      whole = Math.round(v - dec) === 0 && v > 0 ? '' : Math.round(v - dec);
      valstring = "" + whole + " " + (fraction(dec));
      return valstring;
    };
    return dial.on('mousedown touchstart', function(e) {
      e.preventDefault();
      ingredientamount.focus();
      dial.on('mousemove.rem touchmove.rem', function(e) {
        var a, b, currentVal, deg, newval, tmprot, tmpval;
        e.preventDefault();
        e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        a = center.y - e.pageY;
        b = center.x - e.pageX;
        deg = Math.atan2(a, b) * rad2deg;
        val = parseFloat(dialval.attr("data-value"));
        if (startDeg === -1) {
          startDeg = deg;
        }
        tmpval = roundToStep(Math.round(Math.floor((deg - startDeg) + rotation)));
        tmprot = Math.floor((deg - startDeg) + rotation);
        currentVal = tmpval;
        currentRot = tmprot;
        if (val === 0) {
          dialval.removeClass('active');
          ingredientamount.val('');
        }
        if (currentVal > lastDeg && val < 16.875) {
          newval = val + 0.125;
          dialval.attr("data-value", newval);
          dialval.attr("data-value-string", makeString(newval));
          ingredientamount.val(makeString(newval));
          dialval.removeClass('ok');
          dialval.addClass('active');
        }
        if (currentVal < lastDeg && val > 0) {
          newval = val - 0.125;
          dialval.attr("data-value", newval);
          dialval.attr("data-value-string", makeString(newval));
          ingredientamount.val(makeString(newval));
          dialval.removeClass('ok');
          dialval.addClass('active');
        }
        dial.css('transform', 'rotate(' + currentRot + 'deg)');
        dialval.css('transform', 'rotate(' + (currentRot * -1) + 'deg)');
        return lastDeg = tmpval;
      });
      return doc.on('mouseup.rem  touchend', function(e) {
        e.preventDefault();
        dial.off('.rem');
        doc.off('.rem');
        $('.ok').on(select, function(e) {
          e.preventDefault();
          dial.removeClass('active');
          piemenu.addClass('active');
          return ingredientmeasure.focus();
        });
        if (val !== 0) {
          dialval.addClass('ok');
        }
        rotation = currentRot;
        return startDeg = -1;
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=measure.js.map
*/