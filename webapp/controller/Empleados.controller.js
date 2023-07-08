sap.ui.define([
	"sap/ui/core/mvc/Controller",

], function (Controller) {
	"use strict";

	return Controller.extend("evaluatorweb.controller.Empleados", {

		onInit: function () {

		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var employeeId = oItem.getBindingContext().getProperty("SAP_Number");
		
			// Obtén el componente de la aplicación.
			var oComponent = this.getOwnerComponent();
		
			// Almacena el employeeId en el modelo del componente.
			oComponent.getModel("appView").setProperty("/selectedEmployeeId", employeeId);
		
			var oMainView = sap.ui.getCore().getModel("global").getProperty("/mainView");
			var oNavContainer = oMainView.byId("pageContainer");
			oNavContainer.to("application-evaluatorweb-display-component---main--Detalle_Empleado");
		},
		
		
		
		
		



		onToggleView: function () {
			var oGridList = this.getView().byId("gridList");
			var oSmartTable = this.getView().byId("_IDGenVBox5");
			var oButton = this.getView().byId("btnToggle");

			if (oGridList.getVisible()) {
				oGridList.setVisible(false);
				oSmartTable.setVisible(true);
			} else {
				oGridList.setVisible(true);
				oSmartTable.setVisible(false);
			}
		}


	});
});