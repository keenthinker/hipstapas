function logEndpointCall(endpointName, httpCode) {
    return Promise.resolve({ 'message': `${endpointName} endpoint called with HTTP code ${httpCode}` });
}

module.exports = { logEndpointCall };