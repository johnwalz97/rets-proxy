/**
 * Mocha Test for "basic" example
 *
 * mocha basic.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/5/13
 * @type {Object}
 */
module.exports = {

  'Auto "basic" example': {

    /**
     *
     */
    'successfully triggeres "complete" event.': function( done ) {
      var example = require( '../examples/basic' );
      example.on( 'complete', done );
    }

  }

};