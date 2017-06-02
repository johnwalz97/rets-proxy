/**
 * Run Coverage Tests / Module
 *
 * @author potanin@UD
 * @date 08/09/13
 */
module.exports = process.env.APP_COVERAGE ? require( './static/lib-cov/rets' ) : require( './lib/rets' );

