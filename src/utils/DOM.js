// From https://github.com/souporserious/get-node-dimensions/blob/master/src/get-clone-dimensions.js
export const cloneNode = (node, options) => {
  const { parentNode } = node;
  const context = document.createElement('div');
  const clone = node.cloneNode(true);

  // give the node some context to measure off of
  // no height and hidden overflow hide node copy
  context.style.height = 0;
  context.style.overflow = 'hidden';

  // clean up any attributes that might cause a conflict with the original node
  // i.e. inputs that should focus or submit data
  clone.setAttribute('id', '');
  clone.setAttribute('name', '');

  // set node height/width to match its parent
  clone.style.width = options.width;
  clone.style.height = options.height;

  // append copy to context
  context.appendChild(clone);

  // append context to DOM so we can measure
  parentNode.appendChild(context);

  const cleanUp = () => {
    parentNode.removeChild(context);
  };

  return {
    clone,
    cleanUp,
  };
};

export const forceRedraw = (node) => {
  const disp = node.style.display;
  node.style.display = 'none';
  const trick = node.offsetHeight; // eslint-disable-line
  node.style.display = disp;
};

export const isOverflowing = (node) => {
  const overflowX = node.scrollWidth > node.clientWidth;
  const overflowY = node.scrollHeight > node.clientHeight;

  return overflowX || overflowY;
};
