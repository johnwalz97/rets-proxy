/**
 * Mocha Test for "Auto" API Methods
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/5/13
 * @type {Object}
 */
module.exports = {

  'Auto API': {

    /**
     * Basic Tests with settings argumetns
     *
     */
    'has expected properties': function() {

      var auto = require( '../' );

      // No arguments returns a plain object
      var instance = auto();
      instance.should.be.a( 'object' );
      Object.keys( instance ).length.should.equal( 0 );

      // Tasks and settings will use default callback
      var instance = auto({ one: function( next, report ) { next( null, 'one done' ); } }, { test: true });
      instance.should.have.property( 'settings' );
      instance.should.have.property( 'callback' );
      instance.callback.should.have.property( 'name', 'defaultCallback' );
      instance.settings.should.have.property( 'timeout', auto.defaults.timeout );
      instance.settings.should.have.property( 'test', true );


      // Tasks, callback and settings will use our callback and merge out settings with default
      var instance = auto({ one: function( next, report ) { next( null, 'one done' ); } }, function ourCallback() {}, { test: true } );
      instance.should.have.property( 'settings' );
      instance.should.have.property( 'callback' );
      instance.callback.should.have.property( 'name', 'ourCallback' );
      instance.settings.should.have.property( 'timeout', auto.defaults.timeout );
      instance.settings.should.have.property( 'test', true );

    },

    /**
     * Test events
     *
     * @param done
     */
    'events work': function( done ) {
      var auto = require( '../' );

      var instance = auto({
        one: function( next, report ) {
          // console.log( 'one' );

          setTimeout( function() {
            next( null, 'one done' );
          }, 10 )

        },

        two: function( next, report ) {
          // console.log( 'two' );

          setTimeout( function() {
            next( null, 'two done' );
          }, 20 )
        },

        three: [ 'one', 'two', function( next, report ) {
          // console.log( 'starting three' );
          next( null, 'three done' );
        }],
      });

      instance.on( 'complete', done );

      instance.on( '**', function( data ) {
        // console.log( 'event:', this.event, data );
      })

    }

  }

};