require('./totals.css');

import { List } from 'immutable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { $, ply, Expression, Executor, Dataset } from 'plywood';
import { hasOwnProperty } from '../../../common/utils/general/general';
import { Stage, Essence, Splits, SplitCombine, Filter, Dimension, Measure, Colors, DataSource, VisualizationProps, Resolve } from "../../../common/models/index";
import { Loader } from '../../components/loader/loader';
import { QueryError } from '../../components/query-error/query-error';

const PADDING_H = 100;
const TOTAL_WIDTH = 176;

export interface TotalsState {
  loading?: boolean;
  dataset?: Dataset;
  error?: any;
}

export class Totals extends React.Component<VisualizationProps, TotalsState> {
  static id = 'totals';
  static title = 'Totals';

  static handleCircumstance(dataSource: DataSource, splits: Splits, colors: Colors, current: boolean): Resolve {
    if (!splits.length()) return Resolve.ready(10);
    return Resolve.automatic(3, { splits: Splits.EMPTY });
  }

  public mounted: boolean;

  constructor() {
    super();
    this.state = {
      loading: false,
      dataset: null,
      error: null
    };
  }

  fetchData(essence: Essence): void {
    var { dataSource } = essence;
    var measures = essence.getMeasures();

    var $main = $('main');

    var query = ply()
      .apply('main', $main.filter(essence.getEffectiveFilter(Totals.id).toExpression()));

    measures.forEach((measure) => {
      query = query.performAction(measure.toApplyAction());
    });

    this.setState({ loading: true });
    dataSource.executor(query)
      .then(
        (dataset: Dataset) => {
          if (!this.mounted) return;
          this.setState({
            loading: false,
            dataset,
            error: null
          });
        },
        (error) => {
          if (!this.mounted) return;
          this.setState({
            loading: false,
            dataset: null,
            error
          });
        }
      );
  }

  componentDidMount() {
    this.mounted = true;
    var { essence } = this.props;
    this.fetchData(essence);
  }

  componentWillReceiveProps(nextProps: VisualizationProps) {
    var { essence } = this.props;
    var nextEssence = nextProps.essence;
    if (
      nextEssence.differentDataSource(essence) ||
      nextEssence.differentEffectiveFilter(essence, Totals.id) ||
      nextEssence.newSelectedMeasures(essence)
    ) {
      this.fetchData(nextEssence);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    var { essence, stage } = this.props;
    var { loading, dataset, error } = this.state;

    var myDatum = dataset ? dataset.data[0] : null;
    var measures = essence.getMeasures();
    var single = measures.size === 1;

    var totals = measures.map(measure => {
      var measureName = measure.name;

      var measureValueStr = '-';
      if (myDatum) {
        measureValueStr = measure.formatFn(myDatum[measureName] as number);
      }

      return <div
        className={'total' + (single ? ' single' : '')}
        key={measure.name}
      >
        <div className="measure-name">{measure.title}</div>
        <div className="measure-value">{measureValueStr}</div>
      </div>;
    });

    var loader: JSX.Element = null;
    if (loading) {
      loader = <Loader/>;
    }

    var queryError: JSX.Element = null;
    if (error) {
      queryError = <QueryError error={error}/>;
    }

    var totalContainerStyle: React.CSSProperties = null;
    if (!single) {
      var numColumns = Math.min(totals.size, Math.max(1, Math.floor((stage.width - 2 * PADDING_H) / TOTAL_WIDTH)));
      var containerWidth = numColumns * TOTAL_WIDTH;
      totalContainerStyle = {
        left: '50%',
        width: containerWidth,
        marginLeft: -containerWidth / 2
      };
    }

    return <div className="totals">
      <div className="total-container" style={totalContainerStyle}>{totals}</div>
      {queryError}
      {loader}
    </div>;
  }
}
