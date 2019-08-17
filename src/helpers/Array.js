import { filter, isEmpty, each } from 'lodash';

export function first_array(array) {
    return array[Object.keys(array)[0]];
}
export function unflatten(array, parent_source, tree_source) {
    let tree = tree_source;
    let parent = parent_source;
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { code: 0 };
    // eslint-disable-next-line eqeqeq
    const children = filter(array, (child) => child.parent == parent.code);
    if (!isEmpty(children)) {
        if (isEmpty(parent.code)) { //parent hoặc code
            tree = children;
        } else {
            parent.children = children;
        }
        each(children, (child) => unflatten(array, child));
    }
    return tree;
}
