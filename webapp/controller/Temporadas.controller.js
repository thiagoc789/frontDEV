sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Temporadas", {
        onInit: function () {
            // Obtener el modelo OData V2 desde el manifest.
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "odataModel");
        }
    });
});

 
