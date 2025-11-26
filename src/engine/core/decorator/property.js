export function property(target, key) {
    if (!target.__serializedFields) {
        target.__serializedFields = [];
    }
    target.__serializedFields.push(key);
}