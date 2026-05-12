import { log } from "@utils";  

//#region [ Fields ]

const doc = document;

//#endregion


//#region [ Methods ]

/**
 * Fires function when DOM is ready.
 *
 * @param {function} fn Function.
 */
const ready = (fn) => {
    if (doc.attachEvent ? (doc.readyState === "complete") : (doc.readyState !== "loading")) {
        fn();
        return;
    }
    
    doc.addEventListener("DOMContentLoaded", fn);
};

//#endregion


//#region [ Start ]

ready(() => {
    if (import.meta.env.DEV) {
        log("Running application in DEV mode");
    }

    if (import.meta.env.PROD) {
        log("Running application in PROD mode");
    }    
    
    const title = import.meta.env.VITE_APP_TITLE;

    log(`${title}`);
});

//#endregion