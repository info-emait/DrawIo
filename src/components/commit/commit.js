import { log } from "@utils";
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
        log("Commit()", this);

        this.dialog = args.dialog;
        this.file = args.file;
        this.content = args.content;
        this.repo = args.repo;

        this.comment = ko.observable(`Updated ${this.file.path.split("/").pop()}`);
        this.commentError = ko.observable("");

        this.branch = ko.observable(this.repo.defaultBranch.split("/").pop());
        this.branchError = ko.observable("");

        this.isValid = ko.computed(() => {
            const comment = this.comment() || "";
            const branch = this.branch() || "";
            
            this.commentError(!comment.length ? "Comment cannot be empty." : "");
            this.branchError(!branch.length ? "The branch name cannot be empty." : "");

            return !this.commentError().length && !this.branchError().length;
        });
    }

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Cancels commit.
     */
    cancel () {
        this.dialog.close(false);
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
        log("~Commit()");

        this.isValid.dispose();
    };

    //#endregion
}