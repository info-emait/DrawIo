import * as sdk from "azure-devops-extension-sdk";
import { CommonServiceIds } from "azure-devops-extension-api";
import { log } from "@utils";
import * as devops from "@utils/devops";
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

        
        devops.get("/_apis/git/Repositories", {
            includeLinks: false,
            includeAllUrls: false,
            includeHidden: true
        }).then((response) => response.ok ? response.json() : null)
        .then((xxx) => console.warn("xxx: ", xxx));
    }

    //#endregion

    
    //#region [ Methods : Public ]

    /**
     * Switch between fullscreen and normal screen.
     */
    async fullscreen () {
        this.isFullScreen(!this.isFullScreen());
        
        const host = await sdk.getService(CommonServiceIds.HostNavigationService);

        const query = await host.getQueryParams();
        query.fullScreen = this.isFullScreen();
        
        const ctx = await devops.context();

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