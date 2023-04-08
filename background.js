chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "downloadImage") {
    chrome.downloads.download({url: request.url, filename: 'images-downloads/image.png', saveAs: false}, function(downloadId) {
      console.log("Download started with ID:" + downloadId);
    });
    sendResponse({message: "Image download started"});
  }
});

