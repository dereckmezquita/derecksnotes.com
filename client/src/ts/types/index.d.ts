
export {};

declare global {
    interface Window {
        flexNav: Function;
        MathJax: Object;
    }
}

declare global {
    interface Navigator {
        standalone: boolean;
    }
}