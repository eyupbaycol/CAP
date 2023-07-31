using { datamodel } from '../db/data-model';

service CatalogService @(path:'/CatalogService') {
    entity customer as projection on datamodel.customer;
    action getCustomerByCountry() returns array of {
        _id: String;
        count: Integer64;
    };
    entity country as projection on datamodel.country;
    entity category as projection on datamodel.category;
    entity categoryItem as projection on datamodel.categoryItem;
    entity order as projection on datamodel.order;
}