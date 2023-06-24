sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Temporadas", {

        onInit: function () {
            var that = this; // Almacena una referencia a 'this'
          
            this.bExisteTemporadaAbierta = false;
            var oModel = this.getOwnerComponent().getModel();
            console.log(this.bExisteTemporadaAbierta);
            
            oModel.read("/Season", {
              success: function (oData) {
                console.log(oData.results);
                var aTemporadas = oData.results;
          
                for (var i = 0; i < aTemporadas.length; i++) {
                  if (aTemporadas[i].status === "abierta") {
                    that.bExisteTemporadaAbierta = true;
                    console.log('si hay abiertas');
                    break;
                  } else {
                    console.log('no hay abiertas');
                  }
                }
                
                console.log(that.bExisteTemporadaAbierta);
              },
              error: function (oError) {
                // Manejo de errores
              }
            });
          
            console.log(this.bExisteTemporadaAbierta);
          },
          
            
        
        // el resto de tu código de controlador aquí

        onButtonPress: function (oEvent) {
            var oModel = this.getView().getModel();
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();

            var sStatus = oContext.getProperty("status");
            var sPath = oContext.getPath();
            var sNewStatus = sStatus === "abierta" ? "cerrada" : "abierta";

            if (sStatus === "cerrada" && this.bExisteTemporadaAbierta) {
                MessageBox.error("No puedes abrir esta temporada porque ya hay otra temporada abierta.");
                return;
            }

            MessageBox.confirm("¿Estás seguro de que quieres " + (sNewStatus === "abierta" ? "abrir" : "cerrar") + " la temporada?", {
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        // Actualiza el modelo
                        oModel.update(sPath, {
                            status: sNewStatus
                        }, {
                            success: function() {
                                MessageToast.show("Estado actualizado exitosamente");
                                if (sNewStatus === "abierta") {
                                    this.bExisteTemporadaAbierta = true;
                                } else {
                                    this.bExisteTemporadaAbierta = false;
                                }                            }.bind(this),
                            error: function() {
                                MessageToast.show("Error al actualizar el estado");
                            }
                        });
                    }
                }.bind(this)
            });
        },

        onButtonEliminarPress: function (oEvent) {
            var oModel = this.getView().getModel();
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            var sPath = oContext.getPath();

            MessageBox.confirm("¿Estás seguro de que quieres eliminar la temporada?", {
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        // Elimina la temporada
                        oModel.remove(sPath, {
                            success: function() {
                                MessageToast.show("Temporada eliminada exitosamente");
                            },
                            error: function() {
                                MessageToast.show("Error al eliminar la temporada");
                            }
                        });
                    }
                }
            });
        }
    });
});

