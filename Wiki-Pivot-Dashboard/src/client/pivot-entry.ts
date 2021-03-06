require('./pivot-entry.css');

import { List } from 'immutable';
import { Timezone, WallTime } from 'chronoshift';

import { queryUrlExecutorFactory } from './utils/ajax/ajax';
import { DataSource, DataSourceJS } from '../common/models/index';

import { pivot } from './pivot';

// Init chronoshift
if (!WallTime.rules) {
  var tzData = require("chronoshift/lib/walltime/walltime-data.js");
  WallTime.init(tzData.rules, tzData.zones);
}

var config: any = (window as any)['__CONFIG__'];

var version: string = null;
var dataSources: List<DataSource>;

if (config && Array.isArray(config.dataSources)) {
  version = config.version || '0.0.0';
  dataSources = <List<DataSource>>List(config.dataSources.map((dataSourceJS: DataSourceJS) => {
    var executor = queryUrlExecutorFactory(dataSourceJS.name, '/plywood', version);
    return DataSource.fromJS(dataSourceJS, executor);
  }));

  var container = document.getElementsByClassName('app-container')[0];
  if (container) {
    pivot(container, {
      version,
      user: config.user,
      dataSources,
      linkViewConfig: config.linkViewConfig
    });
  }

} else {
  throw new Error('config not found');
}
