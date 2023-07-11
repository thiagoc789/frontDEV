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
            
                // Suponiendo que tienes un modelo OData llamado "odataModel"
                var oDataModel = this.getOwnerComponent().getModel();
            
                // Realiza una solicitud para obtener los datos del empleado
                oDataModel.read("/Empleado("+employeeId+")", {
                    success: function(oData, response) {
                        // Cuando los datos se recuperan con éxito, crea un nuevo JSONModel con estos datos
                        var oEmployeeModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(oEmployeeModel, "employee");
                    }.bind(this),
                    error: function(oError) {
                        // Maneja cualquier error que pueda ocurrir
                        console.error("Error al obtener los datos del empleado: ", oError);
                    }
                });
            },
            

            onBack: function() {
                var oMainView = sap.ui.getCore().getModel("global").getProperty("/mainView");
                var oNavContainer = oMainView.byId("pageContainer");
                oNavContainer.back();
            }
        });
    }
);
