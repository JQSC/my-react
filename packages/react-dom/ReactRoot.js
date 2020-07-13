import { createUpdate, enqueueUpdate } from 'reactReconciler/ReactUpdateQueue';
import { FiberNode } from 'reactReconciler/ReactFiber';
import { performSyncWorkOnRoot } from 'reactReconciler/ReactFiberWorkLoop';

function ReactRoot(
    container
) {
    // RootFiber tag === 3
    this.current = new FiberNode(3);
    // RootFiber指向FiberRoot
    this.current.stateNode = this;
    // 应用挂载的根DOM节点
    this.containerInfo = container;
}
ReactRoot.prototype.render = function (
    children
) {
    const current = this.current;
    //const expirationTime = DOMRenderer.requestCurrentTimeForUpdate();
    // var expirationTime = computeExpirationForFiber(currentTime, current$$1);
    const update = createUpdate(1);
    // fiber.tag为HostRoot类型，payload为对应要渲染的ReactComponents
    update.payload = { children };
    enqueueUpdate(current, update);
    return performSyncWorkOnRoot(this);

};