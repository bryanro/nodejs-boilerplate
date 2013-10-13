define([
  'jquery',
  'underscore',
  'backbone',
  'views/user/user.view'
  /* list of all other views used */
], function ($, _, Backbone, UserView) {

    var thisRouter;

    var Router = Backbone.Router.extend({

        initialize: function () {
        },

        routes: {
            // Define some URL routes
            'showUser': 'showDefault',

            // Default
            '*actions': 'showDefault'
        },

        showDefault: function () {
            this.userView = new UserView();
            this.userView.render();
        },
    });

    var initialize = function () {
        var app_router = new Router();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});