// ========== LocalStorage ==========
const STORAGE_KEY = "universityScheduleData";
const CLIPBOARD_KEY = "universityClipboard";
const FIRST_VISIT_KEY = "firstVisit";
const POMODORO_SETTINGS_KEY = "pomodoroSettings";
const POMODORO_STATS_KEY = "pomodoroStats";

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ========== Clipboard ==========
let clipboard = (() => {
  try {
    return JSON.parse(localStorage.getItem(CLIPBOARD_KEY) || "null");
  } catch {
    return null;
  }
})();
function saveClipboard(data) {
  clipboard = data;
  localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(data));
}

// ========== Render ==========
function renderSavedClasses() {
  const saved = loadFromStorage();
  document.querySelectorAll(".class-cell").forEach((cell) => {
    const key = `${cell.dataset.day}-${cell.dataset.time}`;
    const info = saved[key];
    if (info?.subject) fillCell(cell, info.subject, info.exam, info.room);
  });
}

// ========== Cell Fill / Clear ==========
function fillCell(cell, subject, exam, room) {
  cell.querySelector(".subject").textContent = subject;
  cell.querySelector(".exam").textContent = `امتحان: ${exam}`;
  cell.querySelector(".room").textContent = `کلاس: ${room}`;
  cell.querySelector(".class-content").style.display = "flex";
  cell.querySelector(".add-class-btn").style.display = "none";
  cell.classList.add("has-class");
  makeDraggable(cell);
  addOverlay(cell);
  updateNotificationIconVisibility();
}
function clearCell(cell) {
  cell.querySelector(".subject").textContent = "";
  cell.querySelector(".exam").textContent = "";
  cell.querySelector(".room").textContent = "";
  cell.querySelector(".class-content").style.display = "none";
  cell.querySelector(".add-class-btn").style.display = "flex";
  cell.classList.remove("has-class");
  cell.draggable = false;
  cell.style.height = "";
  cell.style.width = "";
  cell.style.transform = "";
  removeOverlay(cell);
  removePasteButton(cell);
  updateNotificationIconVisibility();

  if (clipboard) {
    addPasteButton(cell);
  }
}

// ========== Overlay (حذف / ویرایش / کپی) ==========
function addOverlay(cell) {
  removeOverlay(cell);
  cell.querySelectorAll(".delete-btn").forEach((b) => b.remove());
  if (!cell.classList.contains("has-class")) return;

  const overlay = document.createElement("div");
  overlay.className = "cell-overlay";

  const delBtn = document.createElement("button");
  delBtn.textContent = "حذف";
  delBtn.className = "ovl-btn del";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    const key = `${cell.dataset.day}-${cell.dataset.time}`;
    const saved = loadFromStorage();
    delete saved[key];
    saveToStorage(saved);
    clearCell(cell);
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "ویرایش";
  editBtn.className = "ovl-btn edit";
  editBtn.onclick = (e) => {
    e.stopPropagation();
    currentCell = cell;
    const sub = cell.querySelector(".subject").textContent;
    const ex = cell.querySelector(".exam").textContent.replace("امتحان: ", "");
    const rm = cell.querySelector(".room").textContent.replace("کلاس: ", "");
    document.getElementById("subjectName").value = sub;
    document.getElementById("examDate").value = ex;
    document.getElementById("roomNumber").value = rm;
    document.querySelector('#classForm button[type="submit"]').textContent =
      "ویرایش";
    modal.style.display = "block";
  };

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "کپی";
  copyBtn.className = "ovl-btn copy";
  copyBtn.onclick = (e) => {
    e.stopPropagation();
    const sub = cell.querySelector(".subject").textContent;
    const ex = cell.querySelector(".exam").textContent.replace("امتحان: ", "");
    const rm = cell.querySelector(".room").textContent.replace("کلاس: ", "");
    saveClipboard({ subject: sub, exam: ex, room: rm });
    copyBtn.textContent = "✓";
    setTimeout(() => (copyBtn.textContent = "کپی"), 1000);
    document
      .querySelectorAll(".class-cell:not(.has-class)")
      .forEach(addPasteButton);
  };

  overlay.append(delBtn, editBtn, copyBtn);
  cell.append(overlay);
}
function removeOverlay(cell) {
  cell.querySelectorAll(".cell-overlay").forEach((o) => o.remove());
}

