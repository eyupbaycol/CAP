sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"anubhav/app/util/formatter"
], function(Controller, Formatter) {
	"use strict";

	return Controller.extend("anubhav.app.controller.View1", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf anubhav.app.view.View1
		 */
		onInit: function() {
			//get the router object from Component.js
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		onItemSelect: function(oEvent){
			var oSelectedItem = oEvent.getParameter("listItem");
			var sTitle = oSelectedItem.getTitle();
			this.onNext(sTitle);
		},
		oRouter: null,
		onSelectChange: function(oEvent){
			var oList = oEvent.getSource();
			// var aItems = oList.getSelectedItems();
			// for (var i=0; i<aItems.length; i++) {
			// 	console.log(aItems[i].getTitle());
			// }
			//Technique 1: to send data but can only send FIELD by FIELD
			//if we have 100 fields, we will have 100 lines of code and multiply
			// var sTitle = oList.getSelectedItem().getTitle();
			// this.onNext(sTitle);

			//Technique 2: Bind the complete View 2 with the element selected
			// --> /fruits/2 -- {name: '', color: '', ....}
			var sPath = oList.getSelectedItem().getBindingContextPath();
			var sIndex = sPath.split("/")[sPath.split("/").length - 1];
			this.onNext(sIndex);
			// var oView2 = this.getView().getParent().getParent().getDetailPages()[1];
			// oView2.bindElement(sPath);

		},
		onSearch: function(oEvent){
			//Step 1: get the value entered by user on screen
			var sSearchValue = oEvent.getParameter("query");
			if(!sSearchValue){
				sSearchValue = oEvent.getParameter("newValue");
			}
			//Step 2: prepare a filter object - 2 operands and 1 operator
			var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sSearchValue);
			var oFilter2 = new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.Contains, sSearchValue);
			var aFilter = [oFilter, oFilter2];
			var oFilterFinal = new sap.ui.model.Filter({
				filters: aFilter,
				and: false
			});
			//Step 3: get the control on which filter needs to be applied (List)
			var oList = this.getView().byId("idList");
			//step 4: Inject the filter into the binding of list
			oList.getBinding("items").filter(oFilterFinal);
		},
		onNext: function(sIndex){
			// WHO IS RESPONSIBLE FOR NAVIGATION
			this.oRouter.navTo("detail",{
				navya: sIndex
			});
			//Step 1: Get The Container object for this view
			//Now it is Split App Container Object
			// var oParent = this.getView().getParent().getParent();

			// //Step 2: go to view 1 from parent
			// var oView2 = oParent.getDetailPages()[1];
			// //Step 3: get the child of the view1 (viz. search field )
			// var oPage = oView2.getContent()[0];
			// //Step 4: get the value
			// oPage.setTitle(sTitle);

			// //Step 2: use that to navigate to second view
			// oParent.toDetail("idView2");
		},
		onAdd: function () {
			this.oRouter.navTo("add");
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf anubhav.app.view.View1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf anubhav.app.view.View1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf anubhav.app.view.View1
		 */
		//	onExit: function() {
		//
		//	}

	});

});
