import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { Tooltip } from '@mui/material';
import { tokens } from "../../theme";

const timeoutLabelToWords = (label) => {
  // const result = label.replace(/([A-Z])/g, " $1");
  const result = label;
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * The static/non-static styles Information for a single event dot on the timeline
 */
const dots = {
  /**
   * The style information for the clickable dates that apper floating over the timeline
   */
  links: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    paddingBottom: 15,
  },
  /**
   * The base style information for the event dot that appers exactly on the timeline
   */
  base: {
    position: 'absolute',
    bottom: -5,
    height: 12,
    width: 12,
    borderRadius: '50%',
    transition: 'background-color 0.3s, border-color 0.3s',
    ':hover': {}, // We need this to track the hover state of this element
  },
  /**
   * The base style information for the event dot that appers exactly on the timeline
  */
 baseTimeout: {
   position: 'absolute',
   bottom: -9,
   height: 20,
   width: 3,
   transition: 'background-color 0.3s, border-color 0.3s',
   ':hover': {}, // We need this to track the hover state of this element
  },
  /**
   * future: The style information for the future dot (wrt selected).
   */
  future: (theme) => ({
    backgroundColor: tokens(theme.palette.mode).primary[400],
    border: `2px solid ${tokens(theme.palette.mode).grey[100]}`,
  }),
  /**
   * past: The styles information for the past dot (wrt selected)
   */
  past: (theme) => ({
    backgroundColor: tokens(theme.palette.mode).primary[400],
    border: `2px solid ${tokens(theme.palette.mode).accent[500]}`,
  }),
  /**
   * present: The styles information for the preset dot
   */
  present: (theme) => ({
    backgroundColor: tokens(theme.palette.mode).accent[500],
    border: `2px solid ${tokens(theme.palette.mode).accent[500]}`,
  }),

  /**
   * timeout: The styles information for a timeout dot in the past or present
   */
  timeout: (theme) => ({
    backgroundColor: tokens(theme.palette.mode).accent[500],
    border: `2px solid ${tokens(theme.palette.mode).accent[500]}`,
  }),
  
  /**
   * timeoutFuture: The styles information for a timeout dot in the future
   */
  timeoutFuture: (theme) => ({
    backgroundColor: tokens(theme.palette.mode).primary[400],
    border: `2px solid ${tokens(theme.palette.mode).grey[100]}`,
  }),
  
};


/**
 * The markup for one single dot on the timeline
  *
 * @param {object} props The props passed down
 * @return {StatelessFunctionalReactComponent} The markup for a dot
 */
class TimelineDot extends React.Component {

  __getDotStyles__ = (dotType, key, theme) => {
    const hoverStyle = {
      backgroundColor: tokens(theme.palette.mode).accent[500],
      border: `2px solid ${tokens(theme.palette.mode).accent[500]}`,
    };

    const baseToUse = this.props.isTimeout ? dots.baseTimeout : dots.base;

    return [
      baseToUse,
      { left: this.props.labelWidth / 2 - dots.base.width / 2},
      dots[dotType](theme),
      Radium.getState(this.state, key, ':hover') || Radium.getState(this.state, 'dot-dot', ':hover')
        ? hoverStyle
        : undefined,
    ]
  }

  render() {

    let dotType = 'future';
    if (this.props.index < this.props.selected) {
      dotType = 'past';
    } else if (this.props.index === this.props.selected) {
      dotType = 'present';
    }
    // overwrite dot type when its a timeout
    if (this.props.isTimeout){
      if(dotType === 'future'){
        dotType = 'timeoutFuture';
      } else {
        dotType = 'timeout';
      }
    }

    let labelColor = tokens(this.props.theme.palette.mode).grey[500];
    if (this.props.index === this.props.selected) {
      labelColor = tokens(this.props.theme.palette.mode).accent[500];
    } else if (this.props.index <= this.props.maxIndex ) {
      labelColor = tokens(this.props.theme.palette.mode).grey[100];
    }

    return (
      <li
        key={ this.props.date }
        id={`timeline-dot-${this.props.date}`}
        className={`${dotType} dot-label`}
        onClick={() => {
          this.props.onClick(this.props.index)
        }}
        style={[
          dots.links,
          {
            left: this.props.distanceFromOrigin - this.props.labelWidth / 2,
            cursor: 'pointer',
            width: this.props.labelWidth,
            ':hover': {}, // We need this to track the hover state of this element
          }
        ]}
      >
        { this.props.isTimeout && (
          <div>
            <Tooltip arrow placement='top' title={this.props.label}>
              <span style={{color: labelColor}}>
                { timeoutLabelToWords(this.props.tooltip) }
              </span>
            </Tooltip>
            <span
              key='dot-dot'
              // use timeout type
              style={this.__getDotStyles__(dotType, this.props.date, this.props.theme)}
            />
          </div>
        )}

        { !this.props.isTimeout && (
          <div>
            <Tooltip arrow placement='top' title={this.props.tooltip}>
              <span style={{color: labelColor}}>
                { this.props.label }
              </span>
            </Tooltip>
            <span
              key='dot-dot'
              // use timeout type
              style={this.__getDotStyles__(dotType, this.props.date, this.props.theme)}
            />
          </div>
        )}
      </li>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
TimelineDot.propTypes = {
  // The index of the currently selected dot (required to style as old, present, or future event)
  selected: PropTypes.number.isRequired,
  // The index of the present event (used for deciding the styles alongside selected)
  index: PropTypes.number.isRequired,
  // The index of max selected event (used for deciding the styles alongside selected)
  maxIndex: PropTypes.number.isRequired,
  // The actual date of the event (used as key and id)
  date: PropTypes.string.isRequired,
  // The onClick handler ( in this case to trigger the fillingMotion of the timeline )
  onClick: PropTypes.func.isRequired,
  // The tooltip of the event
  tooltip: PropTypes.string.isRequired,
  // The date of the event (required to display it)
  label: PropTypes.string.isRequired,
  // The isTimeout boolean
  isTimeout: PropTypes.bool,
  // The width you want the labels to be
  labelWidth: PropTypes.number.isRequired,
  // The numerical value in pixels of the distance from the origin
  distanceFromOrigin: PropTypes.number.isRequired,
  // The theme
  theme: PropTypes.object.isRequired,
};

export default Radium(TimelineDot);
