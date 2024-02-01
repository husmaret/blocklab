import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import dimensions from 'react-dimensions';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/theme-cloud9_night';

import './mode/mode-solidity'
import './mode/mode-blocklab'

class CodeEditor extends React.Component {
  
  render() {
    const props = this.props;
    
    if (!this.props.containerWidth) {
      //As long as we do not know the width of our container, do not render anything!
      return false;
    }

    var visibleWidth = this.props.containerWidth - 32;
    var visibleHeight = this.props.containerHeight - 32;

    var editorMode = 'blocklab';
    if (this.props.ecosystem === 'Ethereum') {
      editorMode = 'solidity';
    }

    return (
      <Box p={'16px'} >
        <AceEditor
          style={{border: '1px solid #666666'}}
          value={props.value}
          readOnly={props.readOnly}
          highlightActiveLine={!props.readOnly}
          wrapEnabled
          showPrintMargin={false}
          mode={editorMode}
          // theme={props.theme.palette.mode === 'dark' ? 'github_dark' : 'github'}
          theme={props.theme.palette.mode === 'dark' ? 'cloud9_night' : 'cloud9_day'}
          name='generated'
          width={visibleWidth+'px'}
          height={visibleHeight+'px'}
        />
      </Box>
    );
  };

}

/**
 * The expected properties from the parent
 * @type {Object}
 */
CodeEditor.propTypes = {
  // --- EVENTS ---
  // Content of the editor
  value: PropTypes.string,
  // the theme
  theme: PropTypes.object.isRequired,
  // the ecosystem
  ecosystem: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired
};

export default dimensions({elementResize: true})(CodeEditor);
