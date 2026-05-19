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

        this.isLoading = ko.isObservable(args.isLoading) ? args.isLoading : ko.observable(args.isLoading || false);
        this.isLess = ko.isObservable(args.isLess) ? args.isLess : ko.observable(args.isLess || false);
        this.user = ko.observable(sdk.getUser());
        this.canUseGit = ko.observable(null);
        this.repos = ko.observableArray([]);
        this.repoId = ko.observable(null);
        this.files = ko.observableArray([]);
        this.editFile = ko.observable(null);
        this.editFileName = ko.observable("");
        this.editFileContent = ko.observable(null);
        this.editFileIsDirty = ko.observable(false);

        this.onEditFile = ko.computed(this._onEditFile, this);
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
     * Downloads the file content for edit.
     */
    async _onEditFile () {
        const file = this.editFile();
        const repoId = this.repoId();
        
        if (!file || (file.url.indexOf(repoId) === -1)) {
            this.isLoading(false);
            this.editFile(null);
            this.editFileName("");
            this.editFileContent(null);
            this.editFileIsDirty(false);
            return;
        }

        this.isLoading(true);
        this.editFileName(file.path.split("/").pop());

        const uri = `/_apis/git/repositories/${repoId}/items`;
        const query = {
            "path": file.path,
            "$format": "octetStream"
        }
        const buffer = await devops.get(uri, query, "arrayBuffer");
        const contentType = file.path.endsWith(".svg") || file.path.endsWith(".drawio") ? "image/svg+xml" : "image/png";
        const blob = new Blob([buffer], { type : contentType });
        const reader = new FileReader();
        reader.onloadend = () => this.editFileContent(reader.result);
        reader.readAsDataURL(blob);
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
     * Creates commit with current user changes.
     */
    async commit () {
        const extension = sdk.getExtensionContext();
        const host = await sdk.getService(CommonServiceIds.HostPageLayoutService);
        const repoId = this.repoId();
        const repos = this.repos();

        host.openPanel(`${extension.id}.${extension.extensionId}-commit`, {
            title: "Commit",
            configuration: {
                file: this.editFile(),
                content: this.editFileContent(),
                repo: repos.find((r) => r.id === repoId)
            },
            onClose: (result) => {
                console.warn("Commit result: ", result);
            }
        });
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

        this.onEditFile.dispose();
    };

    //#endregion
}