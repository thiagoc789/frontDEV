sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
        "use strict";

        return Controller.extend("evaluatorweb.controller.Detail", {
            onInit: function () {

            },

            onAfterRendering: function () {
                // Recupera el employeeId desde los datos personalizados de la página.
                var oComponent = this.getOwnerComponent();
                var employeeId = oComponent.getModel("appView").getProperty("/selectedEmployeeId");
                console.log(employeeId);
            }
        });
    }
);
