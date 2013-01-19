var PixelGridForLayout;

PixelGridForLayout = {
  scriptId: "TechModuleGridScript",
  elementId: 'DevPixelGrid',
  classWhite: 'bPixelGrid__mColor_white',
  storageEngine: "sessionStorage",
  storage: null,
  showed: false,
  coords: {
    top: 0,
    left: 0
  },
  opacity: 0.2,
  options: {
    stepWidth: 10,
    stepHeight: 10,
    subdivision: false
  },
  init: function() {
    var item, key, scriptElement, userOptions;
    scriptElement = $("#" + this.scriptId);
    if (this.isJSONAvailable()) {
      userOptions = scriptElement.data("options");
      for (key in userOptions) {
        item = userOptions[key];
        this.options[key] = item;
      }
    }
    this.createGrid();
    return true;
  },
  createGrid: function() {
    this.container = $("<div></div>");
    this.container.attr("id", this.elementId);
    this.container.css({
      display: "block",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 1000,
      pointerEvents: "none",
      top: 0,
      left: 0
    });
    this.el = $("<div></div>");
    this.el.css({
      display: "none",
      position: "relative",
      width: "100%",
      height: "100%",
      opacity: this.opacity,
      pointerEvents: "none",
      top: 0,
      left: 0
    });
    this.createRows();
    this.createCols();
    this.container.append(this.el);
    return $("body").append(this.container);
  },
  createRows: function() {
    var row, rowsCount, y, _i;
    this.height = $(document.documentElement).outerHeight();
    rowsCount = Math.floor(this.height / this.options.stepHeight);
    for (y = _i = 0; 0 <= rowsCount ? _i <= rowsCount : _i >= rowsCount; y = 0 <= rowsCount ? ++_i : --_i) {
      row = $("<div></div>");
      row.css({
        position: "absolute",
        width: "100%",
        height: (this.options.stepHeight - 1) + "px",
        top: (y * this.options.stepHeight) + "px",
        left: 0,
        borderTop: "1px solid black"
      });
      this.el.append(row);
    }
    return row.css("borderBottom", "1px solid black");
  },
  createCols: function() {
    var col, colsCount, x, _i;
    this.width = $(document.documentElement).outerWidth();
    colsCount = Math.floor(this.width / this.options.stepWidth);
    for (x = _i = 0; 0 <= colsCount ? _i <= colsCount : _i >= colsCount; x = 0 <= colsCount ? ++_i : --_i) {
      col = $("<div></div>");
      col.css({
        position: "absolute",
        width: (this.options.stepWidth - 1) + "px",
        height: this.height + "px",
        top: 0,
        left: (x * this.options.stepWidth) + "px",
        borderLeft: "1px solid black"
      });
      this.el.append(col);
    }
    return col.css("borderRight", "1px solid black");
  },
  showGrid: function() {
    this.el.show();
    this.showed = true;
    if (this.isStorageAvailable()) {
      return this.storage.setItem('dev-pixel-grid-showed', 'enabled');
    }
  },
  hideGrid: function() {
    this.el.hide();
    this.showed = false;
    if (this.isStorageAvailable()) {
      return this.storage.setItem('dev-pixel-grid-showed', 'disabled');
    }
  },
  toggleVisible: function() {
    if (this.showed) {
      return this.hideGrid();
    } else {
      return this.showGrid();
    }
  },
  toggleBlackWhite: function() {
    if (this.isBlack) {
      $("div", this.el).css("borderColor", "black");
    } else {
      $("div", this.el).css("borderColor", "white");
    }
    this.isBlack = !this.isBlack;
    if (this.isStorageAvailable()) {
      return this.storage.setItem('dev-pixel-grid-black', this.isBlack);
    }
  },
  updateToCoords: function() {
    this.el.css({
      marginTop: this.coords.top,
      marginLeft: this.coords.left
    });
    if (this.isStorageAvailable() && this.isJSONAvailable()) {
      return this.storage.setItem('dev-pixel-grid-coords', JSON.stringify({
        top: this.coords.top,
        left: this.coords.left
      }));
    }
  },
  move: function(x, y) {
    this.coords.top = y;
    this.coords.left = x;
    return this.updateToCoords();
  },
  moveTop: function() {
    return this.move(this.coords.left, this.coords.top - 1);
  },
  moveBottom: function() {
    return this.move(this.coords.left, this.coords.top + 1);
  },
  moveLeft: function() {
    return this.move(this.coords.left - 1, this.coords.top);
  },
  moveRight: function() {
    return this.move(this.coords.left + 1, this.coords.top);
  },
  resetPosition: function() {
    return this.move(0, 0);
  },
  moreTransparency: function() {
    if (this.opacity < 0.2) {
      return false;
    }
    this.opacity -= 0.1;
    return this.updateOpacity();
  },
  lessTransparency: function() {
    if (this.opacity > 0.9) {
      return false;
    }
    this.opacity += 0.1;
    return this.updateOpacity();
  },
  updateOpacity: function() {
    this.storage.setItem('dev-pixel-grid-opacity', this.opacity);
    return this.el.css("opacity", this.opacity);
  },
  checkStorage: function() {
    var _ref;
    if (this.isJSONAvailable()) {
      this.coords = (_ref = JSON.parse(this.storage.getItem('dev-pixel-grid-coords'))) != null ? _ref : this.coords;
      this.updateToCoords();
    }
    this.isBlack = this.storage.getItem('dev-pixel-grid-black') !== "true";
    this.toggleBlackWhite();
    if (this.storage.getItem('dev-pixel-grid-showed') === 'enabled') {
      this.showGrid();
    }
    this.opacity = this.storage.getItem('dev-pixel-grid-opacity');
    return this.updateOpacity();
  },
  enableHotKeys: function() {
    var _this = this;
    key('⌥+⇧+p', function() {
      return _this.toggleVisible();
    });
    key('⌥+⇧+o', function() {
      return _this.toggleBlackWhite();
    });
    key('⌥+⇧+=', function() {
      return _this.lessTransparency();
    });
    key('⌥+⇧+-', function() {
      return _this.moreTransparency();
    });
    key('⌥+⇧+up', function() {
      return _this.moveTop();
    });
    key('⌥+⇧+down', function() {
      return _this.moveBottom();
    });
    key('⌥+⇧+left', function() {
      return _this.moveLeft();
    });
    key('⌥+⇧+right', function() {
      return _this.moveRight();
    });
    return key('⌥+⇧+r', function() {
      return _this.resetPosition();
    });
  },
  isJSONAvailable: function() {
    return window.JSON !== null;
  },
  isKeymasterAvailable: function() {
    return typeof key !== 'undefined';
  },
  isStorageAvailable: function() {
    if (this.storage) {
      return true;
    }
    if (window[this.storageEngine] !== null) {
      this.storage = window[this.storageEngine];
      return true;
    }
    return false;
  }
};

$(function() {
  var devPixelGrid;
  devPixelGrid = PixelGridForLayout;
  if (!devPixelGrid.init()) {
    return false;
  }
  if (devPixelGrid.isKeymasterAvailable()) {
    devPixelGrid.enableHotKeys();
  }
  if (devPixelGrid.isStorageAvailable()) {
    return devPixelGrid.checkStorage();
  }
});
