const homeView = document.getElementById("homeView");
const exerciseView = document.getElementById("exerciseView");

const newPlanButton = document.getElementById("newPlanButton");
const backButton = document.getElementById("backButton");


newPlanButton.addEventListener("click", function () {
  localStorage.removeItem(
    "temporaryPlanData"
  );

  currentPlanId = null;

  savePlanButton.textContent =
    "Plan speichern";

  exerciseSearch.value = "";

  activeExerciseCategory = "Alle";


  filterButtons.forEach(function (button) {

    button.classList.remove(
      "active-filter"
    );


    if (
      button.textContent.trim() === "Alle"
    ) {

      button.classList.add(
        "active-filter"
      );

    }

  });


  renderExerciseSelection(
    "",
    "Alle"
  );


  homeView.classList.remove(
    "active-view"
  );

  exerciseView.classList.add(
    "active-view"
  );


  updateSelection();

});

backButton.addEventListener("click", function () {

  exerciseView.classList.remove("active-view");
  homeView.classList.add("active-view");

});
const continueButton =
  document.getElementById("continueButton");

const selectionCount =
  document.getElementById("selectionCount");

const planView =
  document.getElementById("planView");

const planExercises =
  document.getElementById("planExercises");

const backToExercisesButton =
  document.getElementById("backToExercisesButton");



function updateSelection() {

  const selected =
    document.querySelectorAll(
      ".exercise-item input[type='checkbox']:checked"
    );

  selectionCount.textContent =
    selected.length === 1
      ? "1 Übung ausgewählt"
      : `${selected.length} Übungen ausgewählt`;

  continueButton.disabled =
    selected.length === 0;

}

function addExerciseCheckboxListeners() {

  const checkboxes =
    document.querySelectorAll(
      ".exercise-item input[type='checkbox']"
    );


  checkboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
      "change",
      updateSelection
    );

  });

}

continueButton.addEventListener(
  "click",
  function () {

    const selected =
      document.querySelectorAll(
        ".exercise-item input[type='checkbox']:checked"
      );

    const previousPlanData =
      JSON.parse(
        localStorage.getItem(
          "temporaryPlanData"
        )
      ) || [];

    planExercises.innerHTML = "";

    selected.forEach(
      function (checkbox, index) {

        const exerciseName =
          checkbox.value;

        const previousExercise =
          previousPlanData.find(
            function (exercise) {
              return exercise.name === exerciseName;
            }
          );

        const card =
          document.createElement("div");

        card.className =
          "plan-exercise-card";

        card.innerHTML = `
          <h3>
            <span class="exercise-number">
              ${index + 1}
            </span>
            ${exerciseName}
          </h3>

          <div class="input-grid">

            <div class="input-group">
              <label>Sätze</label>
              <input
                type="number"
                value="${previousExercise?.sets || ""}"
              >
            </div>

            <div class="input-group">
              <label>Wiederholungen</label>
              <input
                type="text"
                value="${previousExercise?.reps || ""}"
              >
            </div>

            <div class="input-group">
              <label>Gewicht</label>
              <input
                type="text"
                placeholder="z. B. 40 kg"
                value="${previousExercise?.weight || ""}"
              >
            </div>

          </div>

          <div class="full-input">
            <div class="input-group">

              <label>Freie Vorgabe</label>

              <input
                type="text"
                placeholder="z. B. 3 × 30 Sek. oder Schmerz ≤ 3/10"
                value="${previousExercise?.free || ""}"
              >

            </div>
          </div>

          <div class="full-input">
            <div class="input-group">

              <label>Hinweis / Notiz</label>

              <textarea
                class="exercise-note"
                placeholder="z. B. langsam absenken, Bewegungsumfang anpassen ..."
              >${previousExercise?.note || ""}</textarea>

            </div>
          </div>
        `;

        planExercises.appendChild(
          card
        );

      }
    );

    exerciseView.classList.remove(
      "active-view"
    );

    planView.classList.add(
      "active-view"
    );

    window.scrollTo(0, 0);

  }
);

