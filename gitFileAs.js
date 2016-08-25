const _ = require('lodash');
const exec = require('shelljs').exec;
const debug = require('debug')('push2cloud-compiler-git:gitFile');

const debugCb = (debugFn, cb) => {
  return (err, result) => {
    if (err) {
      debugFn('error', `Errorcode: ${err}`, result);
    } else {
      debugFn('success', result);
    }
    return cb(err, result);
  };
};


const cmd = (
  repo
, reference
, file
, targetDir
, targetFile
) => (
  `cd ${targetDir}; git archive --remote=${repo} ${reference} ${file} | tar -x ; mv ${file} $( basename ${targetFile} ) ; rm -rf $( echo ${file} | cut -d'/' -f1 )`
);

const gitFile = _.curry((
  ctx
, cb
) => {
  ctx.targetFile = ctx.targetFile || ctx.file;
  const command = cmd(ctx.url, ctx.referenceValue, ctx.file, ctx.targetDir, ctx.targetFile);
  debug('starting command', command);
  exec(command, {silent: false, async:true}, debugCb(debug, cb));
});

module.exports = gitFile;
