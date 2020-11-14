function logEndpointCall(endpointName) {
        const https = require('https');
        const hostname = 'hipstalog.vercel.app';
        const port = 443;
        https.request({
                hostname: hostname,
                port: port,
                path: `/api/index?counterType=${endpointName}`,
                method: 'GET',
                headers: { 'x-logger-secret': process.env.HIPSTALOG_CALLER_KEY }
                })
                .end();
}

function generationResult(success, results, error) {
        return {
                "success": success,
                "result": results.length == 1 ? results[0] : results,
                "error": error
        };
}

module.exports = { logEndpointCall, generationResult };