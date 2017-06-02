Asynchronous task runner for Node.js
Beta version - use at own risk.

## Basic Usage
Basic usage example.

```javascript
  auto({

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
      setTimeout( function() { next( null, 'folder created' ); }, 100 )
    }],

    // Write file once we have the data and folder is created
    write_file: ['get_data', 'make_folder', function write_file( next, report ) {
      setTimeout( function() { next( null, 'folder created' ); }, 200 )
    }],

    // Email Link once file is written
    email_link: ['write_file', function email_link( next, report ) {
      next( null, 'email sent' );
    }]

  }).once( 'complete', console.log )
```

### Express Middleware Usage
The auto task runner may be used as a middleware method.

```javascript
  app.get( '/test/:id', auto.middleware( tasks );
```

See the "express" example in the examples directory.

## Task Runner Events
Advanced usage example.

 - complete: Gets triggered when all steps are complete or an error is thrown.
 - error: Gets triggered when an error is thrown and the task queue is stopped.
 - success: Gets triggered on successful completion.

## Task Runner Properties
Each instance has the following properties.

 - id: Random ID generated for each instance.
 - error: Contains error object if error thrown.
 - tasks: Contains object with tasks.
 - callback: Reference to callback method, if provided.
 - settings: Settings object for instance.
 - response: Response object.
 - _meta: Runtime meta, such as timestamp for when started.
 - _events: ObjectEmitter (EventEmitter2-esque) object of listeners.

## Task Step Context Properties
Each step is executed within a context with the following properties:

 - task: Name of the current task.
 - requires: Array of required steps for this step to execute.
 - id: Reference to the instance ID.
 - tasks: Reference to the tasks object.

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