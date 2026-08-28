(() => {
  "use strict";

  const API_URL = "https://grown-folks-online-demo.ralf-mahkenterprises.chatgpt.site/api/events";
  const DENVER_TIME_ZONE = "America/Denver";
  const timeElement = document.querySelector("[data-mst-time]");
  const dateElement = document.querySelector("[data-mst-date]");
  const monthElement = document.querySelector("[data-calendar-month]");
  const gridElement = document.querySelector("[data-calendar-grid]");
  const listElement = document.querySelector("[data-events-list]");
  const prevButton = document.querySelector("[data-calendar-prev]");
  const nextButton = document.querySelector("[data-calendar-next]");
  const todayButton = document.querySelector("[data-calendar-today]");

  if (!gridElement || !listElement || !monthElement) return;

  const denverParts = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: DENVER_TIME_ZONE, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(date);
    const value = (type) => Number(parts.find((part) => part.type === type)?.value);
    return { year: value("year"), month: value("month") - 1, day: value("day") };
  };

  const today = denverParts();
  let visibleYear = today.year;
  let visibleMonth = today.month;
  let events = [];

  const pad = (value) => String(value).padStart(2, "0");
  const dateKey = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;
  const eventDenverDate = (iso) => { const parts = denverParts(new Date(iso)); return dateKey(parts.year, parts.month, parts.day); };
  const formatDenverTime = (iso) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: DENVER_TIME_ZONE }).format(new Date(iso));
  const formatDenverZone = (iso) => new Intl.DateTimeFormat("en-US", { timeZone: DENVER_TIME_ZONE, timeZoneName: "short" }).formatToParts(new Date(iso)).find((part) => part.type === "timeZoneName")?.value || "Denver time";

  const updateClock = () => {
    const now = new Date();
    if (timeElement) timeElement.textContent = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true, timeZone: DENVER_TIME_ZONE }).format(now);
    if (dateElement) dateElement.textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: DENVER_TIME_ZONE }).format(now);
  };

  const renderCalendar = () => {
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(visibleYear, visibleMonth, 1)));
    monthElement.textContent = monthName;
    gridElement.innerHTML = "";
    const firstWeekday = new Date(Date.UTC(visibleYear, visibleMonth, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(visibleYear, visibleMonth + 1, 0)).getUTCDate();

    for (let i = 0; i < firstWeekday; i += 1) {
      const blank = document.createElement("span");
      blank.className = "calendar-day calendar-day-empty";
      gridElement.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = dateKey(visibleYear, visibleMonth, day);
      const dayEvents = events.filter((event) => eventDenverDate(event.startsAtUtc) === key);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "calendar-day";
      cell.dataset.today = String(key === dateKey(today.year, today.month, today.day));
      cell.dataset.hasEvents = String(dayEvents.length > 0);
      cell.innerHTML = `<span>${day}</span>${dayEvents.length ? `<i aria-hidden="true"></i><small>${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}</small>` : ""}`;
      cell.setAttribute("aria-label", dayEvents.length ? `${monthName} ${day}, ${dayEvents.length} events` : `${monthName} ${day}`);
      if (dayEvents.length) cell.addEventListener("click", () => renderEventList(dayEvents));
      gridElement.appendChild(cell);
    }
  };

  const renderEventList = (items = events) => {
    if (!items.length) {
      listElement.innerHTML = '<p class="events-status">No future events are published yet. Check back soon.</p>';
      return;
    }
    listElement.innerHTML = items.map((event) => {
      const date = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: DENVER_TIME_ZONE }).format(new Date(event.startsAtUtc));
      const end = event.endsAtUtc ? `–${formatDenverTime(event.endsAtUtc)}` : "";
      return `<article class="event-card"><time datetime="${event.startsAtUtc}">${date}<strong>${formatDenverTime(event.startsAtUtc)}${end} ${formatDenverZone(event.startsAtUtc)}</strong></time><h3>${escapeHtml(event.title)}</h3>${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}${event.venue ? `<div class="event-place"><strong>${escapeHtml(event.venue)}</strong>${event.address ? `<span>${escapeHtml(event.address)}</span>` : ""}</div>` : ""}</article>`;
    }).join("");
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);

  const loadEvents = async () => {
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Events are temporarily unavailable");
      const data = await response.json();
      events = Array.isArray(data.events) ? data.events : [];
      renderCalendar();
      renderEventList();
    } catch (error) {
      listElement.innerHTML = `<p class="events-status">${escapeHtml(error.message || "Unable to load events")}</p>`;
      renderCalendar();
    }
  };

  prevButton?.addEventListener("click", () => { visibleMonth -= 1; if (visibleMonth < 0) { visibleMonth = 11; visibleYear -= 1; } renderCalendar(); });
  nextButton?.addEventListener("click", () => { visibleMonth += 1; if (visibleMonth > 11) { visibleMonth = 0; visibleYear += 1; } renderCalendar(); });
  todayButton?.addEventListener("click", () => { visibleYear = today.year; visibleMonth = today.month; renderCalendar(); renderEventList(); });

  updateClock();
  setInterval(updateClock, 1000);
  renderCalendar();
  loadEvents();
})();
