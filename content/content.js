console.log("YT Learning Captions: content script injected");

let currentUrl = location.href;
//YouTube is a Single Page App (SPA) → URL changes without reload
let videoElement = null;

//* Utility: wait for an element to appear
/*
YouTube loads elements asynchronously, so you can’t just do:
    document.querySelector("video")
*/
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error("Timeout waiting for element: " + selector));
      }
    }, 300);
  });
}

//* Called whenever a new video page is detected
async function onVideoPageReady() {
  console.log("YT Captions: waiting for video element...");

  try {
    videoElement = await waitForElement("video");
    console.log("YT Captions: video element found", videoElement);

    //Future caption logic will start from here
  } catch (err) {
    console.warn(err.message);
  }
}

//* Detect URL changes (YouTube SPA navigation)
function monitorUrlChanges() {
  setInterval(() => {
    if (location.href !== currentUrl) {
      const oldUrl = currentUrl;
      currentUrl = location.href;

      console.log("YT URL changed:");
      console.log("FROM:", oldUrl);
      console.log("TO:", currentUrl);

      if (currentUrl.includes("/watch")) {
        onVideoPageReady();
      }
    }
  }, 500);
}

//* Initial load
if (location.href.includes("/watch")) {
  onVideoPageReady();
}

monitorUrlChanges();
