# Включаем/выключаем сетку для верстки

((global) ->
  PixelGridForLayout =
    scriptId: "TechModuleGridScript"
    elementId: 'DevPixelGrid'
    classWhite: 'bPixelGrid__mColor_white'
    storageEngine: "sessionStorage"
    storage: null
    showed: false
    coords:
      top: 0
      left: 0
    opacity: 0.2
    options:
      stepWidth: 10
      stepHeight: 10
      subdivision: false

      
    init: (userOptions) ->
      scriptElement = $("#" + @scriptId)


      # set user options over default
      if @isJSONAvailable() and typeof opt isnt 'undefined'
        userOptions = scriptElement.data "options"
      
      if typeof userOptions isnt undefined
        for key, item of userOptions
          @options[key] = item

      @createGrid()

      return true

    createGrid: ->
      @container = $("<div></div>")
      @container.attr "id", @elementId
      @container.css
        display: "block"
        position: "absolute"
        width: "100%"
        height: "100%"
        zIndex: 1000
        pointerEvents: "none"
        top: 0
        left: 0

      @el = $("<div></div>")
      @el.css
        display: "none"
        position: "relative"
        width: "100%"
        height: "100%"
        opacity: @opacity
        pointerEvents: "none"
        top: 0
        left: 0

      @createRows()
      @createCols()

      # insert into DOM
      @container.append @el
      $("body").append @container

    createRows: () ->
      @height = $( document.documentElement ).outerHeight()
      rowsCount = Math.floor @height/@options.stepHeight
      for y in [0..rowsCount]
        row = $("<div></div>")
        row.css
          position: "absolute"
          width: "100%"
          height: (@options.stepHeight - 1) + "px"
          top: (y * @options.stepHeight) + "px"
          left: 0
          borderTop: "1px solid black"
        @el.append row

      #last row must have border at bottom
      row.css "borderBottom", "1px solid black"

    createCols: () ->
      @width = $(document.documentElement).outerWidth()
      colsCount = Math.floor @width/@options.stepWidth
      for x in [0..colsCount]
        col = $("<div></div>")
        col.css
          position: "absolute"
          width: (@options.stepWidth - 1) + "px"
          height: @height + "px"
          top: 0
          left: (x * @options.stepWidth) + "px"
          borderLeft: "1px solid black"
        @el.append col

      #last col must have border at right
      col.css "borderRight", "1px solid black"

    showGrid: ->
      @el.show()
      @showed = true    
      @storage.setItem('dev-pixel-grid-showed', 'enabled') if @isStorageAvailable()

    hideGrid: ->
      @el.hide()
      @showed = false    
      @storage.setItem('dev-pixel-grid-showed', 'disabled') if @isStorageAvailable()

    toggleVisible: ->
      if @showed
        @hideGrid()
      else
        @showGrid()

    toggleBlackWhite: ->
      if @isBlack
        $("div", @el).css "borderColor", "black"
      else
        $("div", @el).css "borderColor", "white"
      @isBlack = not @isBlack
      @storage.setItem('dev-pixel-grid-black', @isBlack) if @isStorageAvailable()

    updateToCoords: ->
      @el.css
        marginTop: @coords.top
        marginLeft: @coords.left
      

      @storage.setItem('dev-pixel-grid-coords', JSON.stringify({top: @coords.top, left: @coords.left})) if @isStorageAvailable() and @isJSONAvailable()

    move: (x, y) ->
      @coords.top = y
      @coords.left = x
      @updateToCoords()
      
    moveTop: ->
      @move @coords.left, @coords.top - 1

    moveBottom: ->
      @move @coords.left, @coords.top + 1

    moveLeft: ->
      @move @coords.left - 1, @coords.top

    moveRight: ->
      @move @coords.left + 1, @coords.top

    resetPosition: ->
      @move 0, 0

    moreTransparency: ->
      return false if @opacity < 0.2
      @opacity -= 0.1
      @updateOpacity()

    lessTransparency: ->
      return false if @opacity > 0.9
      @opacity += 0.1
      @updateOpacity()

    updateOpacity: ->
      @storage.setItem('dev-pixel-grid-opacity', @opacity)
      @el.css "opacity", @opacity
      
    checkStorage: ->
      if @isJSONAvailable()
        @coords = JSON.parse(@storage.getItem('dev-pixel-grid-coords')) ? @coords
        @updateToCoords()

      @isBlack = @storage.getItem('dev-pixel-grid-black') isnt "true"
      @toggleBlackWhite() 

      @showGrid() if @storage.getItem('dev-pixel-grid-showed') is 'enabled'

      tempOpacity = parseFloat @storage.getItem('dev-pixel-grid-opacity')
      @opacity = tempOpacity if not isNaN tempOpacity and tempOpacity > 0
      @updateOpacity()

    enableHotKeys: ->
      # Показать/спрятать
      key '⌥+⇧+p', =>
        @toggleVisible()

      # Черная/белая
      key '⌥+⇧+o', =>
        @toggleBlackWhite()

      # Прозрачность
      key '⌥+⇧+=', =>
        @lessTransparency()
      key '⌥+⇧+-', =>
        @moreTransparency()

      # Подвигать
      key '⌥+⇧+up', =>
        @moveTop()
      key '⌥+⇧+down', =>
        @moveBottom()
      key '⌥+⇧+left', =>
        @moveLeft()
      key '⌥+⇧+right', =>
        @moveRight()    
      
      # Сбросить позицию в default
      key '⌥+⇧+r', =>
        @resetPosition()

    isJSONAvailable: () ->
      return window.JSON isnt null

    isKeymasterAvailable: () ->
      return (typeof key isnt 'undefined')

    isStorageAvailable: () ->
      if @storage
        return on

      if window[@storageEngine] isnt null
        @storage = window[@storageEngine] 
        return on 

      return off
  
  initAtStart = ($, key, module) ->
    config = undefined
    # AMD Support
    if typeof module isnt 'undefined'
      module.exports = PixelGridForLayout
      config = module.config()

    $ ->
      devPixelGrid = PixelGridForLayout
      return false if not devPixelGrid.init( config )

      devPixelGrid.enableHotKeys() if key or devPixelGrid.isKeymasterAvailable()
      devPixelGrid.checkStorage() if devPixelGrid.isStorageAvailable()


  if typeof define is 'function'
    define 'techModuleGrid', ['jquery','keymaster','module'], initAtStart
  else
    initAtStart($) if typeof $ isnt undefined

  global.PixelGridForLayout = PixelGridForLayout

)(this)
