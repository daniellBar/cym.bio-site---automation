import {
  clickWatchButton,
  validateModalIsOpen,
  validateModalIsClosed,
  validateVideoIsAutoPlayingWhenModalOpens,
  stopVideo,
  validateVideoUrl,
  validateVideoDuration,
  clickYouTubeVideoPlayButton,
  validateVideoIsPaused,
  validateVideoIsPlaying,
  clickCloseModalButton,
} from "../../support/page-objects/widgets/home-page/WatchVideo.js";

describe("watch video actions", () => {
  before(() => {
    cy.visit("/");
  });

  // instead of getting the close modal button and click it at the end of some test
  // reload the page to remove the modal after every test
  afterEach(() => {
    cy.reload();
  });

  it("the correct video url should be loaded", () => {
    clickWatchButton();
    validateModalIsOpen();
    validateVideoUrl();
  });

  // as explained in WatchVideo.js file, this autoplay is unwanted
  // cypress functionality for me.
  // this is not what the user will experience (at least from my experience),
  // but through this i can check that the video is playing
  it("video should start auto playing after clicking watch button", () => {
    clickWatchButton();
    validateModalIsOpen();
    validateVideoIsAutoPlayingWhenModalOpens();
  });

  it("video should have the expected duration of 83-84 seconds", () => {
    clickWatchButton();
    validateModalIsOpen();
    validateVideoDuration();
  });

  it("when video is playing, clicking start/stop button should pause the video ", () => {
    clickWatchButton();
    validateModalIsOpen();
    // knowing video starts automatically
    clickYouTubeVideoPlayButton();
    validateVideoIsPaused();
  });

  it("when video is paused, clicking start/stop button should start the video ", () => {
    clickWatchButton();
    validateModalIsOpen();
    // knowing video starts automatically
    stopVideo();
    clickYouTubeVideoPlayButton();
    validateVideoIsPlaying();
  });

  it("when clicking close modal button, modal should be closed", () => {
    clickWatchButton();
    validateModalIsOpen();
    clickCloseModalButton();
    validateModalIsClosed();
  });
});