// ========== Paste Button for Empty Cells ==========
function addPasteButton(cell) {
  if (cell.classList.contains("has-class")) return;
  if (cell.querySelector(".paste-empty-btn")) return;
  if (!clipboard) return;
  const pasteBtn = document.createElement("button");
  pasteBtn.textContent = "الصاق";
  pasteBtn.className = "paste-empty-btn";
  pasteBtn.onclick = (e) => {
    e.stopPropagation();
    fillCell(cell, clipboard.subject, clipboard.exam, clipboard.room);
    const key = `${cell.dataset.day}-${cell.dataset.time}`;
    const saved = loadFromStorage();
    saved[key] = { ...clipboard };
    saveToStorage(saved);
  };
  cell.append(pasteBtn);
}
function removePasteButton(cell) {
  cell.querySelectorAll(".paste-empty-btn").forEach((b) => b.remove());
}

// ========== Modal ==========
let currentCell = null;
const modal = document.getElementById("classModal");
const form = document.getElementById("classForm");
const submitBtn = form.querySelector('button[type="submit"]');
const closeModal = () => {
  modal.style.display = "none";
  form.reset();
  submitBtn.textContent = "افزودن درس";
};
document.querySelector(".close").onclick = closeModal;
window.onclick = (e) => {
  if (e.target === modal) closeModal();
};

/* Add class */
document.querySelectorAll(".add-class-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentCell = btn.closest(".class-cell");
    submitBtn.textContent = "افزودن درس";
    modal.style.display = "block";
  });
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentCell) return;
  const subject = form.subjectName.value.trim();
  const exam = form.examDate.value.trim();
  const room = form.roomNumber.value.trim();
  if (subject && exam && room) {
    fillCell(currentCell, subject, exam, room);
    const key = `${currentCell.dataset.day}-${currentCell.dataset.time}`;
    const saved = loadFromStorage();
    saved[key] = { subject, exam, room };
    saveToStorage(saved);
    closeModal();
  }
});

// ========== Drag & Drop ==========
function makeDraggable(cell) {
  cell.draggable = true;
  cell.addEventListener("dragstart", (e) => {
    const key = `${cell.dataset.day}-${cell.dataset.time}`;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
    cell.style.opacity = "0.4";
  });
  cell.addEventListener("dragend", () => (cell.style.opacity = ""));
}
document.querySelectorAll(".class-cell").forEach((target) => {
  target.addEventListener("dragover", (e) => {
    if (target.classList.contains("class-cell")) {
      e.preventDefault();
      target.style.background = "rgba(52,152,219,0.3)";
    }
  });
  target.addEventListener("dragleave", () => (target.style.background = ""));
  target.addEventListener("drop", (e) => {
    e.preventDefault();
    target.style.background = "";
    const srcKey = e.dataTransfer.getData("text/plain");
    const srcCell = document.querySelector(
      `[data-day="${srcKey.split("-")[0]}"][data-time="${srcKey
        .split("-")
        .slice(1)
        .join("-")}"]`
    );
    if (!srcCell || srcCell === target) return;

    const saved = loadFromStorage();
    const data = saved[srcKey];
    if (!data) return;

    delete saved[srcKey];
    clearCell(srcCell);
    const dstKey = `${target.dataset.day}-${target.dataset.time}`;
    saved[dstKey] = data;
    fillCell(target, data.subject, data.exam, data.room);
    saveToStorage(saved);

    updateNotificationIconVisibility();
  });
});

// ========== Hover FX ==========
document.querySelectorAll(".class-cell").forEach((c) => {
  c.addEventListener(
    "mouseenter",
    () => (c.style.transform = "translateY(-2px)")
  );
  c.addEventListener("mouseleave", () => (c.style.transform = "translateY(0)"));
});

// ========== Init ==========
renderSavedClasses();
document.querySelectorAll(".class-cell").forEach((c) => {
  addOverlay(c);
  addPasteButton(c);
});

const todoForm = document.querySelector(".todo-form");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const TODO_KEY = "todoList";

let todos = JSON.parse(localStorage.getItem(TODO_KEY) || "[]");
let currentEditIndex = -1;

