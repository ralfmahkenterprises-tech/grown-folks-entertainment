(() => {
  "use strict";

  const moods = [
    {
      id: "velvet-hour",
      number: "01",
      initials: "VH",
      name: "Velvet Hour",
      eyebrow: "For the slow exhale",
      description:
        "Silky duets, unhurried basslines, and love songs that know when to leave a little space in the room.",
      setting: "Dinner becoming midnight",
      pulse: "Unhurried & intimate",
      promise: "Every note lands softly",
    },
    {
      id: "sunday-soul",
      number: "02",
      initials: "SS",
      name: "Sunday Soul",
      eyebrow: "For easing into the day",
      description:
        "Warm harmonies, lived-in voices, and bright grooves made for unhurried mornings and second cups.",
      setting: "Brunch with no end time",
      pulse: "Easy & sunlit",
      promise: "Soul without the rush",
    },
    {
      id: "two-step-gold",
      number: "03",
      initials: "2G",
      name: "Two-Step Gold",
      eyebrow: "For the room on its feet",
      description:
        "Crisp drums, confident hooks, and grown-up rhythm that turns a good room into a dance floor.",
      setting: "Friends moving the furniture",
      pulse: "Bright & assured",
      promise: "The pocket stays deep",
    },
    {
      id: "midnight-drive",
      number: "04",
      initials: "MD",
      name: "Midnight Drive",
      eyebrow: "For taking the long way home",
      description:
        "Smoky production, nocturnal vocals, and reflective records for when the road finally gets quiet.",
      setting: "Streetlights in the rearview",
      pulse: "Deep & cinematic",
      promise: "No skip-worthy moments",
    },
  ];

  const classicRnbTracks = [
    { id: "pNj9bXKGOiI", title: "Never Too Much", artist: "Luther Vandross", year: "1981" },
    { id: "PzpLkcfBe-A", title: "I Wanna Be Down", artist: "Brandy", year: "1994" },
    { id: "a02dBbBGSPg", title: "Back & Forth", artist: "Aaliyah", year: "1994" },
    { id: "LlZydtG3xqI", title: "Creep", artist: "TLC", year: "1994" },
    { id: "3KL9mRus19o", title: "No Diggity", artist: "Blackstreet", year: "1996" },
  ];

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    primaryNav.dataset.open = String(isOpen);
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  const moodPanel = document.querySelector(".mood-panel");
  const moodButtons = Array.from(document.querySelectorAll(".mood-tab"));

  const panelFields = {
    count: document.querySelector("[data-mood-count]"),
    initials: document.querySelector("[data-mood-initials]"),
    eyebrow: document.querySelector("[data-mood-eyebrow]"),
    name: document.querySelector("[data-mood-name]"),
    description: document.querySelector("[data-mood-description]"),
    setting: document.querySelector("[data-mood-setting]"),
    pulse: document.querySelector("[data-mood-pulse]"),
    promise: document.querySelector("[data-mood-promise]"),
  };

  const replayMoodAnimation = () => {
    const animatedElements = [
      document.querySelector(".mood-record"),
      document.querySelector(".mood-panel-copy"),
    ].filter(Boolean);

    animatedElements.forEach((element) => {
      element.style.animation = "none";
    });

    if (animatedElements[0]) void animatedElements[0].offsetWidth;

    animatedElements.forEach((element) => {
      element.style.animation = "";
    });
  };

  const selectMood = (index) => {
    const mood = moods[index];
    if (!mood || !moodPanel) return;

    moodButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.dataset.active = String(isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    moodPanel.dataset.mood = mood.id;
    moodPanel.setAttribute("aria-label", `${mood.name} mood details`);
    panelFields.count.textContent = `${mood.number} / 04`;
    panelFields.initials.textContent = mood.initials;
    panelFields.eyebrow.textContent = mood.eyebrow;
    panelFields.name.textContent = mood.name;
    panelFields.description.textContent = mood.description;
    panelFields.setting.textContent = mood.setting;
    panelFields.pulse.textContent = mood.pulse;
    panelFields.promise.textContent = mood.promise;

    replayMoodAnimation();
  };

  if (moodPanel && moodButtons.length === moods.length) {
    moodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectMood(Number(button.dataset.moodIndex));
      });
    });
  }

  const randomClassicButton = document.querySelector("[data-random-classic]");
  const playerFrame = document.querySelector("[data-player-frame]");
  const nowPlaying = document.querySelector("[data-now-playing]");
  const youtubeLink = document.querySelector("[data-youtube-link]");
  let lastTrackIndex = -1;

  const chooseRandomTrack = () => {
    let nextIndex = Math.floor(Math.random() * classicRnbTracks.length);
    if (classicRnbTracks.length > 1 && nextIndex === lastTrackIndex) {
      nextIndex = (nextIndex + 1) % classicRnbTracks.length;
    }
    lastTrackIndex = nextIndex;
    return classicRnbTracks[nextIndex];
  };

  if (randomClassicButton && playerFrame && nowPlaying && youtubeLink) {
    randomClassicButton.addEventListener("click", () => {
      const track = chooseRandomTrack();
      const watchUrl = `https://www.youtube.com/watch?v=${track.id}`;

      playerFrame.hidden = false;
      playerFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&rel=0&playsinline=1" title="${track.title} by ${track.artist}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      nowPlaying.textContent = `Now playing: ${track.artist} — ${track.title} (${track.year})`;
      youtubeLink.href = watchUrl;
      youtubeLink.hidden = false;
      randomClassicButton.innerHTML = '<span aria-hidden="true">↻</span> Play another classic';
    });
  }
})();
