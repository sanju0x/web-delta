const DOWNLOAD_URL = `https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=66448640&integration_type=0&scope=bot+applications.commands`;

const NOTICE = {
    title: "Notice",
    text: "Join our community now to access exclusive features, updates, and perks! Don't miss out—be a part of the experience!",
    color: "#efefef",
    background: "#222",
    icon: "info",
    confirmButtonText: "Understood",
};

const INVITESS = {
    title: '<p class="coregrad-string" style="font-weight: 600;font-size: 2rem;">Directing To Bot Invite Link</p>',
    text: "A new sort of feature has came up check the updates",
    icon: "success",
    color: "#efefef",
    background: "#222",
    showDenyButton: true,
    denyButtonColor: "#343434",
    denyButtonText: "Close",
};

// ------------------------------------------------------

// Main Video Background Ambient Setup

document.addEventListener("DOMContentLoaded", function() {
    const video = document.querySelector('.main-video video');
    const colorThief = new ColorThief();

    video.addEventListener('loadeddata', function() {
        // Function to update box shadow color
        function updateBoxShadow() {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dominantColor = colorThief.getColor(canvas);
            const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

            video.style.boxShadow = `0 0 70px 10px ${rgbColor}, 
                                      0 0 50px 10px rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.5)`;
        }

        setInterval(updateBoxShadow, 1);
    });
});
// ------------------------------------------------------

// ------------------------------------------------------

// Define the array of names directly in script.js
const names = [
    "Delta Music",
    "@Delta 4K",
    "Listen to the music",
    "4k music streaming",
    "@DELTA",
    "Music",
    "Spotify Streams",
    "Apple Music Streamers",
    "DJ Support",
    "Make An Room Of Music"
  ];
  
  // Function to get a random name from the names array
  function getRandomName() {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }
  
  // Function to simulate typing animation
  function typeAnimation(name) {
    const title = document.title;
    let typed = '';
    let deleting = true; // Flag to indicate if we are deleting or typing
    let index = 0; // Index for the current character
    const interval = setInterval(() => {
      if (deleting) {
        // Deleting characters
        if (typed.length > 0) {
          typed = typed.slice(0, -1); // Remove the last character
          document.title = typed; // Update the title
        } else {
          deleting = false; // Switch to typing mode
          index = 0; // Reset index for typing
        }
      } else {
        // Typing characters
        if (index < name.length) {
          typed += name[index]; // Add the next character
          document.title = typed; // Update the title
          index++; // Move to the next character
        } else {
          clearInterval(interval); // Stop the interval when done
        }
      }
    }, 100); // Adjust the speed of typing and deleting
  }
  
  // Function to change the document title to a random name with typing animation
  function changeTitleToRandomName() {
    const randomName = getRandomName(); // Get a random name from the array
    typeAnimation(randomName); // Simulate typing animation
  }
  
  // Set up interval to change title every 5 seconds
  setInterval(changeTitleToRandomName, 5000); // Change title every 5 seconds


// ------------------------------------------------------



// THE SCREEN
document.addEventListener("DOMContentLoaded", function() {
    const blurScreen = document.querySelector(".blur-screen");
    const centerText = document.querySelector(".center-text");
    const video = document.getElementById('video');
    const brandingImage = document.querySelector('.branding > img'); // Select the branding image

    centerText.addEventListener("click", function() {
        // Play the video
        video.play(); // Start playing the video when the center text is clicked
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling effect
        });

        // Fade out the blur screen
        blurScreen.style.opacity = "0"; // Fade out the blur screen
        setTimeout(() => {
            blurScreen.style.display = "none"; // Remove from view after fade out
        }, 500); // Delay to allow fade-out effect

        // Add animation class to the branding image
        brandingImage.classList.add('animate'); // Trigger the animation
    });

    // Video playback control (optional)
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play(); // Play the video if it's paused
        } else {
            video.pause(); // Pause the video if it's playing
        }
    });
});

  
// ------------------------------------------------------

