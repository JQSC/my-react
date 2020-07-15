import ReactRoot from './ReactRoot';

const ReactDOM = {
    render: (element, container) => {
        
        const root = container._reactRootContainer = new ReactRoot(container);

        root.render(element);

    }
}

export default ReactDOM