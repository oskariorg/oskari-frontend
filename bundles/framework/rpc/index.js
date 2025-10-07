// eslint-disable-next-line import/no-webpack-loader-syntax
import 'expose-loader?exposes=Channel!../../../libraries/JSChannel/jschannel';
import './instance';
import './service/RpcService';
import './event/RPCUIEvent';

// register create function for bundleid
Oskari.bundle('rpc', () => Oskari.clazz.create('Oskari.mapframework.bundle.rpc.RemoteProcedureCallInstance'));
