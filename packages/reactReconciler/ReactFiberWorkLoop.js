export function performSyncWorkOnRoot(root) {

    //递
    workLoopSync();
    root.finishedWork = root.current.alternate;
    //归
    commit(root);
}


// 对于已经过期的任务，不需要考虑任务是否需要中断
function workLoopSync() {
    while (workInProgress) {
        workInProgress = performUnitOfWork(workInProgress);
    }
}

/*
生成FIber节点
特点：
    与平台无关
    能够描述节点行为
    节点粒度要细，这样可以很容易的中断开始
*/
function performUintOfWork(unitOfWork) {
    const current = unitOfWork.alternate;
    // beginWork会返回fiber.child，不存在next意味着深度优先遍历已经遍历到某个子树的最深层叶子节点
    let next = beginWork(current, unitOfWork);
    if (!next) {
        next = completeUnitOfWork(unitOfWork);
    }
}


//渲染Dom
function commit() { }