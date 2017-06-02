## Overview

Note: This is a beta version. Some of the Stream-esque methods will not work as expected yet.

Based on the EventEmitter2 library.
Notable differences with EventEmitter2 library:

  - Convenience "mixin" method for easily adding EventEmitter to any object.
  - All module methods (on, emit, off, onAny, etc) are chainable.
  - Wildcard matching enabled by default.
  - Extends existing EventEmitters by working with the _events property.
  - Recognizes Node.js domain usage.
  - Allows default configuration to be applied to new instances.
  - Allows default "error" callback to avoid throwing "unspecified 'error' event" error.
  - Custom logger can be set for debugging.
  - Emulates Stream functionality and allows event piping via the "pipe" method.

## Basic Usage
Create new instance of Object Channels.

    require( 'object-channels' )
      .create({ delimiter: ':' })
      .on( '*:two', console.log )
      .emit( 'ping:one', 'I am ignored.' );  
      .emit( 'ping:two', 'I am not ignored!' );  

Add Object Channels to a new object.

    var MyObject = {};
    
    require( 'object-channels' ).mixin( MyObject );    
    
    MyObject
      .on( 'ping', console.log )
      .emit( 'ping', 'Chaining works!' );
    
Extend existing EventEmitter object and utilize wildcards.

    require( 'object-channels' ).mixin( process );    
    process.on( '*.ping', console.log );
    process.emit( 'ding', 'I am ignored.' );
    process.emit( 'ding.ping', 'I am not ignored!' );
    
Pipe Request stream to the console.

    app.get( '/pipe', function( req, res, next ) {
      require( 'object-channels' ).mixin( req ).pipe( process.stdout );         
      next();      
    });

## Advanced Usage

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
