
export const EVENT_FILTER = 'filter-email-by-text'

export default  { on, emit }

function on(eventName, listener) {
    const callListener = ({ detail }) => {
        listener(detail);
    };
    window.addEventListener(eventName, callListener)
    return () => {
        window.removeEventListener(eventName, callListener);
    };
};

function emit(eventName, data) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};


