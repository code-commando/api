//import monaco from 'monaco-editor';

const editor = {
  find:()=>{ 
    console.log('hello');
    
    let code = require('monaco-editor').editor.create(document.getElementById('container'), {
      value: 'function hello() {\n\talert(\'Hello world!\');\n}',
      language: 'javascript',
    });

    return Promise.resolve(code);
    
  },
  
};
export default editor;