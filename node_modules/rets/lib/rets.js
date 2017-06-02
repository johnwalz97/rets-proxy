/**
 * RETS Client
 * ===========
 *
 * ### Event Types
 * - digest.error
 * - connection: General connection event - could mean success or error.
 * - connection.success: Successful connection only
 * - connection.error: General connection error.
 * - connection.parse.error: General connection parsing error.
 * - connection.closed: Digest authentication connection closed.
 * - request.error: General request error.
 * - request.parse.error: Request successful, but parsing failed.
 * - request.{TYPE}.complete: Request complete.
 * - get_meta.complete: Meta loaded
 *
 * ### Response Types
 * classes -
 *
 * @constructor
 * @module RETS
 * @param settings
 * @param cb
 * @returns {*}
 * @constructor
 */
function RETS( settings, cb ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof RETS ) ) {
    return new RETS( settings, cb );
  }

  var Instance      = this;
  var extend        = require( 'extend' );
  var digest        = require( './digest' );

  // Mixin Settings and EventEmitter
  require( 'object-settings' ).mixin( Instance );
  require( 'object-emitter' ).mixin( Instance );

  // Configure Instance.
  Instance.set({
    settings: settings,
    digest: true,
    property: 'Property'
  });

  var _connection_data = [];

  // Make Authentication Request.
  digest( settings.user, settings.pass ).request({
    host: settings.host,
    path: settings.path,
    port: settings.port || 80,
    method: 'GET',
    headers: settings.headers || { "User-Agent": "NODE-RETS/1.0" }
  }, function authorization( res ) {

    // e.g. ECONNRESET
    this.on( 'error', function error( error ) {

      if( error.message === 'ECONNRESET' ) {
        Instance.emit( 'connection.closed', Instance );
      } else {
        console.error( 'Uncaught RETS error:', error.message );
      }

    });

    // Connection complete.
    res.on( 'end', function digest_end() {
      // RETS.debug( 'end' );

      // Save authentication response headers.
      Instance.set( 'headers', this.headers )

      // Save RETS-server details.
      Instance.set( 'rets.version', this.headers[ 'rets-version' ] )
      Instance.set( 'rets.server', this.headers[ 'server' ] )
      Instance.set( 'rets.cookie', this.headers[ 'set-cookie' ] )

      // Parse connection data.
      Instance._parse( _connection_data, function parsed( error, connection_data ) {


        // Parse Error of connection data.
        if( error ) {
          return Instance.emit( 'connection.parse.error', error, connection_data );
        }

        // Connection response code must be 0.
        if( connection_data.code != 0 ) {
          return Instance.emit( 'connection.error', new Error( 'Connection response code not the expected 0.' ), connection_data );
        }

        // Save general provider information.
        Instance.set( 'provider.name', connection_data.data.MemberName );
        Instance.set( 'provider.user', connection_data.data.User );
        Instance.set( 'provider.broker', connection_data.data.Broker );

        // Save meta data.
        Instance.set( 'meta.version', connection_data.data.MetadataVersion );
        Instance.set( 'meta.min_version', connection_data.data.MinMetadataVersion );
        Instance.set( 'meta.timestamp', connection_data.data.MetadataTimestamp );

        // Save connection URLs.
        Instance.set( 'url.get_meta', connection_data.data.GetMetadata );
        Instance.set( 'url.get_object', connection_data.data.GetObject );
        Instance.set( 'url.login', connection_data.data.Login );
        Instance.set( 'url.logout', connection_data.data.Logout );
        Instance.set( 'url.search', connection_data.data.Search );

        // Emit connection success.
        Instance.emit( 'connection', null, Instance );
        Instance.emit( 'connection.success', Instance );

      });

    });

    // Connection failure.
    res.on( 'error', function digest_error( error ) {
      Instance.emit( 'connection', error, Instance );
      Instance.emit( 'connection.error', error, Instance );
      RETS.debug( error );
    });

    // Connection data.
    res.on( 'data', function digest_data( data ) {
      _connection_data.push( data.toString() );
      RETS.debug( 'data', data.toString() );
    });

  });

  // Return context.
  return this;

}

/**
 * RETS Instance Properties.
 *
 */
