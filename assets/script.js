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
      youtube: "PLI4ctGLsZfcY",
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
      youtube: "PLTMn5T9QWFSU",
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
      youtube: "PLBUJOqniMWJk",
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
      youtube: "PLBwMUdvN5GpQ",
    },
  ];

  const classicRnbTracks = [
    { src: "./assets/music/after-the-love-has-gone.mp3", title: "After the Love Has Gone", artist: "Earth, Wind & Fire", year: "1979" },
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
  const moodRecord = document.querySelector("[data-record-player]");
  const recordState = document.querySelector("[data-record-state]");
  const directAudio = document.querySelector("[data-direct-audio]");

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

  const selectMood = (index, shouldAutoplay = false) => {
    const mood = moods[index];
    if (!mood || !moodPanel) return;

    moodButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.dataset.active = String(isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    moodPanel.dataset.mood = mood.id;
    moodPanel.setAttribute("aria-label", `${mood.name} mood details`);
    if (panelFields.count) panelFields.count.textContent = `${mood.number} / 04`;
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
        selectMood(Number(button.dataset.moodIndex), true);
      });
    });
  }

  if (moodRecord && directAudio) {
    const updateRecordState = (isPlaying) => {
      moodRecord.dataset.playing = String(isPlaying);
      moodRecord.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${classicRnbTracks[0].title} by ${classicRnbTracks[0].artist}`);
      if (recordState) recordState.textContent = isPlaying ? "Pause" : "Play";
    };

    moodRecord.addEventListener("click", async () => {
      if (directAudio.paused) {
        try { await directAudio.play(); } catch (_error) { updateRecordState(false); }
      } else {
        directAudio.pause();
      }
    });
    directAudio.addEventListener("play", () => updateRecordState(true));
    directAudio.addEventListener("pause", () => updateRecordState(false));
    directAudio.addEventListener("ended", () => updateRecordState(false));
    updateRecordState(false);
  }

})();
