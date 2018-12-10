export function AddTreePropValue(treeArray: any [], prop: string, value: any, leafProp = 'children') {
    const addFunc = (array, p, v, lf) => {
        array.forEach(node => {
            node[p] = v;
            if (node[lf] && node[lf].length) {
                addFunc(node[lf], p, v, lf);
            }
        });
    };
    addFunc(treeArray, prop, value, leafProp);
    return treeArray;
}

export function MarkTreeBaseOnSelected(
    treeArray: any [],
    prop: string,
    trueValue: any,
    falseValue: any,
    uniqueKey: string,
    selected: any[],
    leafProp = 'children') {
    treeArray.forEach(treeNode => {
        if (selected.filter(selectedNode => selectedNode[uniqueKey] === treeNode[uniqueKey])[0]) {
            treeNode[prop] = trueValue;
        } else {
            treeNode[prop] = falseValue;
        }
        if (treeNode[leafProp] && treeNode[leafProp].length) {
            MarkTreeBaseOnSelected(treeNode[leafProp], prop, trueValue, falseValue, uniqueKey, selected, leafProp);
        }
    });
    return treeArray;
}
