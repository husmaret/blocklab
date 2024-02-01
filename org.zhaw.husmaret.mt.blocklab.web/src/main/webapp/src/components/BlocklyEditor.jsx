import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { BlocklyWorkspace } from 'react-blockly';
import { toolbox } from '../blockly/BlockLabToolbox';
import "./../App.css";
import { blocks } from "../blockly/BlockLabBlocks";
import Blockly from "blockly";
import DarkTheme from "../blockly/DarkTheme";
import {FieldDate} from '@blockly/field-date';

const BlocklyEditor = (props) => {

    const theme = useTheme();

    const [workspaceConfiguration, setWorkspaceConfiguration] = useState({
        theme: DarkTheme,
        grid: {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        move: {
            scrollbars: {
                vertical: true,
                horizontal: true
            }
        }
    });

    useEffect(() => {
        var workspaceConfigurationTmp = JSON.parse(JSON.stringify(workspaceConfiguration));
        workspaceConfigurationTmp.theme = theme.palette.mode === 'dark' ? DarkTheme : Blockly.Themes.Classic;
        setWorkspaceConfiguration(workspaceConfigurationTmp);
        if (theme.palette.mode === 'dark') {
            Blockly.utils.colour.setHsvSaturation(0.55);
        } else {
            Blockly.utils.colour.setHsvSaturation(0.45);
        }
    }, [theme]);
    
    useEffect(() => {
        Blockly.utils.colour.setHsvValue(0.65);
        // load the custom blocks once
        Blockly.common.defineBlocks(Blockly.common.createBlockDefinitionsFromJsonArray(blocks));
    }, [])

    return (
        <div key={workspaceConfiguration.theme.name + '- ' + props.className}>
            <BlocklyWorkspace
                initialJson={props.value}
                onJsonChange={props.onChange}
                onXmlChange={props.setXml}
                className={props.className}
                toolboxConfiguration={toolbox}
                onWorkspaceChange={props.onWorkspaceChange}
                workspaceConfiguration={workspaceConfiguration}
            />
        </div>
    );
}

/**
 * The expected properties from the parent
 * @type {Object}
 */
BlocklyEditor.propTypes = {
  // --- EVENTS ---
  // Content of the editor
  value: PropTypes.object,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  // the theme
  theme: PropTypes.object.isRequired,
};

export default BlocklyEditor;
