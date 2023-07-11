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
		
			var oComponent = this.getOwnerComponent();
			oComponent.getModel("appView").setProperty("/selectedEmployeeId", employeeId);
		
			var oNavContainer = this.getView().getParent().getParent(); // Obtén el NavContainer desde la vista padre
		
			oNavContainer.attachAfterNavigate(function(oEvent) {
				var oDetailPage = oEvent.getParameters().to;
				var oDetailView = oDetailPage.getContent()[0];
				var oDetailController = oDetailView.getController();
		
				oDetailController.loadEmployeeData();
			});
		
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