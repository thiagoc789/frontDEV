sap.ui.define([
	"sap/ui/core/mvc/Controller",

], function (Controller) {
	"use strict";

	return Controller.extend("sap.f.sample.GridListBasic.C", {

		onInit: function () {

		},

		onToggleView: function() {
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