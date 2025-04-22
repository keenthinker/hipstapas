/**
 * FaunaDB has been sunset and is no longer used in the project.
 * This module is kept for reference and will be removed in the future.
 * 
 * Logs the specified parameters to the configured collection in FaunaDB.
 * Instead of using some analytics and remove unwanted data before saving it (like IP, browser, location, query and so on), 
 * store the endpoint name and the status for statistics. The data will be visualized on the main hipstapas.dev page. 
 * @param {*} endpointName 
 * @param {*} httpCode 
 */
function logEndpointCallOBSOLETE(endpointName, httpCode) {

    let error;
    try {
        const faunadb = require('faunadb');
        const client = new faunadb.Client({ secret: process.env.HIPSTAPAS_FAUNADB_KEY, keepAlive: false });
        const query = faunadb.query;
        
        return client.query(
            query.Create(
                query.Collection(`${process.env.HIPSTAPAS_FAUNADB_COLLECTION}`),
                { data: { counterType: endpointName, httpCode: httpCode }}
            )
        );   
    } catch (thisError) {
        error = thisError;
    }

    return Promise.reject({ 'error' : `D'oh: ${error}`});
}

function logEndpointCall(endpointName, httpCode) {
    return Promise.resolve({ 'message': `${endpointName} endpoint called with HTTP code ${httpCode}` });
}

module.exports = { logEndpointCall };