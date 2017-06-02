/**
 * Mocha Test for "express" example
 *
 * mocha test/express.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/5/13
 * @type {Object}
 */
module.exports = {

  'Auto "express" example': {

    /**
     * -
     *
     */
    'works.': function( done ) {
      var request = require( 'request' );
      var example = require( '../examples/express' );

      example.server.on( 'listening', function() {

        request({
          method: 'get',
          json: true,
          url: [ 'http://', this.address().address, ':', this.address().port, '/test/ping' ].join( '' )
        }, function( error, res, body ) {
          body.should.have.property( 'get_data' );
          body.should.have.property( 'make_folder' );
          body.should.have.property( 'write_file' );
          body.should.have.property( 'respond' );
          done();
        })

      })

    }

  }

};