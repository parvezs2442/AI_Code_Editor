export const buildTree = (items) => {
  const map = {};
  const roots = [];

  // Convert mongoose documents to plain JavaScript objects if needed
  const plainItems = items.map((item) => {
    const obj = item.toObject ? item.toObject() : { ...item };
    if (obj.type === "folder") {
      obj.children = [];
    }
    return obj;
  });

  // Map each object by its string ID
  plainItems.forEach((item) => {
    map[item._id.toString()] = item;
  });

  // Assemble hierarchy
  plainItems.forEach((item) => {
    if (item.parentId && map[item.parentId.toString()]) {
      map[item.parentId.toString()].children.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
};
