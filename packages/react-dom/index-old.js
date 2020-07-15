
let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null

function createDom(fiber) {
    const dom =
        fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type);

    const isProperty = key => key !== "children";
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name];
        });

    return dom;

}

const ReactDOM = {

    render: (element, container) => {
        // 创建根 fiber，设为下一次的单元任务
        nextUnitOfWork = {
            dom: container,
            props: {
                children: [element]
            }
        };
    }
}

// 一旦浏览器空闲，就触发执行单元任务
requestIdleCallback(workLoop);

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        //console.log('剩余执行任务的毫秒数: ',deadline.timeRemaining())
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber) {
    console.log('fiber',fiber)
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // 子节点 DOM 插到父节点之后
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);
    }

    // 每个子元素创建新的 fiber
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        };
        // 根据上面的图示，父节点只链接第一个子节点
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            // 兄节点链接弟节点
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
    // 返回下一个任务单元（fiber）
    // 有子节点直接返回
    if (fiber.child) {
        return fiber.child;
    }
    // 没有子节点则找兄弟节点，兄弟节点也没有找父节点的兄弟节点，
    // 循环遍历直至找到为止
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

export default ReactDOM;