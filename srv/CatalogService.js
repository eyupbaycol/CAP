const cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;

const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.HOST_URL;
const db_name = "capandmongo";
const client = new MongoClient(uri);
const ObjectId = require("mongodb").ObjectId;

module.exports = cds.service.impl(function () {
    const { customer, country, category, categoryItem, order } = this.entities;
    this.on("INSERT", customer, _createCustomer);
    this.on("READ", customer, _getAllCustomers);
    this.on("getCustomerByCountry", _getCustomerByCountry);
    this.on("UPDATE", customer, _updateCustomer);
    this.on("DELETE", customer, _deleteCustomer);

    //CREATE ORDER
    this.on("INSERT", order, _createOrder);

    //GET ALL ORDER
    this.on("READ", order, _getAllOrder);

    //GET ALL COUNTRY
    this.on("READ", country, _getAllCountry);

    //GET ALL CATEGORY
    this.on("READ", category, _getAllCategory);

    //GET ITEM BY CATEGORY ID
    this.on("READ",categoryItem,_getAllCategoryItem);
});

async function _createCustomer(req) {
    await client.connect();
    var db = await client.db(db_name);
    var customer = await db.collection("customer");

    var rec_count = await customer.count({ name: { $regex: new RegExp("^" + req.data.name, "i") } })
    if (rec_count >= 1) {
        throw new Error("Customer Already Exist");
    }
    const results = await customer.insertOne(req.data);

    if (results.insertedId) {
        req.data.id = results.insertedId.toString();
    }
    return req.data;
}
async function _createOrder(req) {
    await client.connect();
    var db = await client.db(db_name);
    var order = await db.collection("order");
    const results = await order.insertOne(req.data);
    if (results.insertedId) {
        req.data.id = results.insertedId.toString();
    }
    return req.data;
}
async function _getAllOrder(req) {
    await client.connect();
    var db = await client.db(db_name);
    var order = await db.collection("order");
    var filter;
    if(req.query.SELECT.one){
        var sId = req.query.SELECT.from.ref[0].where[2].val;
        filter = { _id: new ObjectId(sId) };
    }else if(req.query.SELECT.where) {
        var  query = req.query.SELECT.where[2].val;
       filter = { customer_id: query };
    }
    var results = await order.find(filter).toArray();
    
    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }

    return results;
}
async function _getAllCustomers(req) {
    await client.connect();
    var db = await client.db(db_name);
    var filter, results, limit, offset;
    if (req.query.SELECT.one) {
        var sId = req.query.SELECT.from.ref[0].where[2].val;
        filter = { _id: new ObjectId(sId) };
    }
    if (req.query.SELECT.limit) {
        limit = req.query.SELECT.limit.rows.val;
        if (req.query.SELECT.limit.offset) {
            offset = req.query.SELECT.limit.offset.val;
        } else {
            offset = 0;
        }
    } else {
        limit = 1000;
        offset = 0;
    }
    var collection_Customer = await db.collection("customer");
    results = await collection_Customer
        .find(filter)
        .limit(offset + limit)
        .toArray();
    results = results.slice(offset);

    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }

    return results;
}

async function _getCustomerByCountry(req) {
    await client.connect();
    var db = await client.db(db_name);
    var customer = await db.collection("customer");
    const results = await customer.aggregate([
        {
            $match: { type: "C" }
        },
        {
            $group: { _id: "$country", count: { $sum: 1 } }
        },
        {
            $sort: { count: -1 }
        }
    ])
    return results.toArray()
}

async function _updateCustomer(req) {
    await client.connect();
    var db = await client.db(db_name);
    var sapUsers = await db.collection("customer");
    var data = req.data;
    var sId = new ObjectId(data.id);
    delete data.id;
    const results = await sapUsers.updateOne({ _id: sId }, { $set: data });
    if (results.modifiedCount === 1) {
        delete data._id;
        data.id = sId;
        return data;
    } else {
        console.log(results.result);
        return results.result;
    }
}

async function _deleteCustomer(req) {
    await client.connect();
    var db = await client.db(db_name);
    var sapUsers = await db.collection("customer");
    var data = req.data;
    var sId = new ObjectId(data.id);
    const results = await sapUsers.deleteOne({ _id: sId });
    return results;
}

async function _getAllCountry(req) {
    await client.connect();
    var db = await client.db(db_name);
    var countries = await db.collection("country");
    var results = await countries.find({}).toArray();
    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }
    return results;
}

async function _getAllCategory(req) {
    await client.connect();
    var db = await client.db(db_name);
    var categories = await db.collection("category");
    var results = await categories.find().toArray();
    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }
    return results;
}

async function _getAllCategoryItem(req) {
    await client.connect();
    var db = await client.db(db_name);
    var categoryItems = await db.collection("categoryItem");
    var filter;
    if (req.query.SELECT.one) {
        var sId = req.query.SELECT.from.ref[0].where[2].val;
        filter = { _id: new ObjectId(sId) };
    }else if(req.query.SELECT.where) {
        var  query = req.query.SELECT.where[2].val;
       filter = { category_id: query };
    }
    var results = await categoryItems.find(filter).toArray();
    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }
    return results

}