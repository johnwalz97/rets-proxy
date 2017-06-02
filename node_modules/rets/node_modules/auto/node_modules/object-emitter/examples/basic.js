/**
 * -
 *
 * -
 *
 * @author potanin
 * @date 7/22/13
 */

var ObjectEmitter = require( '../' );

var Instance = ObjectEmitter.create();

var user = ObjectEmitter.include({
  name: 'John',
  age: 20
});

var vehicle = ObjectEmitter.mixin({
  make: 'Chevy',
  model: 'Tahoe'
});

Instance.on( 'ping', console.log.bind( console.log, 'ping:' ) );
Instance.on( 'some.*.channel', console.log.bind( console.log, 'some channel:' ) );

Instance.emit( 'ping', 'ding1' );
Instance.emit( 'ping', 'ding2' );

Instance.emit( 'some.blue.channel', 'blue' );
Instance.emit( 'some.red.channel', 'red' );

user.on( 'ping', console.log.bind( console.log, 'user ping:' ) );
user.emit( 'ping', 'ding1' );
user.emit( 'ping', 'ding2' );

vehicle.on( 'ping', console.log.bind( console.log, 'vehicle ping:' ) );
vehicle.emit( 'ping', 'ding1' );
vehicle.emit( 'ping', 'ding2' );