function saveTodos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function formatDateTime() {
  const now = new Date();
  const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
  const persianDate = now.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("fa-IR", options);
  return `${persianDate} - ${timeStr}`;
}

/* ========== توابع افکت‌های جدید برای تسک‌ها ========== */
function createRipple(event, element) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";

  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function createProgressFill(element) {
  const progressFill = document.createElement("div");
  progressFill.classList.add("progress-fill");
  element.appendChild(progressFill);

  setTimeout(() => {
    progressFill.style.width = "100%";
  }, 10);

  setTimeout(() => {
    progressFill.remove();
  }, 500);
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    if (currentEditIndex === index) {
      li.innerHTML = `
              <div class="todo-content">
                <div class="todo-main">
                  <div class="todo-edit-actions">
                    <button class="todo-save-btn">✓</button>
                    <button class="todo-cancel-btn">×</button>
                  </div>
                  <input type="text" class="todo-edit-input" value="${
                    todo.text
                  }" />
                </div>
                <div class="todo-meta">${todo.addedDate || ""}</div>
              </div>
            `;

      const input = li.querySelector(".todo-edit-input");
      input.focus();
      input.select();

      li.querySelector(".todo-save-btn").onclick = () => {
        const newText = input.value.trim();
        if (newText) {
          todos[index].text = newText;
          saveTodos();
        }
        currentEditIndex = -1;
        renderTodos();
      };

      li.querySelector(".todo-cancel-btn").onclick = () => {
        currentEditIndex = -1;
        renderTodos();
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          li.querySelector(".todo-save-btn").click();
        } else if (e.key === "Escape") {
          li.querySelector(".todo-cancel-btn").click();
        }
      });
    } else {
      li.innerHTML = `
              <div class="todo-content">
                <div class="todo-main">
                  <span class="todo-text" title="${todo.text}">${
        todo.text
      }</span>
                </div>
                <div class="todo-meta">${todo.addedDate || ""}</div>
              </div>
              <div class="todo-overlay">
                <button class="ovl-todo ${
                  todo.done ? "undone" : "done"
                }" title="${todo.done ? "انجام نشد" : "انجام شد"}">${
        todo.done ? "↶" : "✓"
      }</button>
                ${
                  !todo.done
                    ? '<button class="ovl-todo edit" title="ویرایش">&#9998;</button>'
                    : ""
                }
                <button class="ovl-todo delete" title="حذف">&times;</button>
              </div>
            `;

      const txt = li.querySelector(".todo-text");
      const doneBtn = li.querySelector(".ovl-todo.done, .ovl-todo.undone");
      const editBtn = li.querySelector(".ovl-todo.edit");
      const delBtn = li.querySelector(".ovl-todo.delete");

      txt.onclick = (e) => {
        createRipple(e, li);
        createProgressFill(li);
        li.classList.add("completing");

        todo.done = !todo.done;

        setTimeout(() => {
          li.classList.toggle("done");
          li.classList.remove("completing");
          saveTodos();
          renderTodos();
        }, 500);
      };

      doneBtn.onclick = (e) => {
        e.stopPropagation();
        createRipple(e, li);
        createProgressFill(li);
        li.classList.add("completing");

        todo.done = !todo.done;

        setTimeout(() => {
          li.classList.toggle("done");
          li.classList.remove("completing");
          saveTodos();
          renderTodos();
        }, 500);
      };

      if (editBtn) {
        editBtn.onclick = () => {
          currentEditIndex = index;
          renderTodos();
        };
      }

      delBtn.onclick = () => {
        if (confirm("حذف شود؟")) {
          createRipple(event, li);
          setTimeout(() => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
          }, 500);
        }
      };
    }

    todoList.appendChild(li);
  });
  
  // Add fade-in animation to todo items
  document.querySelectorAll(".todo-item").forEach((item, index) => {
    item.classList.add("fade-in", `fade-in-delay-${(index % 4) + 1}`);
    if (isInViewport(item)) {
      item.classList.add("visible");
    }
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, done: false, addedDate: formatDateTime() });
  saveTodos();
  renderTodos();
  todoInput.value = "";
});

renderTodos();

// ========== تاریخ و زمان شمسی ==========
function updateDateTime() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const persianDateTime = now.toLocaleDateString("fa-IR", options);
  document.getElementById("datetimeDisplay").textContent = persianDateTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ========== تایمر پومودورو - طراحی جدید با ویژگی‌های جدید ==========
