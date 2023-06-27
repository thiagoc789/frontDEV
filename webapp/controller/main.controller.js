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
            
            // Contrae el menú lateral por defecto
            this.byId("toolPage").setSideExpanded(false);
        },

        onAfterRendering: function () {
            // Añade los controladores de eventos para los eventos de mouseover y mouseout
            var oSideNavigation = this.byId("_IDGenSideNavigation1");
            oSideNavigation.$().on("mouseover", this._expandSideNav.bind(this));
            oSideNavigation.$().on("mouseout", this._setCollapseTimeout.bind(this));
        },

        _expandSideNav: function () {
            // Cancela la contracción del menú si el cursor vuelve a entrar en él
            clearTimeout(this._collapseTimeout);
            // Expande el menú lateral
            this.byId("toolPage").setSideExpanded(true);
        },

        _setCollapseTimeout: function () {
            // Contrae el menú lateral después de una demora
            this._collapseTimeout = setTimeout(this._collapseSideNav.bind(this), 500);
        },

        _collapseSideNav: function () {
            // Contrae el menú lateral
            this.byId("toolPage").setSideExpanded(false);
        },

        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
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


