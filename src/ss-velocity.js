(function(window) {


  /**
   * Represents a SSVelocity object
   * @constructor
   * @param {object} options - Default options
   */
  var SSVelocity = function(options) {
    var _self  = this;

    //** hold all the callbacks
    var _callbacks = { start: [], velocity: [], end: [] };

    //** keep track of prev mouse x
    var x = 0;

    //** keep track of prev mouse y
    var y = 0;

    //** keep track of prev time
    var t;

    /**
     * Default options object
     */
    var defaultOptions = {
      container: document
    };

    //** Keeps track of MouseDown, MouseMove, and MouseUp event handlers on the document
    var listener = {
      down: false,
      move: false,
      up: false
    };

    //** Holds the bounds of element
    var bounds = {};

    //** Extend default options
    _self.options = extend(defaultOptions, options);


    //////////////////////
    // Public functions //
    //////////////////////


    /**
     * Gets the bounds of the element
     * NOTE: this method should be called if the element size changes
     */
    _self.update = function() {
      bounds = (_self.options.container === document) ? document.documentElement.getBoundingClientRect() : _self.options.container.getBoundingClientRect();
    };


    /**
     * Change the default element which events are being listened on
     */
    _self.setContainer = function(container) {
      if(container) {
        _self.options.container = container;
        _self.update();
      } else {
        console.error('* container not defined *');
      }
    };


    /**
     * Callback function when velocity change has been detected
     * @param {function} callback function
     */
    _self.velocity = function(callback) {
      if(inArray(_callbacks.velocity, callback) === 0) {
        _callbacks.velocity.push(callback);
      }
    };


    /**
     * Callback function when velocity change has been detected
     * @param {function} callback function
     */
    _self.start = function(callback) {
      if(inArray(_callbacks.start, callback) === 0) {
        _callbacks.start.push(callback);
      }
    };


    /**
     * Callback function when end change has been detected
     * @param {function} callback function
     */
    _self.end = function(callback) {
      if(inArray(_callbacks.end, callback) === 0) {
        _callbacks.end.push(callback);
      }
    };


    /**
     * Destory Objects
     */
    _self.destroy = function() {
      _self.disable();
      _self = null;
    };


    /**
     * Enables velocity handlers
     */
    _self.enable = function() {
      addDownListener();
      removeMoveListener();
      removeUpListener();
    };


    /**
     * Disables velocity handlers
     */
    _self.disable = function() {
      removeDownListener();
      removeMoveListener();
      removeUpListener();
    };


    /////////////////////
    // Event Listeners //
    /////////////////////


    //** Callback when mousedown event is detected
    function mouseDown(e) {
      if(e.clientX >= bounds.left && e.clientX <= bounds.right && e.clientY >= bounds.top && e.clientY <= bounds.bottom) {
        x = e.clientX;
        y = e.clientY;
        addMoveListener();
        addUpListener();
        _callbacks.start.forEach(function(callback) {
          callback.call();
        });
      }
    }


    //** Callback when mousemove event is detected
    function mouseMove(e) {
      var dx = e.clientX - x;
      var dy = e.clientY - y;
      var ct = new Date();
      var dt = ct - (t || ct);
      var v = Math.sqrt(dx * dx + dy * dy) / dt;
      v = (isFinite(v)) ? v : 0;

      var data = {};
      data.velocity = v;

      _callbacks.velocity.forEach(function(callback) {
        callback.call(data);
      });

      x = e.clientX;
      y = e.clientY;
      t = ct;
    }


    //** Callback when mouseup event is detected
    function mouseUp(e) {
      removeMoveListener();
      removeUpListener();
      _callbacks.end.forEach(function(callback) {
        callback.call();
      });
    }


    //** Add mousedown event handler if already added
    function addDownListener() {
      if(!listener.down) {
        document.addEventListener('mousedown', mouseDown, false);
        listener.down = true;
      }
    }


    //** Add mousemove event handler if not already added
    function addMoveListener() {
      if(!listener.move) {
        document.addEventListener('mousemove', mouseMove, false);
        listener.move = true;
      }
    }


    //** Add mousemove event handler if not already added
    function addUpListener() {
      if(!listener.up) {
        document.addEventListener('mouseup', mouseUp, false);
        listener.up = true;
      }
    }


    //** Remove mousedown event handler if has already been added
    function removeDownListener() {
      if(listener.down) {
        document.removeEventListener('mousedown', mouseDown, false);
        listener.down = false;
      }
    }


    //** Remove mousemove event handler if has already been added
    function removeMoveListener() {
      if(listener.move) {
        document.removeEventListener('mousemove', mouseMove, false);
        listener.move = false;
      }
    }


    //** Remove mouseup event handler if has already been added
    function removeUpListener() {
      if(listener.up) {
        document.removeEventListener('mouseup', mouseUp, false);
        listener.up = false;
      }
    }


    //** Add mousedown listener
    addDownListener();

    //** 
    _self.update();
  };


  //////////////////////
  // Helper Functions //
  //////////////////////

  //** Extends two objects and returns the result
  function extend(a, b) {
    if(typeof a !== 'object') { return b; }
    if(typeof b !== 'object') { return a; }

    var c = {};
    for(var p in a) {
      c[p] = (!b[p]) ? a[p] : b[p];
    }

    return c;
  }

  function inArray(array, obj) {
    var ary = array.filter(function(_callback) {
      if(callback === _callback) {
        return false;
      }

      return true;
    });
    return ary.length;
  }


  //** Set object to window
  window.SSVelocity = SSVelocity;

})(window);