backToExercisesButton.addEventListener(
  "click",
  function () {

    const currentExercises =
      getPlanData();

    localStorage.setItem(
      "temporaryPlanData",
      JSON.stringify(currentExercises)
    );

    renderExerciseSelection(
      "",
      "Alle"
    );

    const checkboxes =
      document.querySelectorAll(
        ".exercise-item input[type='checkbox']"
      );

    checkboxes.forEach(function (checkbox) {

      const isInPlan =
        currentExercises.some(
          function (exercise) {
            return exercise.name === checkbox.value;
          }
        );

      checkbox.checked =
        isInPlan;

    });

    updateSelection();

    planView.classList.remove(
      "active-view"
    );

    exerciseView.classList.add(
      "active-view"
    );

    window.scrollTo(0, 0);

  }
);

const toPdfButton =
  document.getElementById("toPdfButton");

const pdfConfigView =
  document.getElementById("pdfConfigView");

const backToPlanButton =
  document.getElementById("backToPlanButton");


toPdfButton.addEventListener(
  "click",
  function () {

    planView.classList.remove("active-view");

    pdfConfigView.classList.add("active-view");

    window.scrollTo(0, 0);

  }
);


backToPlanButton.addEventListener(
  "click",
  function () {

    pdfConfigView.classList.remove("active-view");

    planView.classList.add("active-view");

    window.scrollTo(0, 0);

  }
);
const createPreviewButton =
  document.getElementById("createPreviewButton");

const previewView =
  document.getElementById("previewView");

const backToConfigButton =
  document.getElementById("backToConfigButton");

const trainingTableWrapper =
  document.getElementById("trainingTableWrapper");

const generalMonitoring =
  document.getElementById("generalMonitoring");

const pdfNotes =
  document.getElementById("pdfNotes");

const printButton =
  document.getElementById("printButton");


function getSelectedSessionCount() {

  const selected =
    document.querySelector(
      'input[name="sessions"]:checked'
    );

  return Number(selected.value);
}


function getPlanData() {

  const cards =
    document.querySelectorAll(".plan-exercise-card");

  const exercises = [];


  cards.forEach(function (card) {

    const name =
      card.querySelector("h3").innerText
        .replace(/^\d+\s*/, "")
        .trim();

    const inputs =
      card.querySelectorAll("input");

    const note =
      card.querySelector(".exercise-note");


    exercises.push({

      name: name,

      sets: inputs[0]?.value || "",

      reps: inputs[1]?.value || "",

      weight: inputs[2]?.value || "",

      free: inputs[3]?.value || "",

      note: note?.value || ""

    });

  });


  return exercises;
}
function createTrainingTable(
  exercises,
  sessionCount,
  includePain
) {

  let html = `
    <table class="training-table">

      <thead>
        <tr>

          <th>
            Übung / Vorgabe
          </th>
  `;


  for (
    let i = 1;
    i <= sessionCount;
    i++
  ) {

    html += `
      <th>
        Datum<br>
        __ / __
      </th>
    `;

  }


  html += `
        </tr>
      </thead>

      <tbody>
  `;


  exercises.forEach(function (exercise) {

    let prescription = "";


    if (exercise.sets) {
      prescription +=
        exercise.sets + " × ";
    }


    if (exercise.reps) {
      prescription +=
        exercise.reps;
    }


    if (exercise.weight) {

      if (prescription) {
        prescription += " · ";
      }

      prescription +=
        exercise.weight;

    }


    if (exercise.free) {

      if (prescription) {
        prescription += " · ";
      }

      prescription +=
        exercise.free;

    }


    html += `
      <tr>

        <td class="exercise-main-cell">

          <strong>
            ${exercise.name}
          </strong>

          <small>
            ${prescription}
          </small>

          ${
            exercise.note
              ? `<small><br>${exercise.note}</small>`
              : ""
          }

        </td>
    `;


    for (
      let i = 0;
      i < sessionCount;
      i++
    ) {

      html += `
        <td class="training-entry-cell"></td>
      `;

    }


    html += `
      </tr>
    `;


    if (includePain) {

      html += `
        <tr>

          <td class="pain-label-cell">
            Schmerz bei Übung (0–10)
          </td>
      `;


      for (
        let i = 0;
        i < sessionCount;
        i++
      ) {

        html += `
          <td class="pain-entry-cell"></td>
        `;

      }


      html += `
        </tr>
      `;

    }

  });


  html += `
      </tbody>
    </table>
  `;


  return html;
}
function createMonitoringTable(
  sessionCount,
  include24h,
  includeGeneralPain,
  includeRpe
) {

  const rows = [];


  if (include24h) {
    rows.push("24-h-Reaktion");
  }


  if (includeGeneralPain) {
    rows.push("Allg. Schmerz (0–10)");
  }


  if (includeRpe) {
    rows.push("RPE (0–10)");
  }


  if (rows.length === 0) {
    return "";
  }


  let html = `
    <table class="monitoring-table">
  `;


  rows.forEach(function (row) {

    html += `
      <tr>

        <td class="monitoring-label">
          ${row}
        </td>
    `;


    for (
      let i = 0;
      i < sessionCount;
      i++
    ) {

      html += `<td></td>`;

    }


    html += `</tr>`;

  });


  html += `</table>`;


  return html;
}
createPreviewButton.addEventListener(
  "click",
  function () {

    const exercises =
      getPlanData();

    const sessionCount =
      getSelectedSessionCount();


    const includePain =
      document.getElementById(
        "includeExercisePain"
      ).checked;


    const include24h =
      document.getElementById(
        "include24h"
      ).checked;


    const includeGeneralPain =
      document.getElementById(
        "includeGeneralPain"
      ).checked;


    const includeRpe =
      document.getElementById(
        "includeRpe"
      ).checked;


    const includeNotes =
      document.getElementById(
        "includeNotes"
      ).checked;


    trainingTableWrapper.innerHTML =
      createTrainingTable(
        exercises,
        sessionCount,
        includePain
      );


    generalMonitoring.innerHTML =
      createMonitoringTable(
        sessionCount,
        include24h,
        includeGeneralPain,
        includeRpe
      );


    pdfNotes.style.display =
      includeNotes ? "block" : "none";


    pdfConfigView.classList.remove(
      "active-view"
    );

    previewView.classList.add(
      "active-view"
    );


    window.scrollTo(0, 0);

  }
);


