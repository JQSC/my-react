import { createUpdate, enqueueUpdate ,initializeUpdateQueue} from 'reactReconciler/ReactUpdateQueue';
import { FiberNode } from 'reactReconciler/ReactFiber';
import { performSyncWorkOnRoot } from 'reactReconciler/ReactFiberWorkLoop';
import { HostRoot } from 'shared/ReactWorkTags';

function ReactRoot(container) {
    // RootFiber tag === 3
    this.current = new FiberNode(HostRoot);
    // 初始化rootFiber的updateQueue
    initializeUpdateQueue(this.current);
    // RootFiber指向FiberRoot
    this.current.stateNode = this;
    // 应用挂载的根DOM节点
    this.containerInfo = container;
}

ReactRoot.prototype.render = function (element) {
    const current = this.current;
    //const expirationTime = DOMRenderer.requestCurrentTimeForUpdate();
    // var expirationTime = computeExpirationForFiber(currentTime, current$$1);
    const update = createUpdate(1);
    // fiber.tag为HostRoot类型，payload为对应要渲染的ReactComponents
    update.payload = { element };
    enqueueUpdate(current, update);
    return performSyncWorkOnRoot(this);

};

export default ReactRoot