import * as sdk from "azure-devops-extension-sdk";
import { CommonServiceIds } from "azure-devops-extension-api";
import { log } from "@utils";
import * as devops from "@utils/devops";
import * as ko from "knockout";

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

        this.user = ko.observable(sdk.getUser());
        this.canUseGit = ko.observable(null);
        this.repos = ko.observableArray([]);
        this.repoId = ko.observable(null);
        this.files = ko.observableArray([]);

        this.loadFiles = ko.computed(this._loadFiles, this);
    }

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Checks whether the current user can use git.
     */
    async _init () {
        const canUseGit = await devops.canUseGit();
        this.canUseGit(canUseGit);

        if (!canUseGit) {
            return;
        }

        this._loadRepos();
    }


    /**
     * Loads list of project repositories.
     */
    async _loadRepos () {
        const response = await devops.get("/_apis/git/repositories", { includeHidden: true });

        this.repos(response?.value || []);
    }


    /**
     * Loads list of files for the selected repository.
     * 
     * @param {object} parent Parent node.
     */
    async _loadFiles (parent) {
        const repoId = this.repoId();

        if (ko.computedContext.isInitial() || !repoId) {
            this.files([]);
            return;
        }

        const response = await devops.get(`/_apis/git/repositories/${repoId}/items`, { 
            "scopePath": "/",
            "$format": "json",
            "recursionLevel": "oneLevel"
        });
        const files = (response?.value || [])
            .filter((f) => {
                return f.path !== "/";
            })
            .sort((f1, f2) => ((f2.isFolder || false) - (f1.isFolder || false)) || f1.path.localeCompare(f2.path))
            .map((f) => {
                f.isExpanded = ko.observable(false);
                if (f.isFolder) {
                    f.files = ko.observableArray([]);
                }
                return f;
            });

        if (parent && parent.files) {
            parent.files(files);
            return;
        }

        this.files(files);
    }

    //#endregion

    
    //#region [ Methods : Public ]

    /**
     * Switch between fullscreen and normal screen.
     */
    async fullscreen () {
        const host = await sdk.getService(CommonServiceIds.HostNavigationService);

        const query = await host.getQueryParams();
        query.fullScreen = !this.isFullScreen();
        
        const ctx = await devops.context();
        host.navigate(`${ctx.baseUrl}/${ctx.collection.name}/${ctx.project.name}/_apps/hub/${ctx.extension.id}.${ctx.extension.extensionId}-hub?${new URLSearchParams(query).toString()}`);
        this.isFullScreen(!this.isFullScreen());
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

        this._init();
    }


    /**
     * Dispose.
     */
    dispose () {
        log("~Hub()");

        this.loadFiles.dispose();
    };

    //#endregion
}