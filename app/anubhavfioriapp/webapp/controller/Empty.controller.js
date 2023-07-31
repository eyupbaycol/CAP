sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("anubhav.app.controller.Empty", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("master").attachMatched(this.herculis, this);
			this.getView().setModel(new JSONModel({ "data": [] }), "local");
		},
		herculis: function () {
			var that = this;
			this.getView().getModel().callFunction("/getCustomerByCountry", {
				method: "POST",
				success: function (data) {
					that.getView().getModel("local").setProperty("/data", data.results);
				}
			})
		}

	});

});