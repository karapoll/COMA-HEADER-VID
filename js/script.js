var HeaderVideo = (function ($, document) {

    var settings = {
        container: $('.header-video'),
        video: '#video',
        header: $('.header-video-media'),
        videoTrigger: $('#video-trigger'),
        videoCloseTrigger: $('#video-close-trigger'),
        teaserVideo: $('#teaser-video'),
        autoPlayVideo: false
    };

    var init = function(options){
        settings = $.extend(settings, options);
        getVideoDetails();
        setFluidContainer();
        bindClickActions();
        settings.videoCloseTrigger.hide();
        
        if(videoDetails.teaser) {
            appendTeaserVideo();
        }

        if(settings.autoPlayVideo) {
            appendFrame();
        }
    };

    // add the click-functionality to our trigger
    var bindClickActions = function() {
        settings.videoTrigger.on('click', function(e) {
            e.preventDefault();
            appendFrame();
            settings.videoCloseTrigger.fadeIn();
        });
        settings.videoCloseTrigger.on('click', function(e){
            e.preventDefault();
            removeFrame();
        });
    };

    // creating a function that stores all our data-* attributes in a object
    var getVideoDetails = function() {
        // get all the data attributes from the HTML container and return them as an object for easy data retrieval
        videoDetails = {
            id: settings.header.attr('data-video-src'),
            teaser: settings.header.attr('data-teaser-source'),
            provider: settings.header.attr('data-provider').toLowerCase(),
            videoHeight: settings.header.attr('data-video-height'),
            videoWidth: settings.header.attr('data-video-width')
        };
        return videoDetails;
    };

    // set the height and width of the wrapping container based on the height and width of the iFrame we want to append
    var setFluidContainer = function () {
        settings.container.data('aspectRatio', videoDetails.videoHeight / videoDetails.videoWidth);

        $(window).resize(function() {
            var winWidth = $(window).width(),
                winHeight = $(window).height();

            settings.container
                // round up to the nearest pixel value to prevent breaking of layout
                .width(Math.ceil(winWidth)) 
                // set the videos aspect ratio, see https://css-tricks.com/fluid-width-youtube-videos/
                .height(Math.ceil(winWidth * settings.container.data('aspectRatio')));

            if(winHeight < settings.container.height()) {
                settings.container
                    .width(Math.ceil(winWidth))
                    .height(Math.ceil(winHeight));
            }
        // trigger resize to force it to run on page load as well
        }).trigger('resize'); 

    };

    // a function that appends the teaser video to the container, if there’s a video available
    // and a helper function that determines if a user is on a mobile device
    var appendTeaserVideo = function() {
        if(Modernizr.video && !isMobile()) {
            var source = videoDetails.teaser,
                html = '<video autoplay="true" loop="loop" muted id="teaser-video" class="teaser-video"><source src="'+source+'.mp4" type="video/mp4"><source src="'+source+'.ogv" type="video/ogg"></video>';
            settings.container.append(html);
        }
    };
    
    // the if-statement at the bottom is to prevent the video from being higher than the actual viewport, which will force the user to scroll to see the full video 
    // the downside to this is that some black borders will appear on each side of the video, since the aspect ratio now will be wrong
    // so let's create a function that creates our iFrame that will later be appended
    var createFrame = function() {
        // added an ID attribute to be able to remove the video element when the user clicks on the remove button
        if(videoDetails.provider === 'youtube') {
            var html = '<iframe id="video" src="http://www.youtube.com/embed/'+videoDetails.id+'?rel=0&amp;hd=1&autohide=1&showinfo=0&autoplay=1&enablejsapi=1&origin=*" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }
        else if(videoDetails.provider === 'vimeo') {
            var html = '<iframe id="video" src="http://player.vimeo.com/video/'+videoDetails.id+'?title=0&amp;byline=0&amp;portrait=0&amp;color=3d96d2&autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }
        else if(videoDetails.provider === 'html5') {
            var html = '<video autoplay="true" loop="loop" id="video"><source src="'+videoDetails.id+'.mp4" type="video/mp4"><source src="'+videoDetails.id+'.ogv" type="video/ogg"></video>';
        }
        return html;
    };

    // a function that will hide the header image and teaser-video, append the iFrame we created and fade out our video trigger
    var appendFrame = function() {
        settings.header.hide();
        settings.container.append(createFrame());
        removePlayButton();
        settings.teaserVideo.hide();
    };

    var removeFrame = function() {
        $(settings.video).remove();
        settings.teaserVideo.fadeIn();
        displayPlayButton();
        removeRemoveButton();
    };

    var removePlayButton = function () {
        if(settings.videoTrigger) {
            settings.videoTrigger.fadeOut('slow');
        }
    };

    var displayPlayButton = function() {
        if(settings.videoTrigger) {
            settings.videoTrigger.fadeIn('slow');
        }
    };

    var removeRemoveButton = function() {
        settings.videoCloseTrigger.hide();
    };

    var isMobile = function () {
        // a basic way of detecting mobile devices
        // should be extended to a more fool proof way in a production environment
        return Modernizr.touch;
    }

    return {
        init: init
    };
    
})(jQuery, document);

$(document).ready(function() {
    HeaderVideo.init({
        container: $('.header-video'),
        header: $('.header-video-media'),
        videoTrigger: $("#video-trigger"),
        autoPlayVideo: false
    });    
});