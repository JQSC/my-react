import { createElement } from './ReactElement';
import ReactCurrentDispatcher from './ReactCurrentDispatcher';

const React = {
    createElement,
    // 用于保存内部使用的一些变量，方便在模块间引用
    internals: {
        ReactCurrentDispatcher
    },
}

export default React;