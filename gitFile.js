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
, target
) => (
  `cd ${target}; git archive --remote=${repo} ${reference} ${file} | tar -x`
);

const gitFile = _.curry((
  ctx
, cb
) => {
  const command = cmd(ctx.url, ctx.referenceValue, ctx.file, ctx.target);
  debug('starting command', command);
  exec(command, {silent: false, async:true}, debugCb(debug, cb));
});

module.exports = gitFile;
