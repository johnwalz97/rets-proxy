/**
 * Basic Auto Example
 *
 * @author potanin
 * @date 8/5/13
 */

var auto          = require( '../' );
var colors        = require( 'colors' );

// Example mocking https://github.com/caolan/async#auto
module.exports = auto({

  // Get data, simulation as asynchornous operation
  get_data: [ function get_data( next, report ) {
    console.log( 'get_data'.green );

    setTimeout( function() {
      next( null, {
        name: 'Eric Flatley',
        username: 'Arnoldo_Lubowitz',
        email: 'Tyshawn@emie.biz',
        phone: '917.531.3079 x06115',
        website: 'donald.io'
      });
    }, 1000 )

  }],

  // Create folder, which is an asynchronous operation
  make_folder: [ 'get_data', function make_folder( next, report ) {
    console.log( 'make_folder'.green );

    setTimeout( function() {
      next( null, 'folder created' );
    }, 100 )

  }],

  // Write file once we have the data and folder is created
  write_file: ['get_data', 'make_folder', function write_file( next, report ) {
    console.log( 'write_file'.green );

    setTimeout( function() {
      next( null, 'folder created' );
    }, 1000 )

  }],

  // Email Link once file is written
  email_link: ['write_file', function email_link( next, report ) {
    console.log( 'email_link'.green );
    next( null, 'email sent' );
  }]

})
  .once( 'error', function error( error, report ) {
    console.log( 'error'.green, error, report, this );
  })
  .once( 'success', function error( report )  {
    console.log( 'success'.green, report, this );
  })
  .once( 'complete', function complete( error, report ) {
    console.log( 'complete'.green, error, report, this );
  });