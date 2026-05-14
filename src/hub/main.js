import * as sdk from "azure-devops-extension-sdk";
import { CommonServiceIds } from "azure-devops-extension-api";
import ko from "@tko/build.reference";
import { log, ready } from "@utils";
import "./main.scss";
import "@components/hub/component.js";

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

    const host = await sdk.getService(CommonServiceIds.HostNavigationService);
    const query = await host.getQueryParams();

    // Create application model
    const model = {
        title: import.meta.env.VITE_APP_TITLE,
        isFullScreen: (query["fullScreen"] === "true") ? true : false
    };
    
    sdk.register("drawio-hub", () => model);
    log("Hub is registered.");

    // Start application and init application
    ko.applyBindings(model, document.body);
    sdk.notifyLoadSucceeded();
});

//#endregion