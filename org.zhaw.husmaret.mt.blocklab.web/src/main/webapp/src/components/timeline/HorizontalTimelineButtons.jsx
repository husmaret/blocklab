import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Constants from './helpers/Constants';
import { tokens } from "../../theme";

// icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// this handles the rendering part of the buttons that appear on either side of
// the timeline.

/**
 * These are the static styles for the buttons on either side of the timeline.
 *
 * @param {styles} styles The user-definded styles/the default styles
 * @param {boolean} active Hacky crap to get svg filling color right
 * @return {object} An object containing styles for the buttons
 * link: styles defined for the link elements i.e. the href tag.
 * icon: styles defined for the icon that appears on the button.
 * inactive: styles defined for when the icons are inactive.
 */
const buttonStyles = {
  link: (theme) => ({
    position: 'absolute',
    top: '33px',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 34,
    width: 34,
    borderRadius: '50%',
    border: `2px solid ${tokens(theme.palette.mode).grey[100]}`,
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap',
    transition: 'border-color 0.3s',
  }),
  icon: (active, theme) => ({
    position: 'absolute',
    left: 0,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 20,
    width: 29,
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap',
    fill: active ? tokens(theme.palette.mode).accent[500] : tokens(theme.palette.mode).grey[100]
  }),
  inactive: (theme) => ({
    display: 'none',
    color: tokens(theme.palette.mode).grey[100],
    cursor: 'not-allowed',
    ':hover': {
      border: `2px solid ${tokens(theme.palette.mode).grey[100]}`
    }
  }),
  active: (theme) => ({
    cursor: 'pointer',
    ':hover': {
      border: `2px solid ${tokens(theme.palette.mode).accent[500]}`,
      color: tokens(theme.palette.mode).accent[500]
    }
  })
};


/**
 * Markup for both the buttons (that translate the timeline left or right).
 *
 * @param  {object} props The info provided by the parent
 * @return {StatelessFunctionalReactComponent} The Markup info for both the buttons
 */
const HorizontalTimelineButtons = (props) => {
  const buttonBackEnabled = Math.round(props.position) < 0;
  const buttonForwardEnabled = Math.round(props.position) > Math.round(props.maxPosition);

  return (
    <ul className="buttons">
      <li
        className={`button-back ${buttonBackEnabled ? 'enabled' : 'disabled'}`}
        key={Constants.LEFT}
        onClick={() => props.updateSlide(Constants.LEFT)}
        style={[
          buttonStyles.link(props.theme),
          buttonBackEnabled ? buttonStyles.active(props.theme) : buttonStyles.inactive(props.theme),
          { [Constants.LEFT]: 0 }
        ]}
      >
        <ChevronLeftIcon
          sx={buttonStyles.icon(buttonBackEnabled, props.theme)}
        />
      </li>
      <li
        className={`button-forward ${buttonForwardEnabled ? 'enabled' : 'disabled'}`}
        key={Constants.RIGHT}
        onClick={() => props.updateSlide(Constants.RIGHT)}
        style={[
          buttonStyles.link(props.theme),
          buttonForwardEnabled ? buttonStyles.active(props.theme) : buttonStyles.inactive(props.theme),
          { [Constants.RIGHT]: 0 }
        ]}
      >
        <ChevronRightIcon
          sx={buttonStyles.icon(buttonForwardEnabled, props.theme)}
        />
      </li>
    </ul>
  );
}


// Expected propteries
HorizontalTimelineButtons.propTypes = {
  // The function to update the slide
  updateSlide: PropTypes.func.isRequired,
  // Information about what portion of the timeline is visible between buttons
  position: PropTypes.number.isRequired,
  // The maximum position that the timeline component can acuire, (on initial load will be null)
  maxPosition: PropTypes.number,
  // the theme
  theme: PropTypes.func
};

// Wrapping the buttons with Radium (so we get all the styling goodness)
export default Radium(HorizontalTimelineButtons);
