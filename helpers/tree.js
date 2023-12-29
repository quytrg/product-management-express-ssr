let index = 0

function createTree(arr, parentId="") {
    const tree = []
    
    arr.forEach(element => {
        if (element.parent_id == parentId) {
            
            const newItem = element
            index++
            newItem.index = index

            const children = createTree(arr, element._id)
            if (children.length > 0) {
                newItem.children = children
            }

            tree.push(newItem)
        }    
    });

    return tree
}

module.exports.create = (arr, parentId="") => {
    index = 0
    return createTree(arr, parentId)
}
