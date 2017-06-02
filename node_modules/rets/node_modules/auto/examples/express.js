/**
 * Basic Auto Example
 *
 * @author potanin
 * @date 8/5/13
 */

var auto      = require( '../' );
var express   = require( 'express' );
var request   = require( 'request' );
var app       = express();

app.configure( function configure() {

  this.use( express.bodyParser() );
  this.use( this.router );
  this.use( express.errorHandler() );

  // Working with Repositories
  this.get( '/test/:id', auto.middleware({

    // Get data, simulation as asynchornous operation
    get_data: [ function get_data( next, report ) {

      next( null, {
        name: 'Eric Flatley',
        username: 'Arnoldo_Lubowitz',
        email: 'Tyshawn@emie.biz',
        phone: '917.531.3079 x06115',
        website: 'donald.io'
      });

    }],

    // Create folder, which is an asynchronous operation
    make_folder: [ 'get_data', function make_folder( next, report ) {
      setTimeout( function() { next( null, 'folder created' ); }, 10 )
    }],

    // Write file once we have the data and folder is created
    write_file: ['get_data', 'make_folder', function write_file( next, report ) {
      setTimeout( function() { next( null, 'folder created' ); }, 20 )
    }],

    // Email Link once file is written
    respond: [ 'write_file', function email_link( next, report ) {
      next( null, 'email sent' );
    }]

  }));

  // Start Service
  this.server = this.listen( 0, '127.0.0.1' ).on( 'error', console.error );

  // Export for testing
  module.exports = this;

})