function byIndex(query, indexName) {
    return query.Map(
        query.Paginate(query.Match(query.Index("counterTypeIndex"), indexName), { size: 100 }),
        query.Lambda("v", query.Get(query.Var("v"))));
}

function writeContentToFile(fileName, content) {
    var fs = require("fs");
    fs.writeFile(fileName, content, function (err) {
        if (err) {
            console.error(err);
        }
    });
}

function readContentFromFile(fileName) {
    var fs = require("fs");
    return fs.readFileSync(fileName, "utf8");
}

module.exports = async (req, res) => {

    const MOCK_STATS_DATA = true;

    let result = {};

    if (MOCK_STATS_DATA) {

        result = JSON.parse(readContentFromFile("statsdata.json"));

    } else {

        /* 
        == get all documents for index ==
        Map(
            Paginate(Match(Index("counterTypeIndex"), "uuid"), {size:1000}),
            Lambda("v1", Get(Var("v1")))
        )
        == get document by ref/id ===
        Get(Ref(Collection("counters"), "289584753127981576"))
        == get all documents in a collection ==
        Map(
            Paginate(Documents(Collection('counters'))),
        Lambda(x => q.Get(x))
        )
        */
        const faunadb = require('faunadb');

        try {
            const faunadb = require('faunadb');
            const client = new faunadb.Client({ secret: process.env.HIPSTAPAS_FAUNADB_KEY, keepAlive: false });
            const query = faunadb.query;

            // var r = await client.query(
            //             query.Map(
            //                 query.Paginate(query.Match(query.Index("counterTypeIndex"), "uuid"), { size: 10 }),
            //                 query.Lambda("v1", query.Get(query.Var("v1")))));
            // var r = await client.query(
            //             query.Map(
            //                 query.Paginate(query.Documents(query.Collection("counters")), { size: 5 }),
            //                 query.Lambda("v1", query.Get(query.Var("v1")))));
            //console.log(r.data);
            var p = await client.query(byIndex(query, "password"));
            var u = await client.query(byIndex(query, "uuid"));
            var r = await client.query(byIndex(query, "random"));
            var w = await client.query(byIndex(query, "wordlist"));

            result.password = p.data;
            result.uuid = u.data;
            result.random = r.data;
            result.wordlist = w.data;

            // save mock data
            //writeContentToFile("statsdata.json", JSON.stringify(result));
        } catch (thisError) {
            result.error = "D'oh: an error occurred :-(";
            console.log(thisError);
        }
    }

    const httpCode = 200;

    // https://stackoverflow.com/questions/63643171/how-can-i-search-and-sort-faunadb-by-the-created-timestamp
    // https://stackoverflow.com/questions/61488323/how-to-get-all-documents-from-a-collection-in-faunadb
    res.status(httpCode).send(result);
}