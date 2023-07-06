sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/Text",
    "sap/m/SegmentedButtonItem",
], function (Controller, MessageToast, MessageBox, JSONModel, Text, SegmentedButtonItem) {
    "use strict";

    return Controller.extend("evaluatorweb.controller.Evaluaciones", {
        formatter: {
            weightInPercentage: function (sWeight) {
                if (!sWeight) {
                    return "0%";
                }
                return parseFloat(sWeight * 100).toFixed(0) + "%";
            }
        },
        onInit: function () {
            var oPanel = this.getView().byId("_IDGenPanel4");
            oPanel.setWidth("95%");

            var oButton = this.getView().byId("buttonCancel"); // reemplace "myButtonId" con el id real de tu botón
            oButton.attachPress(this.onCrearEvaluacionDialogClose.bind(this));

            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // obtener la referencia de SmartTable

            var oDataModel = this.getOwnerComponent().getModel();
            var oSegmentedButton = this.getView().byId("SB2");
            this.aTables = [];

            oDataModel.read("/Evaluation", {
                success: function (oData, response) {
                    var aEvaluations = oData.results;
                    for (var i = 0; i < aEvaluations.length; i++) {
                        var oTable = new sap.ui.table.Table({
                            title: aEvaluations[i].name,
                            visible: i === 0,
                            width: "100%",
                            extension: [
                                new sap.m.Toolbar({
                                    content: [
                                        new sap.m.ToolbarSpacer(),
                                        new sap.m.Button({
                                            text: "Crear",
                                            icon: "sap-icon://add",
                                            press: function (sIdEvaluacion) {
                                                return function (oEvent) {
                                                    this.onCrearMetrica(oEvent, sIdEvaluacion);
                                                }.bind(this);
                                            }.bind(this)(aEvaluations[i].id)
                                        }),
                                        new sap.m.Button({
                                            text: "Editar",
                                            icon: "sap-icon://edit",
                                            press: function (sIdEvaluacion) {
                                                return function (oEvent) {
                                                    this.onEditarMetrica(oEvent, sIdEvaluacion);
                                                }.bind(this);
                                            }.bind(this)(aEvaluations[i].id)
                                        }),
                                        new sap.m.Button({
                                            text: "Eliminar",
                                            icon: "sap-icon://delete",
                                            press: function (iTableIndex) {
                                                return function (oEvent) {
                                                    this.onDeleteMetricas(iTableIndex);
                                                }.bind(this);
                                            }.bind(this)(i)
                                        })

                                    ]
                                })
                            ],

                        });
                        this.aTables.push(oTable);


                        oTable.addColumn(new sap.ui.table.Column({
                            label: "Metrica",
                            template: new Text().bindText("metric")
                        }));

                        oTable.addColumn(new sap.ui.table.Column({
                            label: "Descripion",
                            template: new Text().bindText("description")
                        }));

                        oTable.addColumn(new sap.ui.table.Column({
                            label: "Peso",
                            template: new Text().bindText({
                                path: "weight",
                                formatter: function (fValue) {
                                    return (fValue * 100).toFixed(0) + "%";
                                }
                            })
                        }));

                        oTable.bindRows({
                            path: "/EvaluationFormat",
                            filters: [new sap.ui.model.Filter("id_evaluation_id", sap.ui.model.FilterOperator.EQ, aEvaluations[i].id)]
                        });

                        oTable.setModel(oDataModel);

                        this.getView().byId("content").addItem(oTable);
                        this.getView().byId("content").setVisible(false)
                        this.getView().byId("_IDGenFlexBox2").setVisible(false)

                        var oSegmentedButtonItem = new SegmentedButtonItem({
                            text: aEvaluations[i].name,
                            key: i  // La clave es el índice de la tabla
                        });
                        oSegmentedButton.addItem(oSegmentedButtonItem);

                    }
                }.bind(this)
            });
        },

        onDeleteMetricas: function (iTableIndex) {
            var oTable = this.aTables[iTableIndex];  // Obtener la tabla correcta usando el índice
            var aSelectedIndices = oTable.getSelectedIndices();


            if (aSelectedIndices.length > 0) {
                var oDialog = new sap.m.Dialog({
                    title: "Confirmación",
                    type: "Message",
                    content: new sap.m.Text({
                        text: "¿Estás seguro de que deseas eliminar " + aSelectedIndices.length + " métricas?"
                    }),
                    beginButton: new sap.m.Button({
                        text: "Aceptar",
                        press: function () {
                            var oModel = oTable.getModel();

                            aSelectedIndices.forEach(function (iIndex) {
                                var oContext = oTable.getContextByIndex(iIndex);
                                var sPath = oContext.getPath();
                                oModel.remove(sPath, {
                                    success: function () {
                                        sap.m.MessageToast.show("Métrica eliminada con éxito");
                                    },
                                    error: function () {
                                        sap.m.MessageToast.show("Error al eliminar la métrica");
                                    }
                                });
                            });

                            oDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                oDialog.open();
            } else {
                sap.m.MessageToast.show("Selecciona al menos una métrica para eliminar");
            }
        },

        //PARA EDITAR METRICAS


        onIdChange2: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var oSelectedItem = oComboBox.getSelectedItem();
            if (oSelectedItem) {
                var oModel = this.getView().getModel();
                var sPath = "/EvaluationFormat(" + oSelectedItem.getKey() + ")";
                oModel.read(sPath, {
                    success: function (oData) {
                        var oEntity = oData;
                        this.getView().byId("descripcionInputEditar").setValue(oEntity.description);
                        this.getView().byId("pesoInputEditar").setValue((oEntity.weight * 100).toFixed(0) + "%");

                    }.bind(this),
                    error: function () {
                        MessageToast.show("Error al cargar los datos de la entidad.");
                    }
                });
            }
        },

        onCancelarEditarMetrica: function () {
            this.getView().byId("idComboBox2").setValue("");
            this.getView().byId("descripcionInputEditar").setValue("");
            this.getView().byId("pesoInputEditar").setValue("");
            var oDialog = this.getView().byId("editarMetricaDialog");
            oDialog.close();
        },

        onEditarMetrica: function (oEvent, sIdEvaluacion) {
            var oIdEvaluacionInput = this.byId("idEvaluacionInputEditar");
            oIdEvaluacionInput.setValue(sIdEvaluacion);

            var oModel = this.getView().getModel();

            oModel.read("/EvaluationFormat", {
                success: function (oData) {
                    var aEntities = oData.results;
                    var oComboBox = this.getView().byId("idComboBox2");
                    oComboBox.removeAllItems();
                    aEntities.forEach(function (oEntity) {
                        if (oEntity.id_evaluation_id === sIdEvaluacion) { // solo agregar los que tengan id_evaluation_id == sIdEvaluacion
                            oComboBox.addItem(new sap.ui.core.Item({
                                key: oEntity.id,
                                text: oEntity.metric
                            }));
                        }
                    });
                    var oDialog = this.byId("editarMetricaDialog");
                    oDialog.open();
                }.bind(this),
                error: function () {
                    MessageToast.show("Error al cargar los datos.");
                }
            });
        },

        // PARA CREAR METRICAS

        onCrearMetrica: function (oEvent, sIdEvaluacion) {
            this._oDialog = this.byId("crearMetricaDialog");
            var oIdEvaluacionInput = this.byId("idEvaluacionInput");
            oIdEvaluacionInput.setValue(sIdEvaluacion);

            // abre el diálogo
            this._oDialog.open();
        },

        onGuardarMetrica: function () {
            // obtén los valores de los campos de entrada
            var oIdEvaluacionInput = this.byId("idEvaluacionInput");
            var oMetricaInput = this.byId("metricaInput");
            var oDescripcionInput = this.byId("descripcionInput");
            var oPesoInput = this.byId("pesoInput");

            var sIdEvaluacion = oIdEvaluacionInput.getValue();
            var sMetrica = oMetricaInput.getValue();
            var sDescripcion = oDescripcionInput.getValue();
            var fPeso = parseFloat(oPesoInput.getValue()) / 100;

            // crea el nuevo objeto métrica y añádelo al modelo
            var oDataModel = this.getOwnerComponent().getModel();
            var oNewMetrica = {
                id_evaluation_id: sIdEvaluacion,
                metric: sMetrica,
                description: sDescripcion,
                weight: fPeso
            };
            oDataModel.create("/EvaluationFormat", oNewMetrica);
            this.byId("metricaInput").setValue("");
            this.byId("descripcionInput").setValue("");
            this.byId("pesoInput").setValue("");



            // cierra el diálogo
            this._oDialog.close();
        },

        onCancelarMetrica: function () {
            this.byId("metricaInput").setValue("");
            this.byId("descripcionInput").setValue("");
            this.byId("pesoInput").setValue("");
            // simplemente cierra el diálogo
            this._oDialog.close();
        },


        //PARA SELECCIONAR QUE EVALUACION SE VE

        onEvalSelect: function (oEvent) {
            var oSegmentedButton = oEvent.getSource();
            var sKey = oSegmentedButton.getSelectedKey();
            var oContent = this.getView().byId("content");
            var aTables = oContent.getItems();
            for (var i = 0; i < aTables.length; i++) {
                aTables[i].setVisible(i.toString() === sKey);
            }
        },


        onToggleView: function () {
            var oGridList = this.getView().byId("LineItemsSmartTable");
            var oSmartTable = this.getView().byId("content");
            var oButton = this.getView().byId("btnToggle");

            if (oGridList.getVisible()) {
                oGridList.setVisible(false);
                this.getView().byId("_IDGenFlexBox2").setVisible(true)
                oSmartTable.setVisible(true);
            } else {
                oGridList.setVisible(true);
                this.getView().byId("_IDGenFlexBox2").setVisible(false)
                oSmartTable.setVisible(false);
            }
        },

        //PARA CREAR EVALUACIONES

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

        //PARA EDITAR EVALUACIONES

        onEditarEvaluacion: function () {
            var oModel = this.getView().getModel();

            oModel.read("/Evaluation", {
                success: function (oData) {
                    var aEntities = oData.results;

                    var oComboBox = this.getView().byId("idComboBox");
                    oComboBox.removeAllItems();
                    aEntities.forEach(function (oEntity) {
                        oComboBox.addItem(new sap.ui.core.Item({
                            key: oEntity.id,
                            text: oEntity.id
                        }));
                    });

                    var oDialog = this.byId("editarEvaluacionDialog");
                    oDialog.open();
                }.bind(this),
                error: function () {
                    MessageToast.show("Error al cargar los datos.");
                }
            });
        },

        onSubmitEdit: function () {
            var oModel = this.getView().getModel();

            // Obtenemos el ID de la entidad seleccionada
            var sId = this.getView().byId("idComboBox").getSelectedKey();

            // Creamos un objeto con los nuevos datos de la entidad
            var oNewData = {};
            oNewData.name = this.getView().byId("inputNameEdit").getValue();
            oNewData.description = this.getView().byId("inputDescriptionEdit").getValue();
            var sWeight = this.getView().byId("inputWeightEdit").getValue();
            oNewData.weight = sWeight ? parseFloat(sWeight) / 100 : 0;

            // Actualizamos la entidad
            var sPath = "/Evaluation('" + sId + "')";
            oModel.update(sPath, oNewData, {
                success: function () {
                    MessageToast.show("Evaluación editada con éxito");
                    // Limpiamos los campos del diálogo y lo cerramos
                    this.getView().byId("idComboBox").setValue("");
                    this.getView().byId("inputNameEdit").setValue("");
                    this.getView().byId("inputDescriptionEdit").setValue("");
                    this.getView().byId("inputWeightEdit").setValue("");
                    var oDialog = this.getView().byId("editarEvaluacionDialog");
                    oDialog.close();
                }.bind(this),
                error: function () {
                    MessageToast.show("Error al editar la evaluación.");
                }
            });
        },

        onIdChange: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var oSelectedItem = oComboBox.getSelectedItem();
            if (oSelectedItem) {
                var oModel = this.getView().getModel();
                var sPath = "/Evaluation('" + oSelectedItem.getKey() + "')";
                oModel.read(sPath, {
                    success: function (oData) {
                        var oEntity = oData;
                        this.getView().byId("inputNameEdit").setValue(oEntity.name);
                        this.getView().byId("inputDescriptionEdit").setValue(oEntity.description);
                        this.getView().byId("inputWeightEdit").setValue((oEntity.weight * 100).toFixed(0) + "%");

                    }.bind(this),
                    error: function () {
                        MessageToast.show("Error al cargar los datos de la entidad.");
                    }
                });
            }
        },


        onCrearEvaluacionDialogClose2: function () {
            this.getView().byId("idComboBox").setValue("");
            this.getView().byId("inputNameEdit").setValue("");
            this.getView().byId("inputDescriptionEdit").setValue("");
            this.getView().byId("inputWeightEdit").setValue("")
            var oDialog = this.getView().byId("editarEvaluacionDialog");
            oDialog.close();
        },

        //PARA ELIMINAR EVALUACIONES


        onEliminarEvaluacion: function () {
            var oModel = this.getView().getModel(); // obtener la referencia del modelo
            var oSmartTable = this.getView().byId("LineItemsSmartTable"); // obtener la referencia de SmartTable
            var oTable = oSmartTable.getTable(); // obtener la referencia de la tabla interna
            var aSelectedIndices = oTable.getSelectedIndices(); // obtener los índices de las filas seleccionadas

            if (aSelectedIndices.length === 0) {
                // No hay filas seleccionadas, no hay nada que eliminar
                return;
            }

            MessageBox.confirm("¿Estás seguro de que quieres eliminar las evaluaciones seleccionadas?", {
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        aSelectedIndices.forEach(function (iIndex) {
                            var sPath = oTable.getContextByIndex(iIndex).getPath();
                            oModel.remove(sPath, {
                                success: function () {
                                    MessageToast.show("Evaluación eliminada con exito");
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
        },

    });
});

