addEventListener("keypress", function(event) {
	if (event.target.name !== "tags") {
		if (event.key === "n") {
			try {
				const curentUrl = window.location.href;
				const url = new URL(curentUrl);
				const displayedPage = url.searchParams.get("s");
				if (displayedPage == "list") {
					chrome.storage.local.set({'listUrl': curentUrl})
					const imageList = document.querySelectorAll('.image-list span');
					const imageArray = Array.from(imageList);
					const modifiedIdArray = Array.from(imageList).map(span => span.id.replace("s", ""));
					modifiedIdArray.unshift(0);
					chrome.storage.local.set({'modifiedIdArray': modifiedIdArray});
					console.log("Creating new list was successful. (" + imageArray.length + " entries)");
				} else {
					console.log("Error: this is not a post list.");
				};
			} catch {
				console.log("Something went wrong with creating a new list.")
			}
		};
		
		if (event.key === "a") {
			chrome.storage.local.get('modifiedIdArray', function(result) {
				const idArray = result.modifiedIdArray
				if (idArray != undefined) {
					const curentUrl = window.location.href;
					const url = new URL(curentUrl);
					const displayedPage = url.searchParams.get("s");
					if (displayedPage == "list") {
						chrome.storage.local.set({'listUrl': curentUrl})
						const imageList = document.querySelectorAll('.image-list span');
						const imageArray = Array.from(imageList);
						const anotherIdArray = Array.from(imageList).map(span => span.id.replace("s", ""));
						const resultedIdArray = idArray.concat(anotherIdArray)
						const resultedIdArrayTrueLenght = resultedIdArray.length - 1
						console.log("Addeding new items to the list was successful. (" + resultedIdArrayTrueLenght + " entries)")
						chrome.storage.local.set({'modifiedIdArray': resultedIdArray})
					} else {
						console.log("Error: this is not a post list.");
					};
				} else {
					console.log("Error: list not found.")
				}
			})
		}
		
		if (event.key === "q") {
			chrome.storage.local.get('modifiedIdArray', function(result) {
				let idArray = result.modifiedIdArray
				if (idArray != undefined) {
					const veiwingLocation = idArray.shift()
					console.log(idArray)
					console.log("Veiwing location: " + veiwingLocation)
				} else {
					console.log("Error: list not found.s")
				}
			})
		}

		if (event.key === "l") {
			try {
				chrome.storage.local.get('modifiedIdArray', function(result) {
					let idArray = result.modifiedIdArray
					if (idArray != undefined) {
						let veiwingLocation = idArray.shift()
						let veiwingLocationClon = veiwingLocation
						if (veiwingLocation == 0) {
							veiwingLocationClon = 0
						}
						if (veiwingLocation < idArray.length) {
							veiwingLocation++
						} else {
							console.log("End was reached.")
							chrome.storage.local.get(["listUrl"], function(listUrl) {	
								window.location.href = listUrl.listUrl
							})
						}
						const newUrl = "https://rule34.xxx/index.php?page=post&s=view&id=" + idArray[veiwingLocationClon]
						idArray.unshift(veiwingLocation)
						chrome.storage.local.set({'modifiedIdArray': idArray});
						console.log(newUrl)
						console.log(veiwingLocation)
						window.location.href = newUrl
					} else {
						console.log("No stored list.")
					}
				});
			} catch (error) {
				console.log(error)
			};
		}
		
		if (event.key === "k") {
			try {
				chrome.storage.local.get('modifiedIdArray', function(result) {
					let idArray = result.modifiedIdArray
					if (idArray != undefined) {
						let veiwingLocation = idArray.shift()
						if (veiwingLocation > 0) {
							veiwingLocation--
						}
						const newUrl = "https://rule34.xxx/index.php?page=post&s=view&id=" + idArray[veiwingLocation]
						idArray.unshift(veiwingLocation)
						chrome.storage.local.set({'modifiedIdArray': idArray});
						console.log(newUrl)
						console.log(veiwingLocation)
						window.location.href = newUrl
					} else {
						console.log("No stored list.")
					}
				});
			} catch (error) {
				console.log(error)
			};
		}

		
		if (event.key === "r") {
			chrome.storage.local.remove("modifiedIdArray", function() {});
			console.log("Data removed.")
		}
		
		if (event.key === "j") {
			scrollIntoVeiwImg()
		}
		
		if (event.key === "m") {
			imgOpenSrc()
		}
		
		if (event.key === "p") {
			playVideo()
		}
		
		if (event.key === "b") {
			if (checkViewedPageType() == "view") {
				const images = document.querySelectorAll("img")
				const imageUrl = images[2].src
				addToFavorites()
				chrome.runtime.sendMessage({action: "downloadImage", url: imageUrl}, function(response) {
				  console.log(response);
				});
			}
		}
		
		if (event.key === "d") {
			if (checkViewedPageType() == "view") {
				const images = document.querySelectorAll("img")
				const imageUrl = images[2].src
				chrome.runtime.sendMessage({action: "downloadImage", url: imageUrl}, function(response) {
				  console.log(response);
				});
			}
		}
		
		if (event.key === "h") {
			const infoTitle = "██╗███╗░░██╗███████╗░█████╗░\n██║████╗░██║██╔════╝██╔══██╗\n██║██╔██╗██║█████╗░░██║░░██║\n██║██║╚████║██╔══╝░░██║░░██║\n██║██║░╚███║██║░░░░░╚█████╔╝\n╚═╝╚═╝░░╚══╝╚═╝░░░░░░╚════╝░"
			console.info(infoTitle + "\nHow it works: Go to list of post (searching) and create new list (N) after that move forward in the list (L) that shows the first post. Get it? \nN: create new list \nA: add new items to the existing list \nL: move forvard in the list\nK: to move backwords \nJ: scroll down to the image \nM: open the image \nP: play video \nQ: console.log id array and veiwing location \nH: show this list")
		}
		
		if (event.key === "f") {
			addToFavorites()
		}
		
		if (event.key === " ") {
			window.location.href = "https://google.com/"
		}
	}
});

