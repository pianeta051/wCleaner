"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
function override(resources, _amplifyProjectInfo) {
    const customAttribute = {
        attributeDataType: "String",
        developerOnlyAttribute: false,
        mutable: true,
        name: "color",
        required: false,
    };
    const email = {
        mutable: true,
        name: "email",
        required: true,
    };
    resources.userPool.schema = [customAttribute, email];
}
exports.override = override;
