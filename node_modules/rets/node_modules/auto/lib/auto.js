/**
 * auto Module
 *
 * -
 *
 * @module auto
 * @constructor
 * @author potanin@UD
 * @date 8/5/13
 * @type {Object}
 */
function auto( tasks, callback, settings ) {

  // Ensure always using new instance of auto
  if( !( this instanceof auto ) ) {

    if( arguments.length === 0 ) {
      return {};
    }

    if( arguments.length === 1 ) {
      return new auto( tasks );
    }

    if( arguments.length === 2 ) {
      return new auto( tasks, callback );
    }

    if( arguments.length === 3 ) {
      return new auto( tasks, callback, settings );
    }

  }

  // Set private properties
  var self        = this;

  // Set instance properties
  this.id         = Math.random().toString( 36 ).substring( 7 );
  this.tasks      = tasks;
  this.callback   = arguments[1] instanceof Function ? arguments[1] : function defaultCallback() {};
  this.settings   = auto.extend( {}, auto.defaults, arguments.length === 3 ? settings : 'function' !== typeof callback ? callback : {} );
  this.response   = {};
  this.listeners  = [];
  this._meta      = { started: new Date().getTime(), timeout: new Date().getTime() + this.settings.timeout };
  this.error      = null;
  this.keys       = Object.keys( this.tasks );

  // Extend this with Event Emitter
  auto.emitter.mixin( this );

  // Ensure there are tasks
  if( !this.keys.length ) {
    return callback( null );
  }

  // Add to running queue
  auto.active[ this.id ] = this;

  // Add final listener
  self.addListener( this.onComplete );

  // Iterate through keys
  self.each( this.keys, this.taskIterator );

  return this;

}

/**
 * Instance Properties.
 *
 */
