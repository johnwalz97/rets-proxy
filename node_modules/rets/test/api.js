/**
 * Mocha Test for RETS api
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/9/13
 * @type {Object}
 */
module.exports = {

  'RETS API': {

    /**
     * -
     *
     */
    'returns expected constructor properties.': function() {
      var RETS = require( '../' );
      RETS.should.have.property( 'createConnection' );
    },

    /**
     * -
     *
     */
    'can establish connection to a provider.': function( done ) {
      this.timeout( 1000 );
      var RETS = require( '../' );
      done();

    }

  }

};