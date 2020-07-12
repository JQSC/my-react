function ReactRoot(
    container,
    isConcurrent,
    hydrate,
) {
    //createFiberRoot
    const root = DOMRenderer.createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
}
ReactRoot.prototype.render = function (
    children,
    callback,
) {
    const root = this._internalRoot;
    const work = new ReactWork();
    callback = callback === undefined ? null : callback;
    if (__DEV__) {
        warnOnInvalidCallback(callback, 'render');
    }
    if (callback !== null) {
        work.then(callback);
    }
    DOMRenderer.updateContainer(children, root, null, work._onCommit);
    return work;
};