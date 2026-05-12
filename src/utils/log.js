/**
 * Logs input message to the console.
 * 
 * @param {string} msg Message to be logged in the console.
 * @param {object} args Message arguments.
 */
export function log(msg, ...args) {
    console.debug(`[log] ${msg}`, ...args);
}