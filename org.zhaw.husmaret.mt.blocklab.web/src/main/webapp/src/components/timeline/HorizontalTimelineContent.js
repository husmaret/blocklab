import React from 'react';
import PropTypes from 'prop-types';

import HorizontalTimeline from './HorizontalTimeline';

export default class HorizontalTimelineContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // timelineConfig
      minEventPadding: 10,
      linePadding: 50,
      labelWidth: 60,
      fillingMotionStiffness: 150,
      fillingMotionDamping: 25,
      slidingMotionStiffness: 150,
      slidingMotionDamping: 25,
      isTouchEnabled: true,
      isKeyboardEnabled: true,
      isOpenEnding: true,
      isOpenBeginning: true
    };
  }

  static propTypes = {
    value: PropTypes.number.isRequired,
    maxIndex: PropTypes.number.isRequired,
    previous: PropTypes.number.isRequired,
    indexClick: PropTypes.func.isRequired,
    timelineData: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string,
      isTimeout: PropTypes.bool
    })).isRequired,
    theme: PropTypes.object.isRequired
  }

  render() {

    const state = this.state;

    return (
      <div key={this.props.value}>
        <div style={{ width: '98%', height: '70px', margin: '8px auto 4px' }}>
          <HorizontalTimeline
            fillingMotion={{ stiffness: state.fillingMotionStiffness, damping: state.fillingMotionDamping }}
            index={this.props.value}
            maxIndex={this.props.maxIndex}
            indexClick={this.props.indexClick}
            isKeyboardEnabled={state.isKeyboardEnabled}
            isTouchEnabled={state.isTouchEnabled}
            labelWidth={state.labelWidth}
            linePadding={state.linePadding}
            minEventPadding={state.minEventPadding}
            slidingMotion={{ stiffness: state.slidingMotionStiffness, damping: state.slidingMotionDamping }}
            timelineData={ this.props.timelineData }
            isOpenEnding={state.isOpenEnding}
            isOpenBeginning={state.isOpenBeginning}
            theme={this.props.theme}
          />
          
        </div>
      </div>
    );
  }
}
