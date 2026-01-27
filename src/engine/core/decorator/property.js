
export function property(type) {
    return function (target, key) {
        const ctor = target.constructor;

        if (!ctor.__properties__) {
            ctor.__properties__ = {};
        }

        ctor.__properties__[key] = {
            type: type,
            name: key,
        };
    };
}
