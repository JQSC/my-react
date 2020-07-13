export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export function createUpdate(expirationTime) {
    return {
        expirationTime,
        tag: UpdateState,
        payload: null,
        callback: null,
        next: null,
        nextEffect: null,
    };
}


// 将update插入单向环状链表
// 插入 u0 形成 u0 - u0  当前pending: uo
// 插入 u1 形成 u1 - u0 - u1  当前pending: u1
// 插入 u2 形成 u2 - u0 - u1 - u2  当前pending: u2
// 插入 u3 形成 u3 - u0 - u1 - u2 -u3  当前pending: u3
// 故 shared.pending 为 lastPendingUpdate
// shared.pending.next 为 firstPendingUpdate
export function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue;
    if (!updateQueue) {
        // fiber已经unmount
        return;
    }

    const sharedQueue = updateQueue.shared;
    const pending = sharedQueue.pending;
    // 使新插入的update始终位于单向环状链表首位
    if (!pending) {
        // 这是第一个update，使他形成单向环状链表
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    sharedQueue.pending = update;
}