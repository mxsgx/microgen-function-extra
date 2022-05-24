function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  try {
    const fetch = (await import('node-fetch')).default;

    console.info('Updating MgFunction...');

    const response = await fetch('https://microgen.id/api/v2/function', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.MICROGEN_ACCESS_TOKEN}`,
        'content-type': 'application/json;charset=UTF-8',
      },
      body: `{"data":"${Buffer.from(
        process.env.MICROGEN_FUNCTION_DATA,
        'base64'
      ).toString()}","files":[{"name":"api.js","code":"const extra = require(\'microgen-function-extra\');\\r\\n\\r\\nmodule.exports = (app) => {\\r\\n    extra(app);\\r\\n}"},{"name":"package.json","code":"{\\n \\"dependencies\\": {\\"microgen-function-extra\\":\\"mxsgx/microgen-function-extra#build\\"} \\n}"}],"commitMessage":"update function"}`,
      method: 'PATCH',
    });

    if (response.ok) {
      console.info(
        'MgFunction updated! Wait for 5 seconds to make sure function is deployed...'
      );

      await sleep(5000);

      console.info('Rerun project');

      await fetch('https://microgen.id/api/v2/run_project', {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${process.env.MICROGEN_ACCESS_TOKEN}`,
          'content-type': 'application/json;charset=UTF-8',
        },
        body: Buffer.from(process.env.MICROGEN_RERUN_DATA, 'base64').toString(),
        method: 'POST',
      }).catch((err) => {
        console.error('Failed when rerun project', err);
      });
    }
  } catch (e) {
    console.error('Failed updating MgFunction', e);
  }
})();
