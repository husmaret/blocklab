import PropTypes from 'prop-types';
import { IconButton, Tooltip } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const EventNavigation = (props) => {

    const state = props.state;
    const handleIndexChange = props.handleIndexChange;

    return (
      <div>
      <Tooltip arrow placement={"top"} title={"Navigate to previous event"}>
        <span>
          <IconButton disabled={state.value === 0} onClick={() => {
            handleIndexChange(state.value - 1);
          }}>
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip arrow placement={"top"} title={"Navigate to next event"}>
        <span>
          <IconButton disabled={state.value === (state.timelineData.length - 1)} onClick={() => {
            handleIndexChange(state.value + 1);
          }}>
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
    );
}

EventNavigation.propTypes = {
    state: PropTypes.object.isRequired,
    handleIndexChange: PropTypes.func.isRequired,
}

export default EventNavigation;
