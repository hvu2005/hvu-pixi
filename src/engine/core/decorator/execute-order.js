


export function executeOrder(order = 0) {
    return function (target) {
        target.executeOrder = order;
    };
}