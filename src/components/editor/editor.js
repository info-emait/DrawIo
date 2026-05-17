import { log, warn } from "@utils";
import * as ko from "knockout";

/**
 * View model for the Hub component.
 * 
 * https://www.drawio.com/doc/faq/embed-mode
 */
export class ViewModel {
    //#region [ Constructor ]

    /**
     * Constructor.
     * 
     * @param {object} args Input arguments.
     */
    constructor (args = {}) {
        log("Editor()", this);

        this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
        this.drawioUrl = ko.observable(import.meta.env.VITE_DRAWIO_URL);
        this.isVisible = ko.isObservable(args.isVisible) ? args.isVisible : ko.observable(args.isVisible || false);

        window.addEventListener("message", this.onMessage);
    }

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Event handler for the message event.
     * 
     * @param {object} e Arguments.
     */
    onMessage (e) {
        if ((typeof(e.data) !== "string") || !e.data.length) {
            return;
        }

        try {
            const msg = JSON.parse(e.data);
            log(`Editor : Received message '${JSON.stringify(msg)}'.`);
            const fnc = this[msg.event];
            
            if (typeof(msg.event) === "undefined") {
                return;
            }

            if (typeof(fnc) === "function") {
                fnc.apply(this, [msg.data]);
                return;
            }

            warn(`Editor : Unsupported event '${msg.event}'.`);
        }
        catch (err) {
            warn("Editor : Error while receiving message", err);
        }
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
        log("~Editor()");
    };

    //#endregion
}