function invitelink() {
    if (navigator.userAgent.indexOf("Win") != -1) {
        const url = DOWNLOAD_URL; // This can still be used if needed later
        Swal.fire(NOTICE).then(() => {
            Swal.fire(INVITESS).then((result) => {
                if (result.isConfirmed) {
                    // Directly navigate to the bot invite link
                    window.location.href = "https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=66448640&integration_type=0&scope=bot+applications.commands"; // Replace with actual bot invite link
                }
                Swal.close();
            });
            setTimeout(() => {
                window.location.href = url; // Optional: keep this if you still want to redirect after the Swal
            }, 1000);
        });
    } else {
        Swal.fire(INCOMPATIBLE_SWAL);
    }
}

function invitelink() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = DOWNLOAD_URL; // This can still be used if needed later

    if (isMobile) {
        // Directly redirect mobile users to the download URL
        window.location.href = url;
    } else {
        // For non-mobile users, show the alerts
        Swal.fire(NOTICE).then(() => {
            Swal.fire(INVITESS).then((result) => {
                if (result.isConfirmed) {
                    // Directly navigate to the bot invite link
                    window.location.href = "https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=66448640&integration_type=0&scope=bot+applications.commands"; // Replace with actual bot invite link
                }
                Swal.close();
            });
            setTimeout(() => {
                window.location.href = url; // Optional: keep this if you still want to redirect after the Swal
            }, 1000);
        });
    }
}
// ------------------------------------------------------

function openNav() {
    document.getElementById("myNav").style.height = "100%";
    document.getElementById("navbar-container").style.opacity = "0";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
    document.getElementById("navbar-container").style.opacity = "1";
}
// ------------------------------------------------------

function changeAbtModuleTo(name, next) {
    if (
        document.getElementsByClassName("module-array-img-selected").length != 0
    ) {
        document
            .getElementsByClassName("module-array-img-selected")[0]
            .classList.remove("module-array-img-selected");
    }
    next.classList.add("module-array-img-selected");

    const whole = document.getElementById("modules-interactive-info");
    const title = document.getElementById("about-module-info-header");
    const des = document.getElementById("about-module-info-description");
    const img = document.getElementById("about-module-info-img");

    whole.classList.add("toLeft");

    setTimeout(() => {
        title.innerHTML = name;
        des.innerHTML = module_list[name];
        img.src = "/img/Module/Card/" + name + ".png";
        whole.classList.remove("toLeft");
    }, 300);
}
// ------------------------------------------------------

function isElementInViewport(el) {
    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight ||
            document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <=
        (window.innerWidth ||
            document.documentElement.clientWidth) /* or $(window).width() */
    );
}
// ------------------------------------------------------

function onVisibilityChange(el, callback) {
    var old_visible;
    return function() {
        var visible = isElementInViewport(el);
        if (visible != old_visible) {
            old_visible = visible;
            if (typeof callback == "function") {
                callback(visible);
            }
        }
    };
}
/* -------------------------------------------------------------------------- */
/*                                   On load                                  */
/* -------------------------------------------------------------------------- */

window.onload = function() {
    var i = 0;
    for (const name in module_list) {
        var array_index = i >= 5 ? 2 : 1;
        document.getElementById("array-" + array_index).insertAdjacentHTML(
            "beforeend",
            `
		<img src="/img/Module/Icon/` +
            name +
            `.png" class="module-array-img" onclick="changeAbtModuleTo('` +
            name +
            `', this)"></img>
		`
        );
        i++;
    }
    const first = document.getElementById("array-1").firstElementChild;

    changeAbtModuleTo(Object.keys(module_list)[0], first);
};

const handler = onVisibilityChange(
    document.getElementById("dlbutton"),
    function(bool) {
        if (bool) {
            navdlbutton.classList.add("not-active");
        } else {
            navdlbutton.classList.remove("not-active");
        }
    }
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("body-container-visible");
        } else {
            entry.target.classList.remove("body-container-visible");
        }
    });
});

const navdlbutton = document.getElementById("nav-dlbutton");
const sections = document.querySelectorAll(".body-container");

sections.forEach((el) => observer.observe(el));

if (window.addEventListener) {
    addEventListener("DOMContentLoaded", handler, false);
    addEventListener("load", handler, false);
    addEventListener("scroll", handler, false);
    addEventListener("resize", handler, false);
} else if (window.attachEvent) {
    attachEvent("onDOMContentLoaded", handler); // Internet Explorer 9+ :(
    attachEvent("onload", handler);
    attachEvent("onscroll", handler);
    attachEvent("onresize", handler);
}

// ---------------------------THE END---------------------------
