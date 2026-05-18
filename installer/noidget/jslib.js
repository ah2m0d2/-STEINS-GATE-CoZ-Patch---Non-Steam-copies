/**
 * Script-side utility library
 * @namespace
 * @toplevel
 */
var nglib = {};

/**
 * Abstract base class for custom pages, wrapping {@link ng.view.Page}. Used for
 * the ability to use `this` in `onNext` / `onBack`.
 * @class
 * @abstract
 * @param {string} pageTitle
 * @toplevel
 */
nglib.PageController = function(pageTitle) {
    var o = this;
    this.view = ng.window.createPage(pageTitle);
    this.view.onNext = function() {
        if ('onNext' in o) return o.onNext();
    };
    this.view.onBack = function() {
        if ('onBack' in o) return o.onBack();
    };
};
/**
 * Push underlying page onto wizard stack.
 */
nglib.PageController.prototype.push = function() {
    ng.window.pushPage(this.view);
};
/**
 * Wrapper for {@link ng.view.Page#onNext}. Override this in subclasses.
 * @method onNext
 * @memberof nglib.PageController
 * @instance
 * @abstract
 */
/**
 * Wrapper for {@link ng.view.Page#onBack}. Override this in subclasses.
 * @method onBack
 * @memberof nglib.PageController
 * @instance
 * @abstract
 */

/**
 * Are we running in Steam Play? (Proton, Steam's Linux Wine wrapper)
 */
nglib.isSteamPlay = function() {
    if (!ng.systemInfo.isWine()) return false;
    return ng.systemInfo.getEnv('HOMEPATH').indexOf('steamuser') !== -1;
}