backToConfigButton.addEventListener(
  "click",
  function () {

    previewView.classList.remove(
      "active-view"
    );

    pdfConfigView.classList.add(
      "active-view"
    );

    window.scrollTo(0, 0);

  }
);
printButton.addEventListener(
  "click",
  function () {

    window.print();

  }
);
const libraryButton =
  document.getElementById("libraryButton");

const libraryView =
  document.getElementById("libraryView");

const backFromLibraryButton =
  document.getElementById("backFromLibraryButton");

const libraryList =
  document.getElementById("libraryList");

const addExerciseButton =
  document.getElementById("addExerciseButton");

const exerciseForm =
  document.getElementById("exerciseForm");

const cancelExerciseButton =
  document.getElementById("cancelExerciseButton");

const saveExerciseButton =
  document.getElementById("saveExerciseButton");

const librarySearch =
  document.getElementById("librarySearch");
  const defaultExercises = [

  {
    name: "Beinpresse",
    category: "Unterkörper",
    region: "Bein",
    note: ""
  },

  {
    name: "Kniebeuge",
    category: "Unterkörper",
    region: "Bein",
    note: ""
  },

  {
    name: "Wadenheben",
    category: "Unterkörper",
    region: "Unterschenkel",
    note: ""
  },

  {
    name: "Rudern",
    category: "Oberkörper",
    region: "Rücken",
    note: ""
  },

  {
    name: "Latzug",
    category: "Oberkörper",
    region: "Rücken",
    note: ""
  },

  {
    name: "Pallof Press",
    category: "Rumpf",
    region: "Rumpf",
    note: ""
  }

];
let exerciseLibrary =
  JSON.parse(
    localStorage.getItem("exerciseLibrary")
  );


if (!exerciseLibrary) {

  exerciseLibrary = defaultExercises;

  saveExerciseLibrary();

}
let editExerciseIndex = null;

function saveExerciseLibrary() {

  localStorage.setItem(
    "exerciseLibrary",
    JSON.stringify(exerciseLibrary)
  );

}

function renderLibrary(searchTerm = "") {

  libraryList.innerHTML = "";


  exerciseLibrary.forEach(function (exercise, index) {

    const matchesSearch =
      exercise.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


    if (!matchesSearch) {
      return;
    }


    const item =
      document.createElement("div");

    item.className =
      "library-exercise";


    item.innerHTML = `

      <div class="library-exercise-info">

        <strong>
          ${exercise.name}
        </strong>

        <small>
          ${exercise.region || "Keine Körperregion"}
        </small>

      </div>


      <div class="library-actions">

        <span class="category-badge">
          ${exercise.category}
        </span>

        <button
          class="edit-button"
          data-index="${index}"
        >
          Bearbeiten
        </button>

        <button
          class="delete-button"
          data-index="${index}"
        >
          Löschen
        </button>

      </div>

    `;


    libraryList.appendChild(item);

  });

}

