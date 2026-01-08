

/**
 * 
 * @param {Component[]} components 
 * @returns 
 */
export function requireComponents(...components) {
    return function (TargetClass) {
        TargetClass.requiredComponents ??= [];
        TargetClass.requiredComponents.push(...components);
    };
}
