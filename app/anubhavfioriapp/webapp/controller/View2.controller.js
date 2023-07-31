sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
], function(Controller, MessageBox, MessageToast,JSONModel) {
	"use strict";

	return Controller.extend("anubhav.app.controller.View2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf anubhav.app.view.View2
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			//this.oRouter.attachRoutePatternMatched(this.herculis, this);
			this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
			this.oLocalData = new JSONModel();
            this.getView().setModel(this.oLocalData, "local");
		},
		herculis: function(oEvent){
			debugger;	
			var navya = oEvent.getParameter("arguments").navya;
			this.selectedId = navya.split("'")[1];
			var sPath = '/' + navya;
			this.getView().bindElement(sPath);
			this.getCustomerOrder(this.selectedId);
		},
		
		onBack: function(){
			//Step 1: Get The Container object for this view
			//var oParent = this.getView().getParent();
			//Step 2: use that to navigate to second view
			//oParent.to("idView1");
			this.oRouter.navTo("master");
		},
		onSave: function(){
			
			//Step 1: we need to access the object of parent
			var oAppCon = this.getView().getParent();
			//Step 2: go to view 1 from parent
			var oView1 = oAppCon.getPages()[0];
			//Step 3: get the child of the view1 (viz. search field )
			var oSearch = oView1.byId("idSearch");
			//Step 4: get the value
			var sValue = oSearch.getValue();
			
			MessageBox.confirm("Hey dude! shall i save? " + sValue,{
				title: "Maza Aavigiyo",
				onClose: function(status){
					if(status === "OK"){
						MessageToast.show("Sales order 8080 has been created Roger!!");
					}else{
						MessageBox.error("You break my heart :(");
					}
				}
			});
		},
		onCreate: function() {
			this.oRouter.navTo("order",{
				customerId: this.selectedId
			});
		},
		getCustomerOrder: function(sId) {
			var oDataModel = this.getOwnerComponent().getModel();
			var filters = [new sap.ui.model.Filter("customer_id", sap.ui.model.FilterOperator.EQ, sId )];
			var that = this;
            oDataModel.read("/order", {
                filters: filters,
                success: function (data) {
                    that.getView().setBusy(false);
                    that.oLocalData.setProperty("/orders", data.results);
                },
                error: function (oError) {
					that.getView().setBusy(false);
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message.value);
                }
            })
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf anubhav.app.view.View2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf anubhav.app.view.View2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf anubhav.app.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});