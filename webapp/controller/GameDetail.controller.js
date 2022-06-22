sap.ui.define([
    "./BaseController",
    'sap/ui/core/library',
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "../model/formatter",
    "sap/m/library"
], function (BaseController, coreLibrary, JSONModel, formatter, Device, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;
    const ValueState = coreLibrary.ValueState;

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

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onSave: function (oEvent){
            const currentDate = new Date();
            const modifiedDate = currentDate.getFullYear()+ ("0"+(currentDate.getMonth()+1)).slice(-2) + ("0" + currentDate.getDate()).slice(-2);

            const oGame = this.getOwnerComponent()._game;

            oGame.ModifiedOn = modifiedDate;
            
            this.getModel().update(`/GameSet(guid'${oGame.Id}')`, oGame,
            {
                succes: function (oFeedback) { console.log(oFeedback);},
                error: function (oError) { console.error(oError);}
                });
        },

        onCancel: function () {
            this.onCloseDetailPress();
        },

        onDelete: function () {
            const oGame = this.getOwnerComponent()._game;

            oGame.Deleted = true;
            this.getModel().update(`/GameSet(guid'${oGame.Id}')`, oGame,
            {
                succes: function (oFeedback) { console.log(oFeedback);},
                error: function (oError) { console.error(oError);}
                });
                window.location.reload();
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

        handleLiveChange: function (oEvent) {
			var oTextArea = oEvent.getSource(),
				iValueLength = oTextArea.getValue().length,
				iMaxLength = oTextArea.getMaxLength(),
				sState = iValueLength > iMaxLength ? ValueState.Warning : ValueState.None;

			oTextArea.setValueState(sState);
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
            this.currentDetail = this.getOwnerComponent()._game;
            
            
            this.getModel('json').setData(this.getOwnerComponent()._game);
            if (!this.getOwnerComponent()._game || !this.getOwnerComponent()._game.Id || sGameObjectId !== this.getOwnerComponent()._game.Id) {
                this.getRouter().navTo('list', {}, true);
            }
        },

        /**
        * Set the full screen mode to false and navigate to previous page
        */
       onCloseDetailPress: function () {
        const platformId = this.getOwnerComponent()._game.Platform;
        this.getOwnerComponent().getRouter().navTo("object", {
            objectId : platformId
         }, true);
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
        }

        
    });

});