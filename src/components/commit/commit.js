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
    }

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Validates form before sending.
     */
    isValid () {
        this.commentError(!this.comment().length ? "Comment cannot be empty" : "");

        return !this.nameError().length
    }


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
    };

    //#endregion
}