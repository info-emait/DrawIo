import * as sdk from "azure-devops-extension-sdk";
import * as api from "azure-devops-extension-api";
import { log, getDevOpsContext } from "@utils";
import ko from "@tko/build.reference";

/**
 * View model for the Hub component.
 */
export class ViewModel {
    //#region [ Constructor ]

    /**
     * Constructor.
     * 
     * @param {object} args Input arguments.
     */
    constructor (args = {}) {
        log("Hub()", this);
        
        this.title = ko.observable(args.title || "");
        this.isFullScreen = ko.observable(args.isFullScreen);
    }

    //#endregion

    
    //#region [ Methods : Public ]

    /**
     * Switch between fullscreen and normal screen.
     */
    async fullscreen () {
        this.isFullScreen(!this.isFullScreen());

        const host = await sdk.getService(api.CommonServiceIds.HostNavigationService);

        const query = await host.getQueryParams();
        query.fullScreen = this.isFullScreen();
        
        const ctx = await getDevOpsContext();

        const uri = `${ctx.baseUrl}/${ctx.collection.name}/${ctx.project.name}/_apps/hub/${ctx.extension.id}.${ctx.extension.extensionId}-hub?${new URLSearchParams(query).toString()}`;
        host.navigate(uri);
    }    


    /**
     * Direct method to receive a descendantsComplete notification.
     * Knockout will call it with the component’s node once all descendants are bound.
     * 
     * @param {element} node Html element. 
     */
    koDescendantsComplete (node) {
        const root = node.firstElementChild;
        node.replaceWith(root);
    }


    /**
     * Dispose.
     */
    dispose () {
        log("~Hub()");
    };

    //#endregion
}