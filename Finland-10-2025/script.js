const gallery = document.getElementById("gallery");
const player = document.getElementById("player");

document.getElementById("pictureFullScreen").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        player.requestFullscreen().catch(err => {
            console.error(`Fullscreen fout: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Initial rotation angle
let rotationAngle = 0;

// Rotate button event listener
var hasrotate = document.getElementById("pictureRotate90");
console.log("hasrotate" + hasrotate);

if (hasrotate != null) {
    hasrotate.addEventListener("click", () => {
        console.log("hook up rotate");
        
        // Update the rotation angle by 90 degrees, looping back after 360
        rotationAngle = (rotationAngle + 90) % 360;

        // Apply different translations based on the rotation angle
        let translateX = 0;
        let translateY = 0;

        // Calculate translation and rotation based on the angle
        switch (rotationAngle) {
            case 0:
                translateX = 0;
                translateY = 0;
                break;
            case 90:
                translateX = "0%";  // No horizontal shift
                translateY = "150px";  // Move up 50% to make the top the center of rotation
                break;
            case 180:
                translateX = 0;  // Move left 50% to simulate rotating around center
                translateY = 0;  // No vertical shift
                break;
            case 270:
                translateX = "0%";  // No horizontal shift
                translateY = "-150px";  // Move up 50% to make the top the center of rotation
                break;
        }

        // Apply the combined transform to rotate and translate smoothly
        player.style.transition = "transform 0.3s ease-in-out"; // Smooth transition
        player.style.transform = `rotate(${rotationAngle}deg) translate(${translateX}, ${translateY})`;
    });
}

let currentIndex = 0;

function fixPlayerAspect(img) {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (aspect >= 1) {
        player.style.aspectRatio = "16 / 9";
    } else {
        player.style.aspectRatio = "9 / 16";
    }
}

function showItem(index) {
    currentIndex = index;
    player.innerHTML = "";
    const item = items[index];

    if (item.kind === "youtube") {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${item.id}?autoplay=1`;
        iframe.allowFullscreen = true;
        player.appendChild(iframe);
        player.style.aspectRatio = "9 / 16";
    } else if (item.kind === "image") {
        const img = document.createElement("img");
        img.src = photoPath + item.url;
        img.alt = "Foto";
        img.onload = () => fixPlayerAspect(img);
        player.style.aspectRatio = "9 / 16";
        player.appendChild(img);
    }

    player.style.display = "flex";
    player.scrollIntoView({behavior: "smooth"});

    document.querySelectorAll(".thumb").forEach((thumb, i) => {
        if (i === index) {
            thumb.style.border = "3px solid #2a4d69";
            thumb.style.opacity = "1";
        } else {
            thumb.style.border = "none";
            thumb.style.opacity = "0.7";
        }
    });
}
// if no items, hide player.
if(items.length==0)
{
     let playerColumns = document.getElementsByClassName("player-column");
    
    // Assuming you only want to hide the first player-column
    if (playerColumns.length > 0) {
        playerColumns[0].style.display = "none";
    }
}


// thumbnails maken
items.forEach((item, index) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb " + (item.kind === "youtube" ? "youtube" : "");
    const src = item.kind === "youtube" 
        ? `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`
        : photoPath + item.url;
    thumb.innerHTML = `<img src="${src}" alt="thumb">`;
    thumb.addEventListener("click", () => showItem(index));
    gallery.appendChild(thumb);

if (item.kind === "image" && item.setAsBackground) {
    document.body.style.backgroundImage = `
        linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.5)),
        url(${photoPath + item.url})
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

});

// nav buttons
document.getElementById("prevBtn").addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(newIndex);
});
document.getElementById("nextBtn").addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % items.length;
    showItem(newIndex);
});

// eerste item tonen
if(items.length!=0)showItem(0);
