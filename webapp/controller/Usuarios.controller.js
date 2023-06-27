sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Usuarios", {

        onInit: function () {
            var oButton = this.getView().byId("buttonCancel"); // reemplace "myButtonId" con el id real de tu botón
            oButton.attachPress(this.onCrearUsuarioDialogClose.bind(this));
            
        },

        onOpenCreateDialog: function () {
            var oDialog = this.byId("crearUsuarioDialog");
            oDialog.open();
        },

        onSubmit: function () {
            var oModel = this.getView().getModel()
            var oNewEntry = {};
            oNewEntry.id_number = this.getView().byId("inputId").getValue();
            oNewEntry.name = this.getView().byId("inputName").getValue();
            oNewEntry.role = this.getView().byId("inputRole").getValue();
            oNewEntry.department = this.getView().byId("inputDepartamento").getValue();

            oModel.create("/User", oNewEntry, {
                success: function () {
                    sap.m.MessageToast.show("Usuario creado con éxito");
                    var oDialog = this.getView().byId("crearUsuarioDialog");
                    this.getView().byId("inputId").setValue("");
                    this.getView().byId("inputName").setValue("");
                    this.getView().byId("inputRole").setValue("");
                    this.getView().byId("inputDepartamento").setValue("");
                    oDialog.close();

                }.bind(this),
                error: function (oError) {
                    sap.m.MessageToast.show("Error al crear el usuario: " + oError.message);
                }
            });

        },

        onCrearUsuarioDialogClose: function () {
            this.getView().byId("inputId").setValue("");
            this.getView().byId("inputName").setValue("");
            this.getView().byId("inputRole").setValue("");
            this.getView().byId("inputDepartamento").setValue("")
            var oDialog = this.getView().byId("crearUsuarioDialog");
            oDialog.close();
        },

        onAfterRendering: function () {
            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // obtener la referencia de SmartTable
            var oTable = oSmartTable.getTable(); // obtener la referencia de la tabla interna

            // adjuntar el evento rowSelectionChange
            oTable.attachRowSelectionChange(function (oEvent) {
                var oSelectedItem = oEvent.getParameter("rowContext");
                if (oSelectedItem) {  // comprobar si hay un elemento seleccionado
                    this.getView().setModel(new JSONModel({ selectedItemPath: oSelectedItem.getPath() }), "view");
                } else {
                    this.getView().setModel(new JSONModel({ selectedItemPath: null }), "view");  // en caso de que no haya una fila seleccionada, establecer el selectedItemPath a null
                }
            }.bind(this));
        },


        onEliminarUsuario: function () {
            var oModel = this.getView().getModel(); // obtener la referencia del modelo
            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // obtener la referencia de SmartTable
            var oTable = oSmartTable.getTable(); // obtener la referencia de la tabla interna
            var aSelectedIndices = oTable.getSelectedIndices(); // obtener los índices de las filas seleccionadas
        
            if (aSelectedIndices.length === 0) {
                // No hay filas seleccionadas, no hay nada que eliminar
                return;
            }
        
            MessageBox.confirm("¿Estás seguro de que quieres eliminar los usuarios seleccionados?", {
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        aSelectedIndices.forEach(function (iIndex) {
                            var sPath = oTable.getContextByIndex(iIndex).getPath();
                            oModel.remove(sPath, {
                                success: function () {
                                    MessageToast.show("Usuario eliminado con éxito.");
                                    oModel.refresh(true);
                                },
                                error: function (oError) {
                                    MessageToast.show("Error al eliminar el usuario.");
                                }
                            });
                        });
                    }
                }
            });
        }
        

    });
});
