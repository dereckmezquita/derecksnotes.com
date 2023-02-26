export {};

declare global {
    interface Window {
        flexNav: Function;
        MathJax: Object;
    }

    interface Navigator {
        standalone: boolean;
    }
}