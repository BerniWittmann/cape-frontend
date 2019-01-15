function getRoots(state) {
  return state.contextFactors.filter(cF => !cF.parentID)
}

function getChildren(state, node) {
  return state.contextFactors.filter(cF => cF.parentID === node.id)
}

function constructChildren(state, node) {
  return getChildren(state, node).map(child => ({
    label: child.name,
    contextFactor: child,
    children: constructChildren(state, child)
  }))
}

export default {
  contextFactorsTree(state) {
    return getRoots(state).map(root => ({
      contextFactor: root,
      label: root.name,
      children: constructChildren(state, root)
    }))
  }
}
