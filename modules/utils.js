function generationResult(success, results, error) {
        return {
                "success": success,
                "result": results.length == 1 ? results[0] : results,
                "error": error
        };
}

module.exports = { generationResult };