let pomodoroInterval = null;
// مقداردهی اولیه با استفاده از تنظیمات ذخیره شده
const initialSettings = loadPomodoroSettings();
let pomodoroTimeLeft = initialSettings.work * 60;
let pomodoroMode = "work";
let pomodoroRunning = false;
let consecutiveWorkSessions = 0;

function loadPomodoroSettings() {
  try {
    const settings = JSON.parse(
      localStorage.getItem(POMODORO_SETTINGS_KEY) || '{"work":25,"break":5}'
    );
    return settings;
  } catch {
    return { work: 25, break: 5 };
  }
}

function savePomodoroSettings(settings) {
  localStorage.setItem(POMODORO_SETTINGS_KEY, JSON.stringify(settings));
}

function loadPomodoroStats() {
  try {
    const stats = JSON.parse(
      localStorage.getItem(POMODORO_STATS_KEY) ||
        '{"today":0,"totalMinutes":0,"points":0}'
    );
    return stats;
  } catch {
    return { today: 0, totalMinutes: 0, points: 0 };
  }
}

function savePomodoroStats(stats) {
  localStorage.setItem(POMODORO_STATS_KEY, JSON.stringify(stats));
}

function updatePomodoroStats() {
  const stats = loadPomodoroStats();
  document.getElementById("todayPomodoros").textContent = stats.today;
  document.getElementById("todayMinutes").textContent = stats.totalMinutes;

  // به‌روزرسانی مدال‌ها
  if (stats.today >= 4) {
    document.getElementById("achievement1").classList.add("earned");
  }
  if (stats.today >= 8) {
    document.getElementById("achievement2").classList.add("earned");
  }
  if (stats.today >= 12) {
    document.getElementById("achievement3").classList.add("earned");
  }
}

function resetDailyStats() {
  const stats = loadPomodoroStats();
  const today = new Date().toLocaleDateString("fa-IR");
  const lastReset = stats.lastReset || "";

  if (lastReset !== today) {
    // اگر روز جدیدی شروع شده، آمار روز را ریست می‌کنیم
    stats.today = 0;
    stats.totalMinutes = 0;
    stats.lastReset = today;
    savePomodoroStats(stats);
    updatePomodoroStats();

    // ریست کردن مدال‌ها
    document.getElementById("achievement1").classList.remove("earned");
    document.getElementById("achievement2").classList.remove("earned");
    document.getElementById("achievement3").classList.remove("earned");
  }
}

function clearPomodoroStats() {
  if (confirm("آیا از پاک کردن آمار مطالعه مطمئن هستید؟")) {
    localStorage.removeItem(POMODORO_STATS_KEY);
    updatePomodoroStats();

    // ریست کردن مدال‌ها
    document.getElementById("achievement1").classList.remove("earned");
    document.getElementById("achievement2").classList.remove("earned");
    document.getElementById("achievement3").classList.remove("earned");

    showNotification("آمار پاک شد", "تمام آمار مطالعه امروز پاک شد");
  }
}

const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroModeDisplay = document.getElementById("pomodoroMode");
const pomodoroStartBtn = document.getElementById("pomodoroStart");
const pomodoroResetBtn = document.getElementById("pomodoroReset");
const pomodoroSettingsBtn = document.getElementById("pomodoroSettings");
const progressCircle = document.getElementById("progress-circle");

const radius = 90;
const circumference = 2 * Math.PI * radius;

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomodoroTimeLeft / 60);
  const seconds = pomodoroTimeLeft % 60;
  pomodoroDisplay.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const totalTime =
    pomodoroMode === "work"
      ? loadPomodoroSettings().work * 60
      : loadPomodoroSettings().break * 60;
  const progress = (totalTime - pomodoroTimeLeft) / totalTime;
  const offset = circumference - progress * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

