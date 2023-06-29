sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], function(Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Evaluaciones", {
        formatter: {
            weightInPercentage: function(sWeight) {
                if (!sWeight) {
                    return "0%";
                }
                return parseFloat(sWeight * 100).toFixed(0) + "%";
            }
        },
        onInit: function() {
            var oButton = this.getView().byId("buttonCancel"); // reemplace "myButtonId" con el id real de tu botón
            oButton.attachPress(this.onCrearEvaluacionDialogClose.bind(this));

            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // obtener la referencia de SmartTable
            var oTable = oSmartTable.getTable(); // obtener la referencia de la tabla interna

            
        },

        onOpenCreateDialog: function () {

            var oDialog = this.byId("crearEvaluacionDialog");
            oDialog.open();
        },


        onCrearEvaluacionDialogClose: function () {
            this.getView().byId("inputId").setValue("");
            this.getView().byId("inputName").setValue("");
            this.getView().byId("inputDescription").setValue("");
            this.getView().byId("inputWeight").setValue("")
            var oDialog = this.getView().byId("crearEvaluacionDialog");
            oDialog.close();
        },

        onSubmit: function () {
            var oModel = this.getView().getModel()
            var oNewEntry = {};
            oNewEntry.id = this.getView().byId("inputId").getValue();
            oNewEntry.name = this.getView().byId("inputName").getValue();
            oNewEntry.description = this.getView().byId("inputDescription").getValue();
            var sWeight = this.getView().byId("inputWeight").getValue();
    oNewEntry.weight = sWeight ? parseFloat(sWeight) / 100 : 0;

            oModel.create("/Evaluation", oNewEntry, {
                success: function () {
                    sap.m.MessageToast.show("Evaluacion con éxito");
                    var oDialog = this.getView().byId("crearEvaluacionDialog");
                    this.getView().byId("inputId").setValue("");
                    this.getView().byId("inputName").setValue("");
                    this.getView().byId("inputDescription").setValue("");
                    this.getView().byId("inputWeight").setValue("");
                    oDialog.close();

                }.bind(this),
                error: function (oError) {
                    sap.m.MessageToast.show("Error al crear la evaluación: " + oError.message);
                }
            });

        },

        onEliminarUsuario: function () {
            var oModel = this.getView().getModel(); // Obtener la referencia del modelo
            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // Obtener la referencia de SmartTable
            var oTable = oSmartTable.getTable(); // Obtener la referencia de la tabla interna
            var oTable = this.getView().byId("_IDGenTable1");
            var aSelectedContexts = oTable.getSelectedContexts(); // Obtener los contextos de las filas seleccionadas
        
            // Implementar la lógica de eliminar filas
            MessageBox.confirm("¿Estás seguro de que quieres eliminar las evaluaciones seleccionadas?", {
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        // Recorrer cada contexto seleccionado
                        aSelectedContexts.forEach(function (oContext) {
                            var sPath = oContext.sPath; // Obtener el path del contexto
        
                            // Eliminar el elemento en el modelo utilizando el path
                            oModel.remove(sPath, {
                                success: function () {
                                    MessageToast.show("Evaluación eliminada con éxito");
                                    oModel.refresh(true);
                                },
                                error: function (oError) {
                                    MessageToast.show("Error al eliminar la evaluación.", oError);
                                }
                            });
                        });
                    }
                }
            });
        }

    });
});