function renderExerciseSelection(
  searchTerm = "",
  category = "Alle"
) {

  const exerciseList =
    document.getElementById("exerciseList");

  exerciseList.innerHTML = "";


  const filteredExercises =
    exerciseLibrary.filter(function (exercise) {

      const matchesSearch =
        exercise.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );


      const matchesCategory =
        category === "Alle" ||
        exercise.category === category;


      return matchesSearch && matchesCategory;

    });


  filteredExercises.forEach(function (exercise) {

    const item =
      document.createElement("label");

    item.className = "exercise-item";


    item.innerHTML = `
      <input
        type="checkbox"
        value="${exercise.name}"
      >

      <span>

        <strong>
          ${exercise.name}
        </strong>

        <small>
          ${exercise.category}
          ${
            exercise.region
              ? " · " + exercise.region
              : ""
          }
        </small>

      </span>
    `;


    exerciseList.appendChild(item);

  });


  addExerciseCheckboxListeners();

}
let activeExerciseCategory = "Alle";

const exerciseSearch =
  document.getElementById("exerciseSearch");


exerciseSearch.addEventListener(
  "input",
  function () {

    renderExerciseSelection(
      exerciseSearch.value,
      activeExerciseCategory
    );

  }
);

const filterButtons =
  document.querySelectorAll(".filter-button");


filterButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      filterButtons.forEach(
        function (otherButton) {

          otherButton.classList.remove(
            "active-filter"
          );

        }
      );


      button.classList.add(
        "active-filter"
      );


      activeExerciseCategory =
        button.textContent.trim();


      renderExerciseSelection(
        exerciseSearch.value,
        activeExerciseCategory
      );

    }
  );

});

libraryButton.addEventListener(
  "click",
  function () {

    homeView.classList.remove(
      "active-view"
    );

    libraryView.classList.add(
      "active-view"
    );

    renderLibrary();

  }
);


backFromLibraryButton.addEventListener(
  "click",
  function () {

    libraryView.classList.remove(
      "active-view"
    );

    homeView.classList.add(
      "active-view"
    );

  }
);

librarySearch.addEventListener(
  "input",
  function () {

    renderLibrary(
      librarySearch.value
    );

  }
);


addExerciseButton.addEventListener("click", function () {

  exerciseForm.classList.remove("hidden");

  exerciseForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

});

