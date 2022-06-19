sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("be.ap.edu.zsdgamelist.controller.GameDetail", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                isFilterBarVisible: true,
                filterBarLabel: "",
                busy: false,
                delay: 0
            });

            this.getRouter().getRoute("gameObject").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "gameDetailView");

            // this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            const oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, 'json');
        },

        /**
         * Event handler for the bypassed event, which is fired when no routing pattern matched.
         * If there was an object selected in the list, that selection is removed.
         * @public
         */
        onBypassed: function () {
            this._oList.removeSelections(true);
        },

        /**
         * Event handler for navigating back.
         * We navigate back in the browser history
         * @public
         */
        onNavBack: function () {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */


        /**
         * Binds the view to the object path and expands the aggregated line items.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            // var sObjectId =  oEvent.getParameter("arguments").objectId;
            const sGameObjectId = oEvent.getParameter("arguments").gameObjectId;
            this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");

            console.log(this.getOwnerComponent()._game);
            
            this.getModel('json').setData(this.getOwnerComponent()._game);
            if (!this.getOwnerComponent()._game || !this.getOwnerComponent()._game.Id || sGameObjectId !== this.getOwnerComponent()._game.Id) {
                this.getRouter().navTo('list', {}, true);
            }
        },

        /**
        * Set the full screen mode to false and navigate to master page
        */
       onCloseDetailPress: function () {
        var oModel = this.getView().getModel("app");
        this.getOwnerComponent().getRouter().navTo("object", { }, true);
    },

        /**
         * Toggle between full and non full screen mode.
         */
        toggleFullScreen: function () {
            var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");
            this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", !bFullScreen);
            if (!bFullScreen) {
                // store current layout and go full screen
                this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
                this.getModel("appView").setProperty("/layout", "EndColumnFullScreen");
            } else {
                // reset to previous layout
                this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
            }
        },

        /* =========================================================== */
        /* begin: edit methods                                     */
        /* =========================================================== */

        
    });

});