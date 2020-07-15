import { beginWork } from 'reactReconciler/ReactFiberBeginWork';
import { createWorkInProgress } from './ReactFiber';
import {
    completeWork
} from './ReactFiberCompleteWork';
import {
    commitMutationEffects,
    commitBeforeMutationEffects
} from './ReactFiberCommitWork';

let workInProgress;

export function performSyncWorkOnRoot(root) {

    let pendingProps = null;
    workInProgress = createWorkInProgress(root.current, pendingProps);
    //递
    workLoopSync();
    root.finishedWork = root.current.alternate;
    //归
    commitRoot(root);
    return null
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
function performUnitOfWork(unitOfWork) {
    const current = unitOfWork.alternate;
    // beginWork会返回fiber.child，不存在next意味着深度优先遍历已经遍历到某个子树的最深层叶子节点

    let next = beginWork(current, unitOfWork);

    if (!next) {
        //生成DOM 返回 sibling 节点继续生成子节点Fiber
        next = completeUnitOfWork(unitOfWork);
    }
    return next;
}

// 由于一定是beginWork返回null才会执行completeUnitOfWork，而beginWork始终创建并返回fiber.child
// 所以传入的fiber一定是某个子树的叶子节点
// 返回节点的兄弟节点（如果存在），不存在兄弟节点时递归上一级
function completeUnitOfWork(unitOfWork) {
    workInProgress = unitOfWork;
    do {
        const current = workInProgress.alternate;
        const returnFiber = workInProgress.return;
        // if (!(workInProgress.effectTag & Incomplete)) {
        if (true) {
            // 该fiber未抛出错误

            // 当前总会返回null 为当前Fiber生成对应DOM
            let next = completeWork(current, workInProgress);

            if (next) {
                return next;
            }

           
            if (returnFiber) {
                // if (returnFiber && !(returnFiber.effectTag & Incomplete)) {
                // 将完成的fiber的 effect list append到父级fiber上
                // 这样一级级递归上去后，根节点会有一条本次update所有有effect的fiber的list
                // 在执行DOM操作时只需要遍历这条链表而不需要再递归一遍整个fiber树就能执行effect对应DOM操作
                if (!returnFiber.firstEffect) {
                    returnFiber.firstEffect = workInProgress.firstEffect;
                }
                if (workInProgress.lastEffect) {
                    if (returnFiber.lastEffect) {
                        returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
                    }
                    returnFiber.lastEffect = workInProgress.lastEffect;
                }
                const effectTag = workInProgress.effectTag;
                if (effectTag) {
                    // 如果当前fiber上存在effect，把他附在父fiber effect list的最后
                    if (returnFiber.lastEffect) {
                        // 父fiber list 已有effect
                        returnFiber.lastEffect.nextEffect = workInProgress;
                    } else {
                        returnFiber.firstEffect = workInProgress;
                    }
                    returnFiber.lastEffect = workInProgress;
                }
            }

            const sibling = workInProgress.sibling;
            if (sibling) {
                // 当前父fiber下处理完workInProgress，再去处理他的兄弟节点
                return sibling;
            }
            // 兄弟节点也处理完后，向上一级继续处理
            workInProgress = returnFiber;
        }
    } while (workInProgress)

    return null;
}



// commit阶段的入口，包括如下子阶段：
// before mutation阶段：遍历effect list，执行 DOM操作前触发的钩子
// mutation阶段：遍历effect list，执行effect
function commitRoot(root) {
    // TODO 根据scheduler优先级执行
    const finishedWork = root.finishedWork;
    if (!finishedWork) {
        return null;
    }
    root.finishedWork = null;

    let firstEffect;
    if (root.effectTag) {
        // 由于根节点的effect list不含有自身的effect，所以当根节点本身存在effect时需要将其append 入 effect list
        if (finishedWork.lastEffect) {
            finishedWork.lastEffect.nextEffect = finishedWork;
            firstEffect = finishedWork.firstEffect;
        } else {
            firstEffect = finishedWork;
        }
    } else {
        // 根节点本身没有effect
        firstEffect = finishedWork.firstEffect;
    }

    let nextEffect;
    if (firstEffect) {
        // before mutation阶段
        nextEffect = firstEffect;
        do {
            try {
                nextEffect = commitBeforeMutationEffects(nextEffect);
            } catch (e) {
                console.warn('commit before error', e);
                nextEffect = nextEffect.nextEffect;
            }
        } while (nextEffect)

        // mutation阶段
        nextEffect = firstEffect;
        do {
            try {
                nextEffect = commitMutationEffects(root, nextEffect);
            } catch (e) {
                console.warn('commit mutaion error', e);
                nextEffect = nextEffect.nextEffect;
            }
        } while (nextEffect)
    }
}