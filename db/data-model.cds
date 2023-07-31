using {
    cuid,
    managed,
    temporal,
    Currency
} from '@sap/cds/common';

namespace datamodel;

entity customer : managed {
    key id          : String;
        name        : String(256);
        type        : String(2);
        emailId     : String(105);
        contactNo   : String(32);
        address     : String(256);
        companyName : String(128);
        country     : String(105);
        orders      : Association to many order
                            on orders.customer = $self;
}

entity order : managed {
    key id : String;
    orderCategory : String;
    orderCategoryItem : String(105);
    orderPrice  : String(20);
    orderPiece  : String(10);
    customer    : Association to customer;

}

entity country {
    key id          : String;
        countryName : String(105);
        countryCode : String(10);
}

entity category {
    key id            : String;
        categoryCode  : String(10);
        categoryName  : String(105);
        categoryItems : Association to many categoryItem
                            on categoryItems.category = $self;
}

entity categoryItem {
    key id               : String;
        categoryItemName : String(105);
        category         : Association to category;
}
