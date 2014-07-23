/*
* adapt-bookmarking
* License - https://github.com/cgkineo/adapt-bookmarking/LICENSE
* Maintainers - Dan Ghost <daniel.ghost@kineo.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');
	var BookmarkingDialog = require('extensions/adapt-bookmarking/js/adapt-bookmarking-dialog');
    var ScormWrapper = require('extensions/adapt-contrib-spoor/js/scormWrapper').getInstance();

    function initialize() {
    	Adapt.on('menuView:ready', resetLocationID);
        Adapt.on('pageView:ready', setupInViewListeners);
    }

    function setupInViewListeners(pageView) {
        var blockViews = pageView.$('.block');

        blockViews.each(function (i) {
        	$(this).on('inview', blockInview);            	
        });
    }

    function resetLocationID() {
        setLocationID('');
    }

    function setLocationID(id) {
        Adapt.trigger('bookmarking:locationID', id);
    }

    function blockInview(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            if (visiblePartY === 'top') {
            	var id = event.currentTarget.className;
            	var blockID = $.trim(id.substring(id.indexOf(" "), id.lastIndexOf(' ')));
            	//event.currentTarget.off('blockInview');
            	setLocationID(blockID);
            }
        }
    }

	Adapt.once('adapt:initialize', function() {
        var model = new Backbone.Model(Adapt.course.get('_bookmarking'));

        if (model.get('_isEnabled')) {
        	initialize();

            var locationID = ScormWrapper.getLessonLocation();
            
            if (locationID !== 'undefined' && locationID) {
                model.set('_locationID', locationID);
                new BookmarkingDialog({model: model});
            }
        }
	});
});