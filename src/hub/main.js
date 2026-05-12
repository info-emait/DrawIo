import "./hub.scss";
import * as sdk from "azure-devops-extension-sdk";
import { log, ready } from "@utils";

//#region [ Start ]

ready(async () => {
    log(`Running application in ${import.meta.env.PROD ? "PROD" : import.meta.env.DEV ? "DEV" : "UNKNOWN"} mode.`);
    
    sdk.init({                        
        loaded: false,
        applyTheme: true
    });
    log("Sdk is initializated.");

    await sdk.ready();
    log("Sdk is ready.");

    const model = { x: "test" };
    sdk.register("drawio-hub", function () {                
        return model;
    });
    log("Hub is registered.");

    // Start application and init application
    //ko.applyBindings(model, doc.body);
    sdk.notifyLoadSucceeded();
    //model.init().then(() => model.isLoading(false));
});

//#endregion