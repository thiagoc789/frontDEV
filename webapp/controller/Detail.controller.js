sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Detail", {
        onInit: function () {

        },

        loadEmployeeData: function() {
            var oComponent = this.getOwnerComponent();
            var employeeId = oComponent.getModel("appView").getProperty("/selectedEmployeeId");
        
            var oDataModel = this.getOwnerComponent().getModel();
        
            oDataModel.read("/Empleado(" + employeeId + ")", {
                success: function(oData, response) {
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oEmployeeModel, "employee");
                }.bind(this),
                error: function(oError) {
                    console.error("Error al obtener los datos del empleado: ", oError);
                }
            });
        },
        
        onBack: function() {
            var oNavContainer = this.getView().getParent().getParent();
            oNavContainer.back();
        },
        
    });
});

