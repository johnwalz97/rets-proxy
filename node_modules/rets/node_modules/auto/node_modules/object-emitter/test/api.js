/**
 * Object Channels API
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/11/13
 * @type {Object}
 */
module.exports = {

  before: function() {
    module.noop = function() {}
  },

  'Object Emitter API': {

    'has expected methods': function() {
      var channels = require( '../' );

      // Constructor tests
      channels.should.be.a( 'function' );
      channels.should.have.property( 'prototype' );

      // Inherited Abstract methods
      channels.should.have.property( 'create' );
      channels.should.have.property( 'use' );
      channels.should.have.property( 'get' );
      channels.should.have.property( 'set' );
      channels.prototype.should.have.property( 'mixin' );
      channels.prototype.should.have.property( 'use' );

      // Prototypal Methods
      channels.prototype.should.have.property( 'on' );

    },

    'can be instantiated via create() method.': function() {
      var instance = require( '../' ).create();

      instance.should.have.property( 'mixin' );
      instance.should.have.property( 'on' );
      instance.should.have.property( 'off' );
      instance.should.have.property( 'emit' );
      instance.should.have.property( 'emit' );

    },

    'on() method is chainable.': function() {
      //require( '../' ).create().on( 'noop', console.log ).should.have.property( 'emit' );
    },

    'off() method is chainable.': function() {
      //require( '../' ).create().off( 'noop', module.noop ).should.have.property( 'emit' );
    },

    'emit() method is chainable.': function() {
      //require( '../' ).create().emit( 'noop', module.noop ).should.have.property( 'emit' );
    },

    'emit() method works.': function( done ) {
      return done();

      require( '../' ).create().on( 'ping', function( data ) {
        data.should.equal( 'ding' );
        this.should.have.property( 'event', 'ping' );
        done()
      }).emit( 'ping', 'ding' );

    }

  }

};