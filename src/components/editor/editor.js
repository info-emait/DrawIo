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

        this.renderer = null;
        this.classes = ko.isObservable(args.classes) ? args.classes : ko.observable(args.classes || "");
        this.drawioUrl = ko.observable(import.meta.env.VITE_DRAWIO_URL);
        this.isInitialized = ko.observable(false);

        window.addEventListener("message", this.onMessage.bind(this));
    }

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Event handler for the init event.
     */
    onInit () {
        this.isInitialized(true);
    }


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
            
            if (typeof(msg.event) === "undefined") {
                return;
            }

            const fncKey = "on" + msg.event.charAt(0).toUpperCase() + msg.event.slice(1);
            const fnc = this[fncKey];

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

        this.renderer = root.querySelector(".editor__renderer")?.contentWindow;
    }


    /**
     * Dispose.
     */
    dispose () {
        log("~Editor()");
    };

    //#endregion
}