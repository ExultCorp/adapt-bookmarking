/*
* adapt-bookmarking
* License - https://github.com/cgkineo/adapt-bookmarking/LICENSE
* Maintainers - Dan Ghost <daniel.ghost@kineo.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');
	var BookmarkingDialog = require('extensions/adapt-bookmarking/js/adapt-bookmarking-dialog');

	var Bookmarking = Backbone.View.extend({

        className: "bookmarking",

        initialize: function() {
        	this.listenTo(Adapt, 'menuView:ready', this.resetLocationID);
            //Adapt.on('menuView:ready', this.resetLocationID, this);
            this.listenTo(Adapt, 'pageView:ready', this.setupInViewListeners);
            //Adapt.on('pageView:ready', this.setupInViewListeners, this);
        },

        setupInViewListeners: function(pageView) {
        	var thisClass = this;
            var blockViews = pageView.$('.block');

            blockViews.each(function (i) {
            	$(this).on('inview', $.proxy(thisClass.inview, thisClass));            	
            });
        },

        resetLocationID: function() {
            this.setLocationID('');
        },

        setLocationID: function(id) {
            Adapt.trigger('bookmarking:locationID', id);
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                	var id = event.currentTarget.className;
                	var blockID = id.substring(id.indexOf(" ") + 1, id.lastIndexOf(' ') - 1);
                	//var id = event.currentTarget.off('inview');
                	this.setLocationID(blockID);
                }
            }
        }
    });

	Adapt.once('adapt:initialize', function() {
        var model = new Backbone.Model(Adapt.course.get('_bookmarking'));

        if (model.get('_isEnabled')) {
        	this.initialize();
        	new BookmarkingDialog({model: model});
        }
	});

	return Bookmarking;
});