function startPomodoro() {
  if (pomodoroRunning) return;

  pomodoroRunning = true;
  pomodoroStartBtn.innerHTML =
    '<svg style="width: 34px; height:34px; text-align: center;" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clip-rule="evenodd" /></svg><span class="pomodoro-tooltip">توقف تایمر</span>';

  pomodoroInterval = setInterval(() => {
    pomodoroTimeLeft--;
    updatePomodoroDisplay();

    if (pomodoroTimeLeft <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroRunning = false;
      pomodoroStartBtn.innerHTML =
        '▶<span class="pomodoro-tooltip">شروع تایمر</span>';

      if (pomodoroMode === "work") {
        // به‌روزرسانی آمار
        const stats = loadPomodoroStats();

        stats.today++;
        stats.totalMinutes += loadPomodoroSettings().work;
        stats.points += loadPomodoroSettings().work; // هر دقیقه یک امتیاز

        consecutiveWorkSessions++;

        savePomodoroStats(stats);
        updatePomodoroStats();

        // بررسی مدال‌ها
        if (consecutiveWorkSessions >= 4) {
          showNotification("وقت استراحت بلندتره", "🍵 برو یه چایی بخور!");
          consecutiveWorkSessions = 0;
        }

        // تغییر به حالت استراحت
        pomodoroMode = "break";
        pomodoroTimeLeft = loadPomodoroSettings().break * 60;
        pomodoroModeDisplay.textContent = "استراحت";
        pomodoroModeDisplay.classList.add("break");
        progressCircle.classList.add("break");

        showNotification("زمان استراحت!", "۵ دقیقه استراحت کنید");
      } else {
        // تغییر به حالت کار
        pomodoroMode = "work";
        pomodoroTimeLeft = loadPomodoroSettings().work * 60;
        pomodoroModeDisplay.textContent = "کار";
        pomodoroModeDisplay.classList.remove("break");
        progressCircle.classList.remove("break");

        showNotification("زمان کار!", "زمان شروع دور بعدی کار است");
      }

      updatePomodoroDisplay();
    }
  }, 1000);
}

function stopPomodoro() {
  if (!pomodoroRunning) return;

  clearInterval(pomodoroInterval);
  pomodoroRunning = false;
  pomodoroStartBtn.innerHTML =
    '▶<span class="pomodoro-tooltip">شروع تایمر</span>';
}

function resetPomodoro() {
  stopPomodoro();
  pomodoroMode = "work";
  pomodoroTimeLeft = loadPomodoroSettings().work * 60;
  pomodoroModeDisplay.textContent = "کار";
  pomodoroModeDisplay.classList.remove("break");
  progressCircle.classList.remove("break");
  updatePomodoroDisplay();
}

pomodoroStartBtn.addEventListener("click", () => {
  if (pomodoroRunning) {
    stopPomodoro();
  } else {
    startPomodoro();
  }
});

pomodoroResetBtn.addEventListener("click", resetPomodoro);

// دکمه پاک کردن آمار
document
  .getElementById("clearStatsBtn")
  .addEventListener("click", clearPomodoroStats);

const pomodoroSettingsModal = document.getElementById("pomodoroSettingsModal");
const workDurationInput = document.getElementById("workDuration");
const breakDurationInput = document.getElementById("breakDuration");
const saveSettingsBtn = document.getElementById("saveSettings");
const cancelSettingsBtn = document.getElementById("cancelSettings");

pomodoroSettingsBtn.addEventListener("click", () => {
  const settings = loadPomodoroSettings();
  workDurationInput.value = settings.work;
  breakDurationInput.value = settings.break;
  pomodoroSettingsModal.style.display = "block";
});

document.querySelector("#pomodoroSettingsModal .close").onclick = () => {
  pomodoroSettingsModal.style.display = "none";
};

cancelSettingsBtn.addEventListener("click", () => {
  pomodoroSettingsModal.style.display = "none";
});

saveSettingsBtn.addEventListener("click", () => {
  const workDuration = parseInt(workDurationInput.value);
  const breakDuration = parseInt(breakDurationInput.value);

  if (workDuration > 0 && breakDuration > 0) {
    const settings = { work: workDuration, break: breakDuration };
    savePomodoroSettings(settings);

    // به‌روزرسانی زمان فعلی تایمر اگر در حال اجرا نیست
    if (!pomodoroRunning) {
      pomodoroTimeLeft = workDuration * 60;
      updatePomodoroDisplay();
    }

    pomodoroSettingsModal.style.display = "none";
    showNotification("تنظیمات ذخیره شد", "زمان‌های جدید اعمال شدند");
  }
});

