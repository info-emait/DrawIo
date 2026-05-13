import * as sdk from "azure-devops-extension-sdk";
import * as api from "azure-devops-extension-api";

//#region [ Methods : Private ]

/**
 * Gets the base url.
 * 
 * @returns Base url.
 */
function _getBaseUrl() {
    try {
        if (document.referrer) {
            const refUrl = new URL(document.referrer);
            return refUrl.protocol + "//" + refUrl.host;
        }
    } 
    catch (e) {
    }

    try {
        const url = new URL(window.location.href);
        return url.protocol + "//" + url.host;
    }
    catch (e) {
    }

    return "";
}

//#endregion


/**
 * Gets DevOps context.
 * 
 * @returns Object representing DevOps context.
 */
export async function getDevOpsContext() {
    const baseUrl = _getBaseUrl();

    const page = await sdk.getService(api.CommonServiceIds.ProjectPageService);
    const project = await page.getProject();
    const collection = sdk.getHost? sdk.getHost() : null;
    const extension = sdk.getExtensionContext();

    return {
        baseUrl: baseUrl,
        isCloud: (baseUrl.indexOf("dev.azure.com") !== -1) || (baseUrl.indexOf("visualstudio.com") !== -1),
        project,
        collection,
        extension
    };
}