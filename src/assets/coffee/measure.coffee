#-----------------
# Measurement Dial
# 8 Steps - Should range from 0 - 16
# ----------------
# 0        - 0
# 0.125    - 1/8
# 0.25     - 1/4
# 0.375    - 3/8
# 0.5      - 1/2
# 0.625    - 5/8
# 0.75     - 3/4
# 0.875    - 7/8

$ ->
  touchable = false
  mobile = false

  initTouch = ->
    p = navigator.platform
    if (p == 'iPad') or (p == 'iPhone') or (p == 'iPod')
      touchable = true
  initTouch()

  if touchable
    $('html').removeClass('notouch')

  if touchable
    select = 'tap'
  else
    select = 'click'

  doc = $(document)

  form = $('#newingredient')
  ingredientamount = $('#newingredient input[name=ingredient-amount]')
  ingredientmeasure = $('#newingredient input[name=ingredient-measure]')
  ingredientname = $('#newingredient input[name=ingredient-name]')

  piemenu = $('.piemenu')
  newpiemenuback = $("<a class='back' data-value='prev'></a>")
  piemenu.append newpiemenuback
  piemenuback = $(".piemenu .back")

  pieMenuBackButton = ->
    if $('.piemenu ul .active').is('li:first-child')
      piemenuback.hide()
    else
      piemenuback.show()
  pieMenuBackButton()

  ingredientamount.on select, (e)->
    e.preventDefault()
    $(this).focus()
    activecontrol = $("#visualcontrols div.active")
    activecontrol.removeClass('active')
    dial.addClass('active')

  ingredientmeasure.on select, (e)->
    e.preventDefault()
    $(this).focus()
    activecontrol = $("#visualcontrols div.active")
    activecontrol.removeClass('active')
    piemenu.addClass('active')

  ingredientname.on select, (e)->
    e.preventDefault()
    $(this).focus()

  piemenubutton = $('.piemenu a')

  piemenubutton.on select, (e)->
    e.preventDefault()
    activepiemenu = $('.piemenu ul li.active')
    val = $(this).attr('data-value')
    if val is "next"
      activepiemenu.removeClass('active')
      activepiemenu.next('li').addClass('active')
      pieMenuBackButton()
    else if val is "prev"
      activepiemenu.removeClass('active')
      activepiemenu.prev('li').addClass('active')
      pieMenuBackButton()
    else
      ingredientmeasure.val val
      ingredientname.focus()
      ingredientname.click()

  dial =   $('.dial')
  dialval =   $('.dial .value')
  val = parseFloat dialval.attr("data-value")
  dialTop = dial.find('.top')
  startDeg = -1
  currentRot = 0
  rotation = 0
  lastDeg = 0
  rad2deg = 180/Math.PI
  offset = dial.offset()
  center =
    y: offset.top + dial.height() / 2
    x: offset.left + dial.width() / 2

  roundToStep = (n)->
    if ((n % 8) >= 4 )
      (parseInt(n / 8) * 8) + 8
    else
      (parseInt(n / 8) * 8)

  fraction = (dec)->
    switch dec
      when 0
        ""
      when 0.125
        "1/8"
      when 0.25
        "1/4"
      when 0.375
        "3/8"
      when 0.5
        "1/2"
      when 0.625
        "5/8"
      when 0.75
        "3/4"
      when 0.875
        "7/8"

  makeString = (v)->
    dec = v % 1
    whole =
      if Math.round(v - dec) is 0 and v > 0
        ''
      else
        Math.round(v - dec)
    valstring = "#{whole} #{fraction(dec)}"
    valstring

  dial.on 'mousedown touchstart', (e)->
    e.preventDefault()
    ingredientamount.focus()
    dial.on 'mousemove.rem touchmove.rem', (e)->
      e.preventDefault()

      e = if e.originalEvent.touches then e.originalEvent.touches[0] else e
      a = center.y - e.pageY
      b = center.x - e.pageX
      deg = Math.atan2(a,b)*rad2deg
      val = parseFloat dialval.attr("data-value")

      # Save the starting position of the drag
      if(startDeg == -1)
        startDeg = deg

      #  Calculating the current rotation
      tmpval = roundToStep Math.round Math.floor((deg-startDeg) + rotation)
      tmprot = Math.floor((deg-startDeg) + rotation)
      currentVal = tmpval
      currentRot = tmprot
      if val is 0
        dialval.removeClass('active')
        ingredientamount.val ''
      if currentVal > lastDeg and val < 16.875
        newval = (val + 0.125)
        dialval.attr("data-value", newval)
        dialval.attr("data-value-string", makeString(newval))
        ingredientamount.val makeString(newval)
        dialval.removeClass('ok')
        dialval.addClass('active')

      if currentVal < lastDeg and val > 0
        newval = (val - 0.125)
        dialval.attr("data-value", newval)
        dialval.attr("data-value-string", makeString(newval))
        ingredientamount.val makeString(newval)
        dialval.removeClass('ok')
        dialval.addClass('active')

      dial.css('transform','rotate('+(currentRot)+'deg)')
      dialval.css('transform','rotate('+(currentRot * -1)+'deg)')

      lastDeg = tmpval

    doc.on 'mouseup.rem  touchend', (e)->
      e.preventDefault()
      dial.off('.rem')
      doc.off('.rem')

      $('.ok').on select, (e)->
        e.preventDefault()
        dial.removeClass('active')
        piemenu.addClass('active')
        ingredientmeasure.focus()

      dialval.addClass('ok') unless val is 0
      # Saving the current rotation
      rotation = currentRot
      # Marking the starting degree as invalid
      startDeg = -1
