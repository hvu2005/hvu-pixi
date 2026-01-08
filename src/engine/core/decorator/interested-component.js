

/**
 * 
 * @param {Component} component 
 * @returns 
 */
export function interestedComponent(component) {
    return function (TargetClass) {
        TargetClass.interestedComponents ??= [];
        TargetClass.interestedComponents.push(component);
    };
}