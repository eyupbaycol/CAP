sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "anubhav/app/util/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, Formatter, JSONModel, MessageToast, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("anubhav.app.controller.Order", {
        formatter: Formatter,
        onInit: function () {
            this.oLocalData = new JSONModel();
            this.getView().setModel(this.oLocalData, "local");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("order").attachMatched(this.currentRoute, this);
        },
        currentRoute: function (oEvent) {
            this.oLocalData.setData({"orderData":{
                customer_id : oEvent.getParameter("arguments").customerId
            }});
        },
        getItemByCategory : function () {
            var selectedCategoryItem = this.oLocalData.getProperty("/orderData/orderCategory");
            var oDataModel = this.getView().getModel();
            var that = this;
            var filters = [new sap.ui.model.Filter("category_id", sap.ui.model.FilterOperator.EQ, selectedCategoryItem )];
            oDataModel.read("/categoryItem", {
                filters: filters,
                success: function (data) {
                    that.getView().setBusy(false);
                    that.oLocalData.setProperty("/categoryItems", data.results);
                },
                error: function (oError) {
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                    that.getView().setBusy(false);
                }
            })
        },
        createOrder: function () {
            var payload = this.oLocalData.getProperty("/orderData");
            var oDataModel = this.getView().getModel();
            oDataModel.create("/order", payload, {
                success: function () {
                    MessageToast.show("Create was success");
                },
                error: function (oError) {
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                }

            })
        }
        

    });

});
