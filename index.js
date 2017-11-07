const child_process = require('child_process');

exports.handler = function(event, context) {
  let webhook_url = event.Records[0].customData;
  let repo = event.Records[0].eventTriggerName;

  let curl_str = 'curl -X POST ' + webhook_url.replace("$","%24") + ' -d \'{"format": "basic","url":"ssh://git-codecommit.eu-west-1.amazonaws.com/v1/repos/' + repo + '"}\' -H "Content-type: application/json"';

  const curl = child_process.spawn('/bin/bash', [ '-c',  curl_str], {detached: true, stdio: 'ignore'});
  
  curl.on('close', function(code) {
    if(code !== 0) {
      return context.done(new Error("non zero process exit code"));
    }
    context.done(null);
  });
  
}