Object.defineProperties( RETS.prototype, {
  request: {
    /**
     * Abstract RETS Query wrapper.
     *
     * @async
     * @method request
     * @param type
     * @param query
     * @param cb
     * @returns {*}
     */
    value: function request( query, cb ) {

      var Instance      = this;
      var request       = require( 'request' );
      var parse         = require( 'xml2js' ).parseString;

      // DEBUG
      var url = "http://www.parmls.com/SERetsPensacola/GetMetadata.aspx";

      // Normalize parametrs.
      query   = 'object' === typeof query ? { Type: 'METADATA-CLASS' } : query;
      cb      = 'function' === typeof cb ? cb : function default_callback() {}

      request({
        method: 'GET',
        url: url,
        qs: {
          Type: query.type || 'METADATA-CLASS',
          ID: query.id || 'Property',
          Format: 'STANDARD-XML'
        },
        auth: {
          user: Instance.get( 'settings.user' ),
          pass: Instance.get( 'settings.pass' ),
          sendImmediately: false
        }
      }, function response( error, res, body ) {

        // Request error.
        if( error ) {
          return Instance.emit( 'request.error', error, res, cb( error, res ) );
        }

        Instance._parse( body, function parsed( error, data ) {

          if( error ) {
            return Instance.emit( 'request.parse.error', error, res, cb( error, res ) );
          }

          // Emit response and trigger callback.
          return Instance.emit( [ 'request', query.Type.toLowerCase(), 'complete' ].join( '.' ), null, data, cb( null, data ) );

        });

      });

      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  get_classifications: {
    /**
     * Get Classification Meta Data
     *
     * @async
     * @chainable
     * @method get_classifications
     * @param cb {Function} Callback function.
     * @returns {Object} Context
     */
    value: function get_classifications( cb ) {

      this.request({
        type: 'METADATA-CLASS',
        id: 'Property'
      }, cb );

      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  _parse: {
    /**
     * Parse RETS response and return an Object.
     *
     * @async
     * @chainable
     * @method _parse
     * @private
     *
     * @param data {String}
     * @returns {*} Instance.
     */
    value: function _parse( data, cb ) {

      var Instance      = this;
      var parse         = require( 'xml2js' ).parseString;
      var _             = require( 'lodash' );

      // Parse XML
      parse( data, function xml_parsed( error, data ) {

        try {

          if( error ) {
            throw new Error( 'Response parse error: ' + error.message );
          }

          if( !data ) {
            throw new Error( 'No data to parse.' );
          }

          if( 'object' !== typeof data.RETS ) {
            throw new Error( 'Response does not contain a proper RETS property. ' );
          }

          // Standard response code and text, response type and empty data container.
          var parsed = {
            code: data.RETS[ '$' ].ReplyCode,
            text: data.RETS[ '$' ].ReplyText,
            type: undefined,
            resource: undefined,
            data: {}
          };

          // Connection data. @wiki: https://github.com/UsabilityDynamics/node-rets/wiki/Connection-Response
          if( data.RETS[ 'RETS-RESPONSE' ] ) {

            parsed.type = 'connection';

            // Iterate through each line and convert to key and value pair.
            data.RETS[ 'RETS-RESPONSE' ][0].split( "\r\n," ).forEach( function line_parser( line, index ) {

              // Ignore completely blank lines.
              if( !line ) {
                return;
              }

              var split   = line.split( '=' );
              var key     =  split[0].replace(/^\s+|\s+$/g, '' );
              var value   =  split[1].replace(/^\s+|\s+$/g, '' );

              parsed.data[ key ] = value;

            });

            // Trigger callback with parsed data.
            return cb( null, parsed );

          }

          // Some sort of meta.
          if( data.RETS[ 'METADATA' ] && _.first( data.RETS[ 'METADATA' ] ) ) {

            // Classification meta.
            if( _.first( data.RETS[ 'METADATA' ][0][ 'METADATA-CLASS' ] ) ) {
              parsed.type = 'classifications';
              parsed.resource = data.RETS[ 'METADATA' ][0][ 'METADATA-CLASS' ][0]['$'].Resource;

              // Iterate through each class data type and create object
              data.RETS[ 'METADATA' ][0][ 'METADATA-CLASS' ][0].Class.forEach( function iterate( class_data ) {
                parsed.data[ class_data.ClassName ] = class_data;
              });

              // Trigger callback with parsed data.
              return cb( null, parsed );

            }

            throw new Error( 'Unknown RETS METADATA response sub-type.' );

          }

          throw new Error( 'Unknown RETS response type, could not identify nor parse.' );

        } catch( error ) {
          console.error( 'Paser Error:', error.message, error );
          RETS.debug( error.message );
          cb( error, parsed )
        }

      });

      // Chainable.
      return this;

    },
    enumerable: false,
    configurable: true,
    writable: true
  }
});

/**
 * RETS Constructor Properties.
 *
 */
Object.defineProperties( module.exports = RETS, {
  debug: {
    /**
     * RETS Debugger
     *
     * @esample
     *    RETS.debug( 'Debug Mesage' );
     *
     */
    value: require( 'debug' )( 'RETS' ),
    enumerable: true,
    configurable: true,
    writable: true
  },
  createConnection: {
    /**
     * Create new Connection
     *
     * @param settings
     * @param cb
     * @returns {RETS}
     */
    value: function createConnection( settings, cb ) {
      return new RETS( settings, cb )
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});