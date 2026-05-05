function firstItemIfArrayHasLengthOne(r) {
        return r.length === 1 ? r[0] : r;
}

function executeIfConditionIsMet(conditionIsMet, callback) {
        if (conditionIsMet) {
            callback();
        }
}

function evaluateBooleanQueryParameter(p) {
        let result = 'fire validaton message :(';
        const parameterNoDuplicates = String(p).toLowerCase();
        if ((parameterNoDuplicates === 'true') || (parameterNoDuplicates === 'false')) {
            result = (parameterNoDuplicates === 'true');
        }
        return result;
}

module.exports = { firstItemIfArrayHasLengthOne, executeIfConditionIsMet, evaluateBooleanQueryParameter };