/* global $ */

'use strict';

var base = require('base/checkout/checkout');

var billingHelpers = require('./billing');
var customerHelpers = require('base/checkout/customer');
var shippingHelpers = require('base/checkout/shipping');
var summaryHelpers = require('base/checkout/summary');

base.updateCheckoutView = function () {
    $('body').on('checkout:updateCheckoutView', function (e, data) {
        if (data.csrfToken) {
            $("input[name*='csrf_token']").val(data.csrfToken);
        }
        customerHelpers.methods.updateCustomerInformation(data.customer, data.order);
        shippingHelpers.methods.updateMultiShipInformation(data.order);
        summaryHelpers.updateTotals(data.order.totals);
        data.order.shipping.forEach(function (shipping) {
            shippingHelpers.methods.updateShippingInformation(
                shipping,
                data.order,
                data.customer,
                data.options
            );
        });
        billingHelpers.methods.updateBillingInformation(
            data.order,
            data.customer,
            data.options
        );
        billingHelpers.methods.updatePaymentInformation(data.order, data.options);
        summaryHelpers.updateOrderProductSummaryInformation(data.order, data.options);
    });
};

module.exports = base;
