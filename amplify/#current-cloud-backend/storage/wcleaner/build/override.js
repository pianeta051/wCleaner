"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
function override(resources, amplifyProjectInfo) {
    resources.dynamoDBTable.provisionedThroughput = undefined;
    resources.dynamoDBTable.billingMode = "PAY_PER_REQUEST";
    const indexes = resources.dynamoDBTable.globalSecondaryIndexes;
    if (Array.isArray(indexes)) {
        const newIndexes = indexes.map((index) => {
            if (index.provisionedThroughput) {
                index.provisionedThroughput = undefined;
            }
            return index;
        });
        resources.dynamoDBTable.globalSecondaryIndexes = newIndexes;
    }
}
exports.override = override;
