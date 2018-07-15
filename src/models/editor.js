import nel from 'nel';

class editor {
  constructor(data) {
    this.data = data;
  }
  save() {
    return Promise.resolve(this.data);
    // const editor = {
    // find: () => {
    //   console.log('hello', req);
    //var result;
    // let code = this.data.code;
    // console.log(solution);
    // let session = new nel.Session();
    // var solution = {};

    // let onStdoutArray = [];
    // let onStderrArray = [];
    // solution.input = code;
 
    // session.execute(code, {
    //   onSuccess: (output) => {
    //     solution.return = output.mime['text/plain'];
    //   },
    //   onError: (output) => {
    //     solution.error = output.error;
    //   },
    //   onStdout: (output) => {
    //     onStdoutArray.push(output);
    //     solution['console.log'] = onStdoutArray;
    //   },
    //   onStderr: (output) => {
    //     onStderrArray.push(output);
    //     solution['console.error'] = onStderrArray;
    //   },
    //   afterRun: () => {
    //     result = solution['console.log'];
    //     console.log('result', result);
       
    //   },
    // });
    //console.log('result with promise', solution);
    
    // let result = this.execute(code);
    
  }
  execute(code){
    let session = new nel.Session();
    this.solution = {};
    let onStdoutArray = [];
    let onStderrArray = [];
    this.solution.input = code;
    session.execute(code, {
      onSuccess: (output) => {
        this.solution.return = output.mime['text/plain'];
      },
      onError: (output) => {
        this.solution.error = output.error;
      },
      onStdout: (output) => {
        onStdoutArray.push(output);
        this.solution['console.log'] = onStdoutArray;
      },
      onStderr: (output) => {
        onStderrArray.push(output);
        this.solution['console.error'] = onStderrArray;
      },
      afterRun: () => {
        console.log(this.solution);
        return this.solution;
        //return Promise.resolve(solution);
      },
    });
    return this.solution;
  }
}
export default editor;