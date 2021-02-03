/**
 * Logs the specified parameters to the configured collection in FaunaDB.
 * Instead of using some analytics and remove unwanted data before saving it (like IP, browser, location, query and so on), 
 * store the endpoint name and the status for statistics. The data will be visualized on the main hipstapas.dev page. 
 * @param {*} endpointName 
 * @param {*} httpCode 
 */
function logEndpointCall(endpointName, httpCode) {

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

module.exports = { logEndpointCall };