progressCircle.style.strokeDasharray = circumference;
updatePomodoroDisplay();
updatePomodoroStats();
resetDailyStats();

// ========== نوتیفیکشن سفارشی ==========
const notificationBar = document.getElementById("notificationBar");
const notificationMessage = document.getElementById("notificationMessage");
const notificationClose = document.getElementById("notificationClose");

function showNotification(title, message) {
  notificationMessage.textContent = `${title}: ${message}`;
  notificationBar.classList.add("show");

  setTimeout(() => {
    notificationBar.classList.remove("show");
  }, 5000);
}

notificationClose.addEventListener("click", () => {
  notificationBar.classList.remove("show");
});

// ========== نوتیفیکشن کلاس ==========
function getCurrentTimeSlot() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const timeSlots = {
    "7:30-9:30": { start: 7 * 60 + 30, end: 9 * 60 + 30 },
    "9:30-11:30": { start: 9 * 60 + 30, end: 11 * 60 + 30 },
    "13-15": { start: 13 * 60, end: 15 * 60 },
    "15-17": { start: 15 * 60, end: 17 * 60 },
    "18-20": { start: 18 * 60, end: 20 * 60 },
  };

  for (const [slot, times] of Object.entries(timeSlots)) {
    if (currentTime >= times.start && currentTime < times.end) {
      return slot;
    }
  }

  return null;
}

function getPersianDay() {
  const days = [
    "یک‌شنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
    "شنبه",
  ];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

function hasClassInCurrentTimeSlot() {
  const currentDay = getPersianDay();
  const currentTimeSlot = getCurrentTimeSlot();

  if (!currentTimeSlot) {
    return false;
  }

  const saved = loadFromStorage();
  const classKey = `${currentDay}-${currentTimeSlot}`;
  const classInfo = saved[classKey];

  return !!(classInfo && classInfo.subject);
}

function updateNotificationIconVisibility() {
  const notificationIcon = document.getElementById("notificationIcon");
  if (hasClassInCurrentTimeSlot()) {
    notificationIcon.style.display = "flex";
  } else {
    notificationIcon.style.display = "none";
  }
}

function showClassNotification() {
  if (!hasClassInCurrentTimeSlot()) {
    return;
  }

  const currentDay = getPersianDay();
  const currentTimeSlot = getCurrentTimeSlot();
  const saved = loadFromStorage();
  const classKey = `${currentDay}-${currentTimeSlot}`;
  const classInfo = saved[classKey];

  if (classInfo && classInfo.subject) {
    showNotification(
      "یادآوری کلاس",
      `شما کلاس ${classInfo.subject} در کلاس ${classInfo.room} دارید`
    );
  }
}

document.getElementById("notificationIcon").addEventListener("click", () => {
  showClassNotification();
});

window.addEventListener("load", () => {
  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

  if (!firstVisit) {
    localStorage.setItem(FIRST_VISIT_KEY, "true");

    setTimeout(() => {
      showClassNotification();
    }, 2000);
  }

  updateNotificationIconVisibility();

  setInterval(() => {
    showClassNotification();
    resetDailyStats();
  }, 60000);

  showClassNotification();
  updateNotificationIconVisibility();
});

// ========== Fade-in Animations ==========
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

function checkVisibility() {
  const elements = document.querySelectorAll('.fade-in, .schedule-wrapper, .todo-sidebar, .pomodoro-container, .pomodoro-stats, .todo-item');
  
  elements.forEach(element => {
    if (isInViewport(element)) {
      element.classList.add('visible');
    }
  });
}

// Initial check on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add staggered animation to table rows
  const tableRows = document.querySelectorAll('.schedule-table tbody tr');
  tableRows.forEach((row, index) => {
    row.style.transitionDelay = `${index * 0.1}s`;
  });
  
  // Check visibility after a short delay to ensure CSS is applied
  setTimeout(checkVisibility, 100);
});

// Check visibility on scroll
window.addEventListener('scroll', () => {
  // Throttle scroll events for performance
  if (!window.scrollTimeout) {
    window.scrollTimeout = setTimeout(() => {
      checkVisibility();
      window.scrollTimeout = null;
    }, 50);
  }
});

// Check visibility when window is resized
window.addEventListener('resize', checkVisibility);