function checkViewedPageType() {
	const curentUrl = window.location.href;
	const url = new URL(curentUrl);
	const displayedPage = url.searchParams.get("s");
	return displayedPage;
}

function addToFavorites() {
	if (checkViewedPageType() == "view") {
		const addToFavoritesLink = document.querySelector('a[onclick*="post_vote"][onclick*="addFav"]');
		if (addToFavoritesLink) {
			addToFavoritesLink.click()
			console.log("Post add to your favorites.")
		}
	} else {
		console.log("Erro: this is not a view page.")
	}
}

function imgOpenSrc() {
	const curentUrl = window.location.href;
	const url = new URL(curentUrl);
	const displayedPage = url.searchParams.get("s");

	if (displayedPage == "view") {
		try {
			const images = document.querySelectorAll("img")
			chrome.storage.local.set({"oreginalUrl": window.location.href	});
			window.location.href = images[2].src
		} catch {
			console.log("No image found.")
		}
	}
}

var openSrc = false
addEventListener("load", (event) => {
	if (openSrc == true) {
		imgOpenSrc()
	}
});

function getTheImage() {
	const image = getElementById("image")
	return image
}

function scrollIntoVeiwImg() {
	try {
		const images = document.querySelector("#image")
		images.scrollIntoView()
	} catch (error) {
		console.log("No image found.")
	}
}

function playVideo() {
	try {
		const videos = document.querySelector("video")
		videos.click()
	} catch (error) {
		console.log("No video player found.")
	}
}

function downloadImg(src) {
	if (checkViewedPageType() == "view") {
		try {
			chrome.downloads.download({
				url: src,
				filename: null
			}, function(downloadId) {
				console.log("Download started with ID:" + downloadId)
			})
		} catch (err) {
			console.log(err)
		}
	}
}

addEventListener("load", () => {
	try {	
		const banner = getElementById("pv_leaderboard")
		banner.style.display = "none"
	} catch (err) {}
})

// Coded by 00p11

console.log("░░░░░░░░░░░░░░░░░░░░░░░░░  ░█▀▀█ █──█ █── █▀▀ 　 █▀▀█ ─█▀█─ ░░░░░░░\n░░░░░░░░░░░░░░░░░░░░░░░░░  ░█▄▄▀ █──█ █── █▀▀ 　 ──▀▄ █▄▄█▄ ░░░░░░░\nExtention Key bindings for ░█─░█ ─▀▀▀ ▀▀▀ ▀▀▀ 　 █▄▄█ ───█─ loaded.");
console.log("Extention key bindings for rule 34 loaded.")