/// <reference types="cypress"/>

import {
  videoUrl,
  maxDuration,
  minDuration,
} from "../../../../fixtures/videoData.json";

// selectors
const WATCH_BUTTON = ".homepage-form-buttons .btn.play-video-icon";
const MODAL = "#modal-video";
const CLOSE_MODAL_BUTTON = ".modal-close";
const IFRAME = "#modal-video .video-iframe";
const PLAYER_CONTAINER = "#player";
const HTML_VIDEO_PLAYER = ".html5-video-player";
const HTML_VIDEO_CONTAINER = ".html5-video-container";
const VIDEO = "video";
const VIDEO_PLAYER_BOTTOM = ".ytp-chrome-bottom";
const VIDEO_PLAYER_CONTROLS = ".ytp-chrome-controls";
const VIDEO_PLAY_BUTTON = ".ytp-play-button";

// Please note:
// when clicking on watch button a modal is opened.
// inside the modal we can see the youtube video.
// when i enter the page from my chrome browser i need to click play in order to watch the video
// but when using cypress the video plays immediately with no need to click play.

// after investigation:
// you are probably using the YouTube IFrame Player API.
// in this site : https://developers.google.com/youtube/player_parameters
// we can see how its done, for example:
// <iframe id="ytplayer" type="text/html" width="640" height="360"
//  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
//  frameborder="0"></iframe>

// if i look at the dom element on your site:
// <iframe class="video-iframe" allowfullscreen="" frameborder="0" data-lf-yt-playback-inspected-laxoeakvwrw4oygd="true"
// src="https://www.youtube.com/embed/csdJBOxR4B8?autoplay=1"></iframe>

// if we look at the url in the example there are two parameters:
// autoplay=1   this one will make sure the video will play without user interaction
// origin=http://example.com  this one has to do with security and cors probably.

// my conclusion:
// the origin parameter is missing on your site so autoplay is not working for me when using chrome
// but cypress probably behaves different and iFrame automatically delegates autoplay
// to the video. see: "allowed by default on same-origin iframes" on: https://developer.chrome.com/blog/autoplay/#iframe

// this will be taken into consideration when writing the next functions in the file

// function clicks watch button on homepage
export const clickWatchButton = () => {
  cy.log('clicking "Watch" button');
  cy.get(WATCH_BUTTON).should("be.visible").click();
};

// validates modal is open
export const validateModalIsOpen = () => {
  cy.log("validating modal is opened");
  _checkModalIsVisible(true);
};

// validates modal is closed
export const validateModalIsClosed = () => {
  cy.log("validating modal is closed");
  _checkModalIsVisible(false);
};

// validate video starts playing when modal opens
export const validateVideoIsAutoPlayingWhenModalOpens = () => {
  cy.log("getting video element and check he is auto playing");
  _checkVideoPausedProp(false);
};

// validates video is paused
export const validateVideoIsPaused = () => {
  cy.log("validating video is paused");
  _checkVideoPausedProp(true);
};

// validate video is playing
export const validateVideoIsPlaying = () => {
  cy.log("validating video is playing");
  _checkVideoPausedProp(false);
};

// functions pauses the video
export const stopVideo = () => {
  _getVideo({ waitDuration: 4 }).then(($video) => {
    cy.log("pausing video");
    $video[0].pause();
  });
  cy.log("validating video is paused");
  // video already loaded, no need to wait for him
  _getVideo().should("have.prop", "paused", true);
};

// validates the embedded video source is the correct one
export const validateVideoUrl = () => {
  cy.log("validating the correct video is loaded");
  cy.get(IFRAME).should("have.attr", "src").and("equal", videoUrl);
};

// checks video has duration and it is the right time (in seconds)
export const validateVideoDuration = () => {
  cy.log("validating video has duration of approximately 84 seconds");
  _getVideo({ waitDuration: 4 })
    .should("have.prop", "duration")
    .and("be.gt", minDuration)
    .and("be.lt", maxDuration);
};

//clicks play button on video controls
export const clickYouTubeVideoPlayButton = () => {
  _getYouTubeVideoControls({ waitDuration: 4 })
    .find(VIDEO_PLAY_BUTTON)
    .should("not.be.undefined")
    .and("be.visible")
    .then(() => {
      cy.log("clicking video play button");
    })
    .click();
};

// clicks close modal button
export const clickCloseModalButton = () => {
  cy.log("clicking close modal button");
  cy.get(MODAL).find(CLOSE_MODAL_BUTTON).should("be.visible").click();
};

// checks modal visibility
const _checkModalIsVisible = (isVisible) => {
  cy.get(MODAL).should(($modal) => {
    isVisible ? expect($modal).to.be.visible : expect($modal).to.be.hidden;
  });
};

// function returns the video element from inside iframe
const _getVideo = ({ waitDuration = 0 } = {}) => {
  // cy.wait(time) is considered anti pattern in cypress
  // and most of the time can be avoided
  // but after trying different options this was the
  // only way that wont return an empty iframe body.
  // probably also has to do with youtube api and iframe loading.
  cy.log(`waiting ${waitDuration} seconds for video element to load`);
  cy.wait(waitDuration * 1000);
  cy.log("getting video element");

  return (
    // had to wait for each child of the iframe body to load and have its child elements.
    // im forcing wait by using should functions (as oppose to the cy.wait() in previous command)
    // then i can search for the next child element
    cy
      // getting iframe body using custom command i created
      .getIframeBody(IFRAME)
      .find(PLAYER_CONTAINER)
      .should("not.be.empty")
      .find(HTML_VIDEO_PLAYER)
      .should("not.be.empty")
      .find(HTML_VIDEO_CONTAINER)
      .should("not.be.empty")
      .find(VIDEO)
      .should("not.be.undefined")
      .then(cy.wrap)
  );
};

// returns the control panel for the video
const _getYouTubeVideoControls = ({ waitDuration }) => {
  cy.log(`waiting ${waitDuration} seconds for video controls to load`);
  cy.wait(waitDuration * 1000);
  cy.log("getting video controls");

  return (
    cy
      .getIframeBody(IFRAME)
      .find("#player")
      .should("not.be.empty")
      .find(HTML_VIDEO_PLAYER)
      .should("not.be.empty")
      .children(VIDEO_PLAYER_BOTTOM)
      .find(VIDEO_PLAYER_CONTROLS)
  );
};

// function checks if video is paused
const _checkVideoPausedProp = (isPause) => {
  _getVideo({ waitDuration: 4 }).should("have.prop", "paused", isPause);
};
