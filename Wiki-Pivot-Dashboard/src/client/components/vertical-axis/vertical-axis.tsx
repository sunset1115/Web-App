require('./vertical-axis.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { SvgIcon } from '../svg-icon/svg-icon';
import * as d3 from 'd3';
import { formatterFromData } from '../../../common/utils/formatter/formatter';
import { Stage, Measure } from '../../../common/models/index';
// import { SomeComp } from '../some-comp/some-comp';

const TICK_WIDTH = 5;
const TEXT_OFFSET = 2;

export interface VerticalAxisProps extends React.Props<any> {
  stage: Stage;
  yTicks: number[];
  scaleY: any;
}

export interface VerticalAxisState {
}

export class VerticalAxis extends React.Component<VerticalAxisProps, VerticalAxisState> {

  constructor() {
    super();
    // this.state = {};

  }

  render() {
    var { stage, yTicks, scaleY } = this.props;

    var formatter = formatterFromData(yTicks, Measure.DEFAULT_FORMAT);

    var lines = yTicks.map((tick: any, i: number) => {
      var y = scaleY(tick);
      return <line className="tick" key={String(tick)} x1={0} y1={y} x2={TICK_WIDTH} y2={y}/>;
    });

    var labelX = TICK_WIDTH + TEXT_OFFSET;
    var dy = "0.31em";
    var labels = yTicks.map((tick: any, i: number) => {
      var y = scaleY(tick);
      return <text className="tick" key={String(tick)} x={labelX} y={y} dy={dy}>{formatter(tick)}</text>;
    });

    return <g className="vertical-axis" transform={stage.getTransform()}>
      <line className="border" x1={0} x2={0} y1={0} y2={stage.height}/>
      {lines}
      {labels}
    </g>;
  }
}