Object.defineProperties( auto.prototype, {
  taskIterator: {
    value: function taskIterator( key ) {

      var self      = this;
      var task      = this.tasks[key] instanceof Function ? [ this.tasks[key] ] : this.tasks[key];
      var requires  = task.slice( 0, Math.abs( task.length - 1 )) || [];

      // Task Step Context
      var context = {
        id: self.id,
        task: key,
        requires: requires,
        response: self.response,
        tasks: self.tasks
      }

      /**
       * Task Callback
       *
       * @todo Migrate into prototype.
       * @param error
       */
      function taskCallback( error ) {

        // Get response arguments
        var args = Array.prototype.slice.call( arguments, 1) ;

        if (args.length <= 1) {
          args = args[0];
        }

        if( error && error instanceof Error ) {
          var safeResults = {};

          auto.each( Object.keys( self.response ), function( rkey ) {
            safeResults[rkey] = self.response[rkey];
          });

          safeResults[key] = args;

          // Emit task evnet and complete event
          self.emit( 'error', error, safeResults );
          self.emit( 'complete', error, safeResults );

          // Remove from active queue
          delete auto.active[ this.id ];

          // Trigger callback
          self.callback( error, safeResults );

          // stop subsequent errors hitting callback multiple times
          self.callback = function __fake_callback__() {};

        } else {

          // Save task response to general response
          self.response[key] = args;

          // process.nextTick( )
          self.setImmediate( self.stepComplete.bind( self ), key, args );

        }

      };

      /**
       * Ready to Process a Step
       *
       * @todo Migrate into prototype.
       * @returns {*|boolean}
       */
      function ready() {

        // Identify Dependacncies with some form of magic
        var magic = self.reduce( requires, function( a, x ) {
          return ( a && self.response.hasOwnProperty( x ));
        }, true ) && !self.response.hasOwnProperty( key );

        // Step Ready
        self.emit( 'ready', key, magic );

        return magic;

      };

      // Trigger Method
      if( ready() ) {

        task[ task.length - 1 ].bind( context )( taskCallback, self.response, self );

      } else {

        // Create a listener to be checked later
        self.addListener( function listener() {

          if( ready() ) {
            self.removeListener( listener, key );
            task[ task.length - 1 ].bind( context )( taskCallback, self.response );
          }

        }, key );

      }

    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  onComplete: {
    value: function onComplete() {

      if( Object.keys( this.response ).length !== this.keys.length ) {
        return;
      }

      // Will fire multiple times if not checked
      if( this.callback.name === 'Placeholder' ) {
        return;
      }

      // All steps in task are complete
      this.emit( 'complete', null, this.response );
      this.emit( 'success', this.response );

      // Call the primary callback
      this.callback( null, this.response );

      // Remove from active queue
      delete auto.active[ this.id ];

      // Unset Callback
      this.callback = function Placeholder() {};

    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  removeListener: {
    /**
     * Remove Listener from Queue
     *
     * @method removeListener
     * @param fn
     * @param k
     */
    value: function removeListener( fn, k ) {
      // self.emit( 'removeListener', k );

      for( var i = 0; i < this.listeners.length; i += 1 ) {
        if( this.listeners[i] === fn ) { this.listeners.splice(i, 1); return; }
      }

    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  setImmediate: {
    /**
     * Run Method on next tick
     *
     * @method setImmediate
     * @param fn
     * @returns {*}
     */
    value: function setImmediate( fn ) {

      if( process && process.nextTick ) {
        return process.nextTick( fn );
      }

      setTimeout( function() { fn() }, 0 )

    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  each: {
    /**
     * Array Iterator
     *
     * @method each
     * @param arr
     * @param iterator
     * @returns {*}
     */
    value: function each( arr, iterator ) {
      if (arr.forEach) { return arr.forEach( iterator.bind( this ) ); }
      for (var i = 0; i < arr.length; i += 1) { iterator.bind( this )(arr[i], i, arr); }
    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  reduce: {
    /**
     * Array Reduce
     *
     * @method reduce
     * @param arr
     * @param iterator
     * @param memo
     * @returns {*}
     */
    value: function reduce( arr, iterator, memo ) {

      if( arr.reduce) {
        return arr.reduce( iterator , memo);
      }

      this.each( arr, function (x, i, a) {
        memo = iterator(memo, x, i, a);
      });

      return memo;
    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  addListener: {
    /**
     * Add Listener to Queue in context
     *
     * @method addListener
     * @param fn
     * @param k
     */
    value: function addListener( fn , k) {
      // self.emit( 'addListener', k );
      this.listeners.unshift( fn.bind( this ) );
    },
    writable: false,
    enumerable: false,
    configurable: true
  },
  stepComplete: {
    /**
     * Single Step Complete
     *
     * @method stepComplete
     * @param k
     * @param args
     */
    value: function stepComplete( k, args ) {
      // self.emit( 'step_complete', k, args );

      // Get just the methods from each step
      this.each( this.listeners.slice(0), function( fn ) {
        fn();
      });

    },
    writable: false,
    enumerable: false,
    configurable: true
  }
});

/**
 * Constructor Properties
 *
 */
Object.defineProperties( module.exports = auto, {
  middleware: {
    /**
     *
     * @param tasks
     * @param callback
     * @param settings
     * @returns {Function}
     */
    value: function middleware( tasks, callback, settings ) {

      return function middleware( req, res, next ) {

        var instance = auto( tasks, callback, settings );

        instance.on( 'success', function complete( report ) {
          res.send( report );
        });

        instance.on( 'error', function error( error, report ) {
          next( error );
        });

      }

    },
    enumerable: true,
    writable: true,
    configurable: false
  },
  defaults: {
    value: {
      timeout: 5000
    },
    enumerable: true,
    writable: true,
    configurable: false
  },
  emitter: {
    value: require( 'object-emitter' ),
    writable: true,
    enumerable: false
  },
  extend: {
    value: require( 'extend' ),
    enumerable: false,
    writable: true
  },
  active: {
    value: {},
    enumerable: true,
    configurable: false,
    writable: true
  },
});