cancelExerciseButton.addEventListener(
  "click",
  function () {

    exerciseForm.classList.add(
      "hidden"
    );

  }
);
saveExerciseButton.addEventListener(
  "click",
  function () {

    const name =
      document
        .getElementById("newExerciseName")
        .value
        .trim();

    const category =
      document
        .getElementById("newExerciseCategory")
        .value;

    const region =
      document
        .getElementById("newExerciseRegion")
        .value
        .trim();

    const note =
      document
        .getElementById("newExerciseNote")
        .value
        .trim();


    if (!name) {

      alert(
        "Bitte gib einen Übungsnamen ein."
      );

      return;

    }


    const exerciseData = {

  name: name,
  category: category,
  region: region,
  note: note

};


if (editExerciseIndex === null) {

  exerciseLibrary.push(
    exerciseData
  );

} else {

  exerciseLibrary[
    editExerciseIndex
  ] = exerciseData;

}

    saveExerciseLibrary();

    renderLibrary();


    document
      .getElementById("newExerciseName")
      .value = "";

    document
      .getElementById("newExerciseRegion")
      .value = "";

    document
      .getElementById("newExerciseNote")
      .value = "";

      editExerciseIndex = null;

document
  .getElementById(
    "exerciseFormTitle"
  )
  .textContent =
  "Neue Übung";

saveExerciseButton.textContent =
  "Übung speichern";

    exerciseForm.classList.add(
      "hidden"
    );

  }
);
librarySearch.addEventListener(
  "input",
  function () {

    renderLibrary(
      librarySearch.value
    );

  }
);
libraryList.addEventListener(
  "click",
  function (event) {

    const index =
      Number(event.target.dataset.index);


    /* ÜBUNG BEARBEITEN */

    if (
      event.target.classList.contains(
        "edit-button"
      )
    ) {

      const exercise =
        exerciseLibrary[index];


      editExerciseIndex = index;


      document
        .getElementById(
          "newExerciseName"
        )
        .value = exercise.name;


      document
        .getElementById(
          "newExerciseCategory"
        )
        .value = exercise.category;


      document
        .getElementById(
          "newExerciseRegion"
        )
        .value = exercise.region;


      document
        .getElementById(
          "newExerciseNote"
        )
        .value = exercise.note;


      document
        .getElementById(
          "exerciseFormTitle"
        )
        .textContent =
        "Übung bearbeiten";


      saveExerciseButton.textContent =
        "Änderungen speichern";


      exerciseForm.classList.remove(
        "hidden"
      );


      exerciseForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


    /* ÜBUNG LÖSCHEN */

    if (
      event.target.classList.contains(
        "delete-button"
      )
    ) {

      const exercise =
        exerciseLibrary[index];


      const confirmed =
        confirm(
          `"${exercise.name}" wirklich löschen?`
        );


      if (!confirmed) {
        return;
      }


      exerciseLibrary.splice(
        index,
        1
      );


      saveExerciseLibrary();

      renderLibrary(
        librarySearch.value
      );

    }

  }
);
const savedPlansButton =
  document.getElementById("savedPlansButton");

const savedPlansView =
  document.getElementById("savedPlansView");

const backFromSavedPlansButton =
  document.getElementById("backFromSavedPlansButton");

const savedPlansList =
  document.getElementById("savedPlansList");

const savePlanButton =
  document.getElementById("savePlanButton");


  let savedPlans =
  JSON.parse(
    localStorage.getItem("savedPlans")
  ) || [];
let currentPlanId = null;

function savePlansToStorage() {

  localStorage.setItem(
    "savedPlans",
    JSON.stringify(savedPlans)
  );

}

savePlanButton.addEventListener(
  "click",
  function () {

    const exercises =
      getPlanData();


    if (exercises.length === 0) {

      alert(
        "Der Plan enthält keine Übungen."
      );

      return;

    }


    const planName =
      prompt(
        "Wie soll der Plan heißen?"
      );


    if (!planName) {
      return;
    }

if (currentPlanId === null) {

  const newPlan = {

    id: Date.now(),

    name: planName,

    exercises: exercises

  };

  savedPlans.push(
    newPlan
  );

} else {

  const planIndex =
    savedPlans.findIndex(
      function (plan) {
        return plan.id === currentPlanId;
      }
    );

  if (planIndex !== -1) {

    savedPlans[planIndex] = {

      id: currentPlanId,

      name: planName,

      exercises: exercises

    };

  }

}

    savePlansToStorage()

    currentPlanId = null;

savePlanButton.textContent =
  "Plan speichern";

    alert(
      "Plan wurde gespeichert."
    );

  }
);

function renderSavedPlans() {

  savedPlansList.innerHTML = "";


  if (savedPlans.length === 0) {

    savedPlansList.innerHTML =
      "<p>Noch keine Pläne gespeichert.</p>";

    return;

  }


  savedPlans.forEach(function (plan) {

    const item =
      document.createElement("div");

    item.className =
      "library-exercise";


    item.innerHTML = `

      <div class="library-exercise-info">

        <strong>
          ${plan.name}
        </strong>

        <small>
          ${plan.exercises.length}
          Übungen
        </small>

      </div>

      <div class="library-actions">

  <button
    class="edit-button open-plan-button"
    data-id="${plan.id}"
  >
    Öffnen
  </button>

  <button
    class="delete-button delete-plan-button"
    data-id="${plan.id}"
  >
    Löschen
  </button>

</div>
    `;


    savedPlansList.appendChild(item);

  });

}

savedPlansButton.addEventListener(
  "click",
  function () {

    renderSavedPlans();

    homeView.classList.remove(
      "active-view"
    );

    savedPlansView.classList.add(
      "active-view"
    );

  }
);


backFromSavedPlansButton.addEventListener(
  "click",
  function () {

    savedPlansView.classList.remove(
      "active-view"
    );

    homeView.classList.add(
      "active-view"
    );

  }
);

savedPlansList.addEventListener(
  "click",
  function (event) {

    if (
      !event.target.classList.contains(
        "open-plan-button"
      )
    ) {
      return;
    }


    const planId =
      Number(
        event.target.dataset.id
      );


    const plan =
      savedPlans.find(
        function (savedPlan) {

          return savedPlan.id === planId;

        }
      );

      currentPlanId = plan.id;

savePlanButton.textContent =
  "Plan aktualisieren";

    if (!plan) {
      return;
    }


    planExercises.innerHTML = "";


    plan.exercises.forEach(
      function (exercise, index) {

        const card =
          document.createElement("div");

        card.className =
          "plan-exercise-card";


        card.innerHTML = `

          <h3>
            <span class="exercise-number">
              ${index + 1}
            </span>

            ${exercise.name}
          </h3>


          <div class="input-grid">

            <div class="input-group">
              <label>Sätze</label>

              <input
                type="number"
                value="${exercise.sets}"
              >
            </div>


            <div class="input-group">
              <label>Wiederholungen</label>

              <input
                type="text"
                value="${exercise.reps}"
              >
            </div>


            <div class="input-group">
              <label>Gewicht</label>

              <input
                type="text"
                value="${exercise.weight}"
              >
            </div>

          </div>


          <div class="full-input">

            <div class="input-group">

              <label>
                Freie Vorgabe
              </label>

              <input
                type="text"
                value="${exercise.free}"
              >

            </div>

          </div>


          <div class="full-input">

            <div class="input-group">

              <label>
                Hinweis / Notiz
              </label>

              <textarea
                class="exercise-note"
              >${exercise.note}</textarea>

            </div>

          </div>

        `;


        planExercises.appendChild(
          card
        );

      }
    );


    savedPlansView.classList.remove(
      "active-view"
    );

    planView.classList.add(
      "active-view"
    );


    window.scrollTo(0, 0);

  }
);
savedPlansList.addEventListener(
  "click",
  function (event) {

    if (
      !event.target.classList.contains(
        "delete-plan-button"
      )
    ) {
      return;
    }

    const planId =
      Number(
        event.target.dataset.id
      );

    const plan =
      savedPlans.find(
        function (savedPlan) {
          return savedPlan.id === planId;
        }
      );

    if (!plan) {
      return;
    }

    const confirmed =
      confirm(
        `"${plan.name}" wirklich löschen?`
      );

    if (!confirmed) {
      return;
    }

    savedPlans =
      savedPlans.filter(
        function (savedPlan) {
          return savedPlan.id !== planId;
        }
      );

    savePlansToStorage();

    renderSavedPlans();

  }
);

// =====================================
// SERVICE WORKER
// =====================================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    async function () {

      try {

        const registration =
          await navigator
            .serviceWorker
            .register(
              "./service-worker.js"
            );


        // Prüft beim Öffnen der App,
        // ob eine neue Version vorhanden ist
        registration.update();


        console.log(
          "Service Worker aktiv."
        );

      } catch (error) {

        console.error(
          "Service Worker konnte nicht geladen werden:",
          error
        );

      }

    }
  );

}
// =====================================
// EINHEITLICHE NAVIGATION
// =====================================

