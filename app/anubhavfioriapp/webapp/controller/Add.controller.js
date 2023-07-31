sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "anubhav/app/util/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, Formatter, JSONModel, MessageToast, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("anubhav.app.controller.Add", {
        formatter: Formatter,
        onInit: function () {
            this.oLocalData = new JSONModel();
            this.oLocalData.setData({
                "customerData": {
                    "name": "",
                    "type": "C",
                    "emailId": "eyup.bycl@gmail.com",
                    "contactNo": "882477742",
                    "address": "filizler sokak no:32",
                    "companyName": "detaysoft",
                    "country": "TR"
                }
            });
            this.getView().setModel(this.oLocalData, "local");
            
        },
        mode: "create",
        onClear: function () {
            this.oLocalData.setProperty("/customerData", {
                "name": "",
                "type": "C",
                "emailId": "eyup.bycl@gmail.com",
                "contactNo": "882477742",
                "address": "filizler sokak no:32",
                "companyName": "detaysoft",
                "country": "TR"
            })
            this.getView().byId("idSave").setText("Create");
            this.mode = "create";
        },
        onConfirmPopup: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sId = oSelectedItem.getLabel();
            var oDataModel = this.getView().getModel();
            var that = this;
            oDataModel.read("/customer('" + sId + "')", {
                success: function (data) {
                    that.oLocalData.setProperty("/customerData", data);
                    that.getView().setBusy(false);
                    that.mode = "update";
                    that.getView().byId("idSave").setText("Update")
                },
                error: function (oError) {
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                    that.getView().setBusy(false);
                    that.mode = "create";
                    that.getView().byId("idSave").setText("Save");
                }
            })
        },
        customerPopup: null,
        onSupplierF4: function (oEvent) {
            var that = this;
            if (this.customerPopup === null) {
                Fragment.load({
                    id: "supplier",
                    name: "anubhav.app.fragments.popup",
                    controller: this
                }).then(function (oDialog) {
                    that.customerPopup = oDialog;
                    that.customerPopup.setTitle("Select Supplier");
                    that.getView().addDependent(that.customerPopup)
                    that.customerPopup.setMultiSelect(false);
                    that.customerPopup.bindAggregation("items", {
                        path: '/customer',
                        template: new sap.m.DisplayListItem({
                            label: "{id}",
                            value: "{name}"
                        })
                    });
                    that.customerPopup.open()
                })
            } else {
                this.customerPopup.open();
            }
        },
        onSave: function () {
            var payload = this.oLocalData.getProperty("/customerData");
            var oDataModel = this.getView().getModel();

            if (this.mode === "update") {
                oDataModel.update("/customer('" + payload.id + "')", payload, {
                    success: function () {
                        MessageToast.show("Update was success");
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                    }
                })

            } else {
                oDataModel.create("/customer", payload, {
                    success: function () {
                        MessageToast.show("Create was success");
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                    }

                })
            }
        },
        onDelete: function () {
            MessageBox.confirm("Do you really want to do this to me :( ?", {
                onClose: this._deleteProduct.bind(this)
            })
        },
        _deleteProduct: function (status) {
            if (status === "OK") {
                var sId = this.oLocalData.getProperty("/customerData/id");
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.remove("/customer('" + sId + "')", {
                    success: function () {
                        MessageToast.show("Customer was deleted successfully");
                        that.onClear()
                    },
                    error: function () {
                        MessageToast.show("Action was canceled");
                        that.onClear();
                    }
                })
            }
        }

    });

});
