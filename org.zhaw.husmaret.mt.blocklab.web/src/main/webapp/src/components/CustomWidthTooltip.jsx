import {styled} from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 600,
    },
});

export default CustomWidthTooltip;