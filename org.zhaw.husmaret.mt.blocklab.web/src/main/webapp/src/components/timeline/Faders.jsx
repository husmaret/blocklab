import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { tokens } from "../../theme";
import Color from 'color';

const LEFT = 'left';
const RIGHT = 'right';

/**
 * Returns the styles that generate a fading effect on the edges of the timeline
 *
 * @param  {string} position The position of the fader. Can only be left or right
 * @param  {string} gradientDirection The direction in which we want to generate fade effect
 * @return {object} The styleing Information for the left or right fader
 */
const faderStyle = {
  base: {
    top: '50%',
    position: 'absolute',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: '100%',
    width: 20,
    overflow: 'hidden',
  },
  specific: (position, gradientDirection, theme) => ({
    [position]: 40,
    backgroundImage: `linear-gradient(to ${gradientDirection}, ${tokens(theme.palette.mode).primary[400]}, ${Color(tokens(theme.palette.mode).primary[400]).alpha(0).rgb()})`
  })
};


/**
 * The markup Information for an element that produces the fade effect at the end of the timeline
 *
 * @param  {object} props The props from parent mainly styles
 * @return {StatelessFunctionalReactComponent} Markup Information for the fader
 */
const Faders = (props) => (
  <ul style={{ listStyle: 'none' }}>
    <li style={[ faderStyle.base, faderStyle.specific(LEFT, RIGHT, props.theme) ]} />
    <li style={[ faderStyle.base, faderStyle.specific(RIGHT, LEFT, props.theme) ]} />
  </ul>
);


/**
 * The styles that parent will provide
 * @type {Object}
 */
Faders.propTypes = {
  theme: PropTypes.object.isRequired
};


export default Radium(Faders);
