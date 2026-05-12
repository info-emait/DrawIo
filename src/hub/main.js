import * as sdk from "azure-devops-extension-sdk";
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

ready(async () => {
    if (import.meta.env.DEV) {
        log("Running application in DEV mode");
    }

    if (import.meta.env.PROD) {
        log("Running application in PROD mode");
    }    
    
    sdk.init({                        
        loaded: false,
        applyTheme: true
    });
    log("SDK initializated");

    await sdk.ready();
    log("SDK ready");

    // Register hub
    const model = { x: "test" };
    sdk.register("drawio-hub", function () {                
        return model;
    });

    // Start application and init application
    //ko.applyBindings(model, doc.body);
    sdk.notifyLoadSucceeded();
    //model.init().then(() => model.isLoading(false));
});

//#endregion