const REACT_ELEMENT_TYPE = 'REACT';

export function createElement(type, props, ...children) {
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            )
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        }
    }
}