function setupGlobalNavigation() {

  const allViews =
    document.querySelectorAll(".view");


  allViews.forEach(function (view) {

    // Die Startseite braucht keine Navigation
    if (view.id === "homeView") {
      return;
    }


    // Verhindert doppelte Navigation
    if (
      view.querySelector(".navigation-bar")
    ) {
      return;
    }


    const navigationBar =
      document.createElement("div");

    navigationBar.className =
      "navigation-bar";


    // Vorhandenen Zurück-Button suchen
    const existingBackButton =
      view.querySelector(".back-button");


    // Neue Startseiten-Schaltfläche
    const homeButton =
      document.createElement("button");

    homeButton.className =
      "home-button";

    homeButton.type =
      "button";

    homeButton.innerHTML =
      "⌂ Startseite";


    // Navigationsleiste ganz oben einsetzen
    view.insertBefore(
      navigationBar,
      view.firstChild
    );


    // Vorhandenen Zurück-Button hineinverschieben
    if (existingBackButton) {

      navigationBar.appendChild(
        existingBackButton
      );

    } else {

      // Falls eine spätere Seite keinen
      // Zurück-Button besitzt
      const placeholder =
        document.createElement("div");

      navigationBar.appendChild(
        placeholder
      );

    }


    navigationBar.appendChild(
      homeButton
    );


    homeButton.addEventListener(
      "click",
      function () {

        allViews.forEach(
          function (otherView) {

            otherView.classList.remove(
              "active-view"
            );

          }
        );


        homeView.classList.add(
          "active-view"
        );


        window.scrollTo(
          0,
          0
        );

      }
    );

  });

}


setupGlobalNavigation();
