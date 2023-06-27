sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {

    function formatearFecha(fecha) {

        var parts = fecha.split('/');
        var month = parts[0];
        var day = parts[1];
        var year = parts[2];

        // Añadir el prefijo "20" al año si es un valor de dos dígitos
        if (year.length === 2) {
            year = '20' + year;
        }

        if (month.length === 1) {
            month = '0' + month;
        }

        if (day.length === 1) {
            day = '0' + day;
        }


        // Crear una nueva fecha en formato YYYY-MM-DD
        var formattedDate = year + '-' + month + '-' + day;

        return formattedDate;

    }
    function getMonth(fecha) {

        var parts = fecha.split('/');
        var month = parts[0];


        if (month.length === 1) {
            month = '0' + month;
        }

        return month;

    }
    function getYear(fecha) {
        var parts = fecha.split('/');
        var year = parts[2];
        if (year.length === 2) {
            year = '20' + year;
        }
        return year;
    }
    "use strict";
    return Controller.extend("evaluatorweb.controller.Temporadas", {
        onInit: function () {
            var oButton = this.getView().byId("buttonCancel"); // reemplace "myButtonId" con el id real de tu botón

            // Vincula la función al botón
            oButton.attachPress(this.onCrearTemporadaDialogClose.bind(this));
            var that = this;

            this.bExisteTemporadaAbierta = false;
            var oModel = this.getOwnerComponent().getModel();

            oModel.read("/Season", {
                success: function (oData) {
                    var aTemporadas = oData.results;

                    for (var i = 0; i < aTemporadas.length; i++) {
                        if (aTemporadas[i].status === "abierta") {
                            that.bExisteTemporadaAbierta = true;

                            break;
                        } else {

                        }
                    }
                },
                error: function (oError) {

                }
            });

        },

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
                            success: function () {
                                MessageToast.show("Estado actualizado exitosamente");
                                if (sNewStatus === "abierta") {
                                    this.bExisteTemporadaAbierta = true;
                                } else {
                                    this.bExisteTemporadaAbierta = false;
                                }
                            }.bind(this),
                            error: function () {
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
                            success: function () {
                                MessageToast.show("Temporada eliminada exitosamente");
                            },
                            error: function () {
                                MessageToast.show("Error al eliminar la temporada");
                            }
                        });
                    }
                }
            });
        },

        onCrearTemporada: function () {
            var oDialog = this.byId("crearTemporadaDialog");
            oDialog.open();
        },


        onSubmit: function () {
            var oModel = this.getView().getModel()
            var oNewEntry = {};
            oNewEntry.id = this.getView().byId("id").getValue();
            oNewEntry.start_date = formatearFecha(this.getView().byId("inicio").getValue());
            oNewEntry.end_date = formatearFecha(this.getView().byId("fin").getValue());
            oNewEntry.season_number = this.getView().byId("inputTemporada").getValue();
            oNewEntry.status = 'cerrada';
            oNewEntry.month = getMonth(this.getView().byId("inicio").getValue());
            oNewEntry.year = getYear(this.getView().byId("inicio").getValue());

            oModel.create("/Season", oNewEntry, {
                success: function () {
                    sap.m.MessageToast.show("Entrada creada con éxito");
                    var oDialog = this.getView().byId("crearTemporadaDialog");
                    this.getView().byId("id").setValue("");
                    this.getView().byId("inicio").setValue("");
                    this.getView().byId("fin").setValue("");
                    this.getView().byId("inputTemporada").setValue("");
                    oDialog.close();

                }.bind(this),
                error: function (oError) {
                    sap.m.MessageToast.show("Error al crear la entrada: " + oError.message);
                }
            });

        },

        onCrearTemporadaDialogClose: function () {

            this.getView().byId("id").setValue("");
            this.getView().byId("inicio").setValue("");
            this.getView().byId("fin").setValue("");
            this.getView().byId("inputTemporada").setValue("")
            var oDialog = this.getView().byId("crearTemporadaDialog");
            oDialog.close();
        }


    });
});

