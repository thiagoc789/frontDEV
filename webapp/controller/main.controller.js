sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Popover"
], function (Controller, Popover) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.main", {
        onInit: function () {
            var data = this.getOwnerComponent().getModel("data_model");
            this.getView().setModel(data, "data");
            this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
        },

        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
            this._toggleSideNavExpanded();
        },

        onSideNavButtonPress: function () {
            this._toggleSideNavExpanded();
        },

        _toggleSideNavExpanded: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();

            this._setToggleButtonTooltip(!bSideExpanded);

            oToolPage.setSideExpanded(!bSideExpanded);
        },

        _setToggleButtonTooltip: function (bLarge) {
            var oToggleButton = this.byId("sideNavigationToggleButton");
            if (oToggleButton) {
                if (bLarge) {
                    oToggleButton.setTooltip("Expandir navegación");
                } else {
                    oToggleButton.setTooltip("Colapsar navegación");
                }
            }
        },
        
    });
});


