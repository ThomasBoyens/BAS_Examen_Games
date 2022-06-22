/* eslint-disable no-console */
sap.ui.define([
    "./BaseController",
    'sap/ui/core/library',
    "../model/formatter"
], function (BaseController, coreLibrary, formatter) {
    "use strict";

    const ValueState = coreLibrary.ValueState;

    return BaseController.extend("be.ap.edu.zsdgamelist.controller.GameCreate", {

        formatter: formatter,


        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onSave: function () {
            const currentDate = new Date();
            const modifiedDate = currentDate.getFullYear()+ ("0"+(currentDate.getMonth()+1)).slice(-2) + ("0" + currentDate.getDate()).slice(-2);

            const oGame = {
              "Name" : this.getView().byId("name").getValue(),
              "Developer" : this.getView().byId("developer").getValue(),
              "Platform" : this.getView().byId("platform").getSelectedKey(),
              "Genre" : this.getView().byId("genre").getSelectedKey(),
              "ReleaseDate" : this.getView().byId("date").getValue(),
              "ModifiedBy": "DEVSD-000",
              "ModifiedOn": modifiedDate,
              "Description" : this.getView().byId("description").getValue()
            };
           
            this.getModel().create("/GameSet", oGame,
            {
                succes: function (oFeedback) { console.log(oFeedback);},
                error: function (oError) { console.error(oError);}
            });

            this.clearForm();
            this.getOwnerComponent().getRouter().navTo("list", { }, true);
            window.location.reload();
        },

        onCancel: function () {

            this.clearForm();
            this.getOwnerComponent().getRouter().navTo("list", { }, true);
        },

        clearForm: function () {
            this.getView().byId("name").setValue("");
            this.getView().byId("developer").setValue("");
            this.getView().byId("platform").setSelectedKey("");
            this.getView().byId("genre").setSelectedKey("");
            this.getView().byId("date").setValue("");
            this.getView().byId("description").setValue("");
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
            oRouter.navTo("gameCreate", {});
        },

        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */

        /**
        * Set the full screen mode to false and navigate to master page
        */
        onCloseDetailPress: function () {
            var oModel = this.getView().getModel("app");
            this.getOwnerComponent().getRouter().navTo("list", {}, true);
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