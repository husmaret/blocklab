import { useTheme } from '@mui/material';
import { useState } from 'react';
import GeneratorSidebar from './GeneratorSidebar';
import CodeEditor from '../../components/CodeEditor';

const Generator = (props) => {

  const initialState = props.initialState;
  const generatedFiles = initialState.generatedFiles;
  
  // show the first file if there are any
  const [showFileIndex, setShowFileIndex] = useState(generatedFiles !== undefined && generatedFiles.length > 0 ? 0 : -1);

  const theme = useTheme();

  return (
    <div style={{display: 'grid', gridTemplateColumns: '450px 1fr'}}>
      <GeneratorSidebar initialState={initialState} showFileIndex={showFileIndex} setShowFileIndex={setShowFileIndex} />
      <div key={showFileIndex}>
        {showFileIndex >= 0 && ( 
          <div style={{height: '100%'}}>
            <CodeEditor 
              value={generatedFiles[showFileIndex].content}
              readOnly
              theme={theme}
              ecosystem={initialState.ecosystem}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;