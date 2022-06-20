/* eslint-disable no-console */
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/m/GroupHeaderListItem",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "../model/formatter"
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
    "use strict";

    return BaseController.extend("be.ap.edu.zsdgamelist.controller.GameCreate", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the list controller is instantiated. It sets up the event handling for the list/detail communication and other lifecycle tasks.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                isFilterBarVisible: true,
                filterBarLabel: "",
                busy: false,
                delay: 0
            });

            this.getRouter().getRoute("gameCreate");

            this.setModel(oViewModel, "gameCreateView");

            const oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, 'json');
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onSave: function (){

            console.log();
            
            // this.getModel().create("/GameSet", oGame,
            // {
            //     succes: function (oFeedback) { console.log(oFeedback);},
            //     error: function (oError) { console.error(oError);}
            //     });
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

        onPressAddGame: function () {
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("gameCreate", {} );
        },

        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */

        /**
        * Set the full screen mode to false and navigate to master page
        */
       onCloseDetailPress: function () {
        var oModel = this.getView().getModel("app");
        this.getOwnerComponent().getRouter().navTo("list", { }, true);
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