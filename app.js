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

planNameInput.value = "";

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

// =====================================
// ÜBUNGSKARTE IM PLAN ERSTELLEN
// =====================================

function createPlanExerciseCard(
  exercise,
  index
) {

  const card =
    document.createElement("div");

  card.className =
    "plan-exercise-card";

  card.innerHTML = `

    <div class="plan-card-header">

      <h3>
        <span class="exercise-number">
          ${index + 1}
        </span>
        ${exercise.name}
      </h3>

      <div class="plan-card-actions">

        <button
          type="button"
          class="plan-action-button move-up-button"
          title="Nach oben"
        >
          ↑
        </button>

        <button
          type="button"
          class="plan-action-button move-down-button"
          title="Nach unten"
        >
          ↓
        </button>

        <button
          type="button"
          class="plan-action-button plan-delete-button"
          title="Übung entfernen"
        >
          ×
        </button>

      </div>

    </div>

<div class="quick-values">

  <span class="quick-values-label">
    Schnellwahl:
  </span>

  <button
    type="button"
    class="quick-value-button"
    data-type="reps"
    data-sets="3"
    data-value="10"
  >
    3 × 10
  </button>

  <button
    type="button"
    class="quick-value-button"
    data-type="reps"
    data-sets="3"
    data-value="12"
  >
    3 × 12
  </button>

  <button
    type="button"
    class="quick-value-button"
    data-type="reps"
    data-sets="3"
    data-value="15"
  >
    3 × 15
  </button>

  <button
    type="button"
    class="quick-value-button"
    data-type="free"
    data-value="3 × 30 Sek."
  >
    3 × 30 Sek.
  </button>

  <button
    type="button"
    class="quick-value-button"
    data-type="free"
    data-value="3 × 45 Sek."
  >
    3 × 45 Sek.
  </button>

  <button
    type="button"
    class="quick-value-button"
    data-type="free"
    data-value="2 × 60 Sek."
  >
    2 × 60 Sek.
  </button>

</div>

    <div class="input-grid">

      <div class="input-group">
        <label>Sätze</label>

        <input
          type="number"
          min="1"
          value="${exercise.sets || ""}"
        >
      </div>


      <div class="input-group">
        <label>Wiederholungen</label>

        <input
          type="text"
          value="${exercise.reps || ""}"
        >
      </div>


      <div class="input-group">
        <label>Gewicht</label>

        <input
          type="text"
          placeholder="z. B. 40 kg"
          value="${exercise.weight || ""}"
        >
      </div>

    </div>


    <div class="full-input">

      <div class="input-group">

        <label>Freie Vorgabe</label>

        <input
          type="text"
          placeholder="z. B. 3 × 30 Sek. oder Schmerz ≤ 3/10"
          value="${exercise.free || ""}"
        >

      </div>

    </div>


    <div class="full-input">

      <div class="input-group">

        <label>Hinweis / Notiz</label>

        <textarea
          class="exercise-note"
          placeholder="z. B. langsam absenken, Bewegungsumfang anpassen ..."
        >${exercise.note || ""}</textarea>

      </div>

    </div>

  `;

  return card;
}

function updatePlanExerciseNumbers() {

  const cards =
    planExercises.querySelectorAll(
      ".plan-exercise-card"
    );

  cards.forEach(
    function (card, index) {

      const number =
        card.querySelector(
          ".exercise-number"
        );

      if (number) {
        number.textContent =
          index + 1;
      }

    }
  );

}

function setupPlanExerciseActions() {

  planExercises.addEventListener(
    "click",
    function (event) {

 const quickButton =
  event.target.closest(
    ".quick-value-button"
  );


// =================================
// SCHNELLWERTE
// =================================

if (quickButton) {

  const card =
    quickButton.closest(
      ".plan-exercise-card"
    );

  const inputs =
    card.querySelectorAll(
      ".input-grid input"
    );

  const freeInput =
    card.querySelector(
      ".full-input input"
    );


  if (
    quickButton.dataset.type ===
    "reps"
  ) {

    inputs[0].value =
      quickButton.dataset.sets;

    inputs[1].value =
      quickButton.dataset.value;

  }

  if (
    quickButton.dataset.type ===
    "free"
  ) {

    freeInput.value =
      quickButton.dataset.value;

  }


  saveCurrentDraft();

  return;
}

const button =
  event.target.closest(
    ".plan-action-button"
  );

if (!button) {
  return;
}


      const card =
        button.closest(
          ".plan-exercise-card"
        );

      if (!card) {
        return;
      }


      // =================================
      // NACH OBEN
      // =================================

      if (
        button.classList.contains(
          "move-up-button"
        )
      ) {

        const previousCard =
          card.previousElementSibling;

        if (previousCard) {

          planExercises.insertBefore(
            card,
            previousCard
          );

          updatePlanExerciseNumbers();
          saveCurrentDraft();

        }

        return;
      }


      // =================================
      // NACH UNTEN
      // =================================

      if (
        button.classList.contains(
          "move-down-button"
        )
      ) {

        const nextCard =
          card.nextElementSibling;

        if (nextCard) {

          planExercises.insertBefore(
            nextCard,
            card
          );

          updatePlanExerciseNumbers();
          saveCurrentDraft();

        }

        return;
      }


      // =================================
      // LÖSCHEN
      // =================================

      if (
        button.classList.contains(
          "plan-delete-button"
        )
      ) {

        const exerciseName =
          card
            .querySelector("h3")
            .innerText
            .replace(/^\d+\s*/, "")
            .trim();

        const confirmed =
          confirm(
            `"${exerciseName}" aus dem Plan entfernen?`
          );

        if (!confirmed) {
          return;
        }

        card.remove();

        updatePlanExerciseNumbers();
        saveCurrentDraft();

      }

    }
  );

}

setupPlanExerciseActions();

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

const libraryExercise =
  exerciseLibrary.find(
    function (exercise) {

      return (
        exercise.name ===
        exerciseName
      );

    }
  );


const exerciseData = {

  name: exerciseName,

  sets:
    previousExercise?.sets ||
    "",

  reps:
    previousExercise?.reps ||
    "",

  weight:
    previousExercise?.weight ||
    "",

  free:
    previousExercise?.free ||
    "",

  note:
    previousExercise?.note ||
    libraryExercise?.note ||
    ""

};

const card =
  createPlanExerciseCard(
    exerciseData,
    index
  );

planExercises.appendChild(card);

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

  const pdfPlanName =
  document.getElementById(
    "pdfPlanName"
  );

const backToPdfConfigButton =
  document.getElementById(
    "backToPdfConfigButton"
  );

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

// =====================================
// ENTWURF-SYSTEM
// =====================================

function saveCurrentDraft() {

  const exercises =
    getPlanData();

  const draft = {
    planId: currentPlanId,
    name: planNameInput.value.trim(),
    exercises: exercises
  };

  localStorage.setItem(
    "currentPlanDraft",
    JSON.stringify(draft)
  );

  updateDraftCard();
}


// =====================================
// ENTWURF-KARTE AKTUALISIEREN
// =====================================

function updateDraftCard() {

  const storedDraft =
    localStorage.getItem(
      "currentPlanDraft"
    );

  if (!storedDraft) {

    draftCard.classList.add(
      "hidden"
    );

    return;
  }


  const draft =
    JSON.parse(storedDraft);


  const exerciseCount =
    draft.exercises?.length || 0;


  if (
    !draft.name &&
    exerciseCount === 0
  ) {

    draftCard.classList.add(
      "hidden"
    );

    return;
  }


  draftCard.classList.remove(
    "hidden"
  );


  const planName =
    draft.name ||
    "Unbenannter Trainingsplan";


  draftCardInfo.textContent =
    `${planName} · ${exerciseCount} Übungen`;

}


// =====================================
// ENTWURF LADEN
// =====================================

function loadDraft() {

  const storedDraft =
    localStorage.getItem(
      "currentPlanDraft"
    );

  if (!storedDraft) {
    return;
  }


  const draft =
    JSON.parse(storedDraft);


  currentPlanId =
    draft.planId ?? null;


  planNameInput.value =
    draft.name || "";


  planExercises.innerHTML = "";


  const exercises =
    draft.exercises || [];


  exercises.forEach(
    function (exercise, index) {

      const card =
        createPlanExerciseCard(
          exercise,
          index
        );

      planExercises.appendChild(
        card
      );

    }
  );


  savePlanButton.textContent =
    currentPlanId === null
      ? "Plan speichern"
      : "Plan aktualisieren";


  document
    .querySelectorAll(".view")
    .forEach(
      function (view) {

        view.classList.remove(
          "active-view"
        );

      }
    );


  planView.classList.add(
    "active-view"
  );


  window.scrollTo(
    0,
    0
  );

}


// =====================================
// ENTWURF VERWERFEN
// =====================================

function discardDraft() {

  localStorage.removeItem(
    "currentPlanDraft"
  );

  updateDraftCard();

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

      const currentPlanName =
  planNameInput.value.trim();

pdfPlanName.textContent =
  currentPlanName
    ? "Trainingsplan: " +
      currentPlanName
    : "Trainingsplan";


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

backToPdfConfigButton.addEventListener(
  "click",
  function () {

    previewView.classList.remove(
      "active-view"
    );

    pdfConfigView.classList.add(
      "active-view"
    );

    window.scrollTo(
      0,
      0
    );

  }
);

// =====================================
// ECHTE PDF-DATEI ERZEUGEN
// =====================================

const savePdfButton =
  document.getElementById(
    "savePdfButton"
  );

const sharePdfButton =
  document.getElementById(
    "sharePdfButton"
  );


function createPdfDocument() {

  if (
    !window.jspdf ||
    !window.jspdf.jsPDF
  ) {

    alert(
      "Die PDF-Bibliothek konnte nicht geladen werden."
    );

    return null;
  }


  const { jsPDF } =
    window.jspdf;


  const doc =
    new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });


  const exercises =
    getPlanData();


  const sessionCount =
    getSelectedSessionCount();


  const planName =
    planNameInput.value.trim() ||
    "Trainingsplan";


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


  // =================================
  // KOPFBEREICH
  // =================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.text(
    "PHYSIO TRAINING",
    10,
    10
  );


  doc.setFontSize(15);

  doc.text(
    "Trainings- und Belastungsprotokoll",
    10,
    17
  );


  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "Trainingsplan: " + planName,
    10,
    23
  );


  doc.text(
    "Zeitraum: __________________",
    230,
    23
  );


  // =================================
  // HAUPTTABELLE
  // =================================

  const tableHead = [
    [
      "Übung / Vorgabe"
    ]
  ];


  for (
    let i = 1;
    i <= sessionCount;
    i++
  ) {

    tableHead[0].push(
      "Datum\n__ / __"
    );

  }


  const tableBody = [];


  exercises.forEach(
    function (exercise) {

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


      let exerciseText =
        exercise.name;


      if (prescription) {

        exerciseText +=
          "\n" + prescription;

      }


      if (exercise.note) {

        exerciseText +=
          "\n" + exercise.note;

      }


      const exerciseRow = [
        exerciseText
      ];


      for (
        let i = 0;
        i < sessionCount;
        i++
      ) {

        exerciseRow.push("");

      }


      tableBody.push(
        exerciseRow
      );


      if (includePain) {

        const painRow = [
          "Schmerz bei Übung (0–10)"
        ];


        for (
          let i = 0;
          i < sessionCount;
          i++
        ) {

          painRow.push("");

        }


        tableBody.push(
          painRow
        );

      }

    }
  );


  doc.autoTable({

    startY: 28,

    head: tableHead,

    body: tableBody,

    margin: {
      left: 10,
      right: 10
    },

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 6.5,
      cellPadding: 2,
      valign: "middle",
      overflow: "linebreak",
      lineWidth: 0.15
    },

    headStyles: {
      fontStyle: "bold",
      halign: "center",
      fontSize: 6.5
    },

    columnStyles: {
      0: {
        cellWidth: 52,
        halign: "left"
      }
    },

    rowPageBreak:
      "avoid",

    showHead:
      "everyPage"

  });


  // =================================
  // POSITION NACH DER TABELLE
  // =================================

  let currentY =
    doc.lastAutoTable.finalY + 5;


  const pageHeight =
    doc.internal.pageSize.getHeight();


  // Genug Platz für Monitoring /
  // Notizen sicherstellen

  if (
    currentY >
    pageHeight - 40
  ) {

    doc.addPage();

    currentY = 15;

  }


  // =================================
  // ALLGEMEINES MONITORING
  // =================================

  const monitoringRows = [];


  if (include24h) {

    monitoringRows.push(
      "24-h-Reaktion"
    );

  }


  if (includeGeneralPain) {

    monitoringRows.push(
      "Allg. Schmerz (0–10)"
    );

  }


  if (includeRpe) {

    monitoringRows.push(
      "RPE (0–10)"
    );

  }


  if (
    monitoringRows.length > 0
  ) {

    const monitoringBody =
      monitoringRows.map(
        function (label) {

          const row = [
            label
          ];


          for (
            let i = 0;
            i < sessionCount;
            i++
          ) {

            row.push("");

          }


          return row;

        }
      );


    doc.autoTable({

      startY: currentY,

      body: monitoringBody,

      margin: {
        left: 10,
        right: 10
      },

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 6.5,
        cellPadding: 2,
        minCellHeight: 7
      },

      columnStyles: {
        0: {
          cellWidth: 52,
          fontStyle: "bold"
        }
      }

    });


    currentY =
      doc.lastAutoTable.finalY + 5;

  }


  // =================================
  // NOTIZEN
  // =================================

  if (includeNotes) {

    if (
      currentY >
      pageHeight - 30
    ) {

      doc.addPage();

      currentY = 15;

    }


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(8);

    doc.text(
      "Notizen / Besonderheiten",
      10,
      currentY
    );


    currentY += 5;


    doc.setDrawColor(
      190,
      195,
      198
    );


    for (
      let i = 0;
      i < 3;
      i++
    ) {

      doc.line(
        10,
        currentY,
        287,
        currentY
      );

      currentY += 7;

    }

  }


  // =================================
  // SEITENZAHLEN
  // =================================

  const pageCount =
    doc.getNumberOfPages();


  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {

    doc.setPage(page);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7);

    doc.text(
      "Seite " +
        page +
        " / " +
        pageCount,
      287,
      202,
      {
        align: "right"
      }
    );

  }


  return doc;

}


// =====================================
// DATEINAME ERSTELLEN
// =====================================

function getPdfFileName() {

  const planName =
    planNameInput.value.trim() ||
    "Trainingsplan";


  const safeName =
    planName
      .replace(
        /[^a-zA-Z0-9äöüÄÖÜß_-]/g,
        "_"
      )
      .replace(
        /_+/g,
        "_"
      );


  return (
    "Trainingsplan_" +
    safeName +
    ".pdf"
  );

}


// =====================================
// PDF SPEICHERN
// =====================================

savePdfButton.addEventListener(
  "click",
  function () {

    const doc =
      createPdfDocument();


    if (!doc) {
      return;
    }


    doc.save(
      getPdfFileName()
    );

  }
);


// =====================================
// PDF TEILEN
// =====================================

sharePdfButton.addEventListener(
  "click",
  async function () {

    const doc =
      createPdfDocument();


    if (!doc) {
      return;
    }


    const pdfBlob =
      doc.output("blob");


    const pdfFile =
      new File(
        [pdfBlob],
        getPdfFileName(),
        {
          type:
            "application/pdf"
        }
      );


    const shareData = {
      title:
        "Trainingsplan",
      files: [
        pdfFile
      ]
    };


    try {

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(
          shareData
        )
      ) {

        await navigator.share(
          shareData
        );

        return;

      }


      // Falls direktes Teilen
      // auf dem Gerät nicht geht:
      doc.save(
        getPdfFileName()
      );


      alert(
        "Direktes Teilen wird auf diesem Gerät nicht unterstützt. Die PDF wurde stattdessen gespeichert."
      );


    } catch (error) {

      // Abbrechen des Teilen-Menüs
      // ist kein echter Fehler.
      if (
        error.name !==
        "AbortError"
      ) {

        console.error(
          "PDF konnte nicht geteilt werden:",
          error
        );

        alert(
          "Die PDF konnte nicht geteilt werden."
        );

      }

    }

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

// =====================================
// ÜBUNGSBIBLIOTHEK ANZEIGEN
// =====================================

function renderLibrary(
  searchTerm = "",
  favoritesOnly = false
) {

  libraryList.innerHTML = "";


  const sortedExercises =
    exerciseLibrary
      .map(function (exercise, index) {

        return {
          exercise: exercise,
          originalIndex: index
        };

      })
      .filter(function (item) {

        const exercise =
          item.exercise;


        const matchesSearch =
          exercise.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );


        const matchesFavorite =
          !favoritesOnly ||
          exercise.favorite === true;


        return (
          matchesSearch &&
          matchesFavorite
        );

      })
      .sort(function (a, b) {

        return a.exercise.name.localeCompare(
          b.exercise.name,
          "de",
          {
            sensitivity: "base"
          }
        );

      });


  sortedExercises.forEach(
    function (item) {

      const exercise =
        item.exercise;

      const index =
        item.originalIndex;

      const isFavorite =
        exercise.favorite === true;


      const libraryItem =
        document.createElement("div");

      libraryItem.className =
        "library-exercise";


      libraryItem.innerHTML = `

        <div class="library-exercise-info">

          <div class="library-exercise-title">

            <button
              type="button"
              class="favorite-button ${isFavorite ? "active" : ""}"
              data-index="${index}"
              title="${isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}"
            >
              ${isFavorite ? "★" : "☆"}
            </button>

            <strong>
              ${exercise.name}
            </strong>

          </div>

          <small>
            ${exercise.region || "Keine Körperregion"}
          </small>

          ${
            exercise.equipment
              ? `
                <small>
                  Material: ${exercise.equipment}
                </small>
              `
              : ""
          }

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


      libraryList.appendChild(
        libraryItem
      );

    }
  );

}

document
  .getElementById(
    "newExerciseEquipment"
  )
  .value = "";

// =====================================
// FAVORITEN IN DER ÜBUNGSBIBLIOTHEK
// =====================================

libraryList.addEventListener(
  "click",
  function (event) {

    const favoriteButton =
      event.target.closest(
        ".favorite-button"
      );

    if (!favoriteButton) {
      return;
    }


    const index =
      Number(
        favoriteButton.dataset.index
      );


    const exercise =
      exerciseLibrary[index];


    if (!exercise) {
      return;
    }


    exercise.favorite =
      exercise.favorite !== true;


    localStorage.setItem(
      "exerciseLibrary",
      JSON.stringify(
        exerciseLibrary
      )
    );


    if (exercise.favorite) {

      favoriteButton.textContent =
        "★";

      favoriteButton.classList.add(
        "active"
      );

      favoriteButton.title =
        "Favorit entfernen";

    } else {

      favoriteButton.textContent =
        "☆";

      favoriteButton.classList.remove(
        "active"
      );

      favoriteButton.title =
        "Als Favorit markieren";

    }

  }
);

function renderExerciseSelection(
  searchTerm = "",
  category = "Alle",
  favoritesOnly = false
) {

  const exerciseList =
    document.getElementById(
      "exerciseList"
    );

  exerciseList.innerHTML = "";


  const filteredExercises =
    exerciseLibrary
      .filter(function (exercise) {

        const matchesSearch =
          exercise.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );


        const matchesCategory =
          category === "Alle" ||
          exercise.category ===
            category;


        const matchesFavorite =
          !favoritesOnly ||
          exercise.favorite === true;


        return (
          matchesSearch &&
          matchesCategory &&
          matchesFavorite
        );

      })
      .sort(function (a, b) {

        return a.name.localeCompare(
          b.name,
          "de",
          {
            sensitivity: "base"
          }
        );

      });


  filteredExercises.forEach(
    function (exercise) {

      const item =
        document.createElement(
          "label"
        );

      item.className =
        "exercise-item";


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
                ? " · " +
                  exercise.region
                : ""
            }
            ${
              exercise.equipment
                ? " · " +
                  exercise.equipment
                : ""
            }
            ${
              exercise.favorite === true
                ? " · ★"
                : ""
            }
          </small>

        </span>

      `;


      exerciseList.appendChild(
        item
      );

    }
  );


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
      activeExerciseCategory,
      showFavoriteExercisesOnly
    );

  }
);

// =====================================
// FILTER ÜBUNGSAUSWAHL
// =====================================

const filterButtons =
  document.querySelectorAll(
    ".filter-button[data-category]"
  );

const favoriteFilterButton =
  document.getElementById(
    "favoriteFilterButton"
  );

let showFavoriteExercisesOnly =
  false;


// =====================================
// KATEGORIEN
// =====================================

filterButtons.forEach(
  function (button) {

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
          button.dataset.category;


        renderExerciseSelection(
          exerciseSearch.value,
          activeExerciseCategory,
          showFavoriteExercisesOnly
        );

      }
    );

  }
);


// =====================================
// FAVORITENFILTER
// =====================================

favoriteFilterButton.addEventListener(
  "click",
  function () {

    showFavoriteExercisesOnly =
      !showFavoriteExercisesOnly;


    favoriteFilterButton.classList.toggle(
      "active-filter",
      showFavoriteExercisesOnly
    );


    renderExerciseSelection(
      exerciseSearch.value,
      activeExerciseCategory,
      showFavoriteExercisesOnly
    );

  }
);

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

const libraryFavoriteFilterButton =
  document.getElementById(
    "libraryFavoriteFilterButton"
  );

let showLibraryFavoritesOnly =
  false;


librarySearch.addEventListener(
  "input",
  function () {

    renderLibrary(
      librarySearch.value,
      showLibraryFavoritesOnly
    );

  }
);


libraryFavoriteFilterButton.addEventListener(
  "click",
  function () {

    showLibraryFavoritesOnly =
      !showLibraryFavoritesOnly;


    libraryFavoriteFilterButton
      .classList.toggle(
        "active-filter",
        showLibraryFavoritesOnly
      );


    renderLibrary(
      librarySearch.value,
      showLibraryFavoritesOnly
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

const equipment =
  document
    .getElementById(
      "newExerciseEquipment"
    )
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

const existingFavorite =
  editExerciseIndex !== null &&
  exerciseLibrary[
    editExerciseIndex
  ]?.favorite === true;


const exerciseData = {

  name: name,
  category: category,
  region: region,
  equipment: equipment,
  note: note,
  favorite: existingFavorite

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
  .getElementById(
    "newExerciseEquipment"
  )
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
    "newExerciseEquipment"
  )
  .value =
    exercise.equipment || "";

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

  const planNameInput =
  document.getElementById(
    "planNameInput"
  );

  const duplicatePlanButton =
  document.getElementById(
    "duplicatePlanButton"
  );

  const draftCard =
  document.getElementById(
    "draftCard"
  );

const draftCardInfo =
  document.getElementById(
    "draftCardInfo"
  );

const continueDraftButton =
  document.getElementById(
    "continueDraftButton"
  );

const discardDraftButton =
  document.getElementById(
    "discardDraftButton"
  );

  let savedPlans =
  JSON.parse(
    localStorage.getItem("savedPlans")
  ) || [];
let currentPlanId = null;


// =====================================
// ENTWURF-LISTENER
// =====================================

planNameInput.addEventListener(
  "input",
  saveCurrentDraft
);


planExercises.addEventListener(
  "input",
  saveCurrentDraft
);


continueDraftButton.addEventListener(
  "click",
  loadDraft
);


discardDraftButton.addEventListener(
  "click",
  function () {

    const confirmed =
      confirm(
        "Entwurf wirklich verwerfen?"
      );

    if (!confirmed) {
      return;
    }

    discardDraft();

  }
);


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

    const planName =
      planNameInput.value.trim();


    if (!planName) {

      alert(
        "Bitte gib dem Trainingsplan einen Namen."
      );

      planNameInput.focus();

      return;
    }


    if (exercises.length === 0) {

      alert(
        "Der Plan enthält keine Übungen."
      );

      return;
    }


    // =================================
    // NEUEN PLAN SPEICHERN
    // =================================

    if (currentPlanId === null) {

      const newPlan = {

        id: Date.now(),

        name: planName,

        exercises: exercises

      };


      savedPlans.push(
        newPlan
      );


      // Der Plan bleibt jetzt als
      // aktuell geöffneter Plan gesetzt
      currentPlanId =
        newPlan.id;


      savePlanButton.textContent =
        "Plan aktualisieren";


      savePlansToStorage();


discardDraft();

      alert(
        "Plan wurde gespeichert."
      );

      return;
    }


    // =================================
    // BESTEHENDEN PLAN AKTUALISIEREN
    // =================================

    const planIndex =
      savedPlans.findIndex(
        function (plan) {

          return (
            plan.id ===
            currentPlanId
          );

        }
      );


    if (planIndex === -1) {

      alert(
        "Der gespeicherte Plan konnte nicht gefunden werden."
      );

      return;
    }


    savedPlans[planIndex] = {

      id: currentPlanId,

      name: planName,

      exercises: exercises

    };


    savePlansToStorage();


discardDraft();

    alert(
      "Plan wurde aktualisiert."
    );

  }
);

duplicatePlanButton.addEventListener(
  "click",
  function () {

    const exercises =
      getPlanData();

    const currentName =
      planNameInput.value.trim();


    if (exercises.length === 0) {

      alert(
        "Der Plan enthält keine Übungen."
      );

      return;
    }


    const duplicateName =
      currentName
        ? currentName + " – Kopie"
        : "Neuer Trainingsplan";


    const duplicatedPlan = {

      id: Date.now(),

      name: duplicateName,

      exercises: exercises

    };


    savedPlans.push(
      duplicatedPlan
    );


    savePlansToStorage();


    // Ab jetzt wird die Kopie bearbeitet
    currentPlanId =
      duplicatedPlan.id;


    planNameInput.value =
      duplicateName;


    savePlanButton.textContent =
      "Plan aktualisieren";


discardDraft();

    alert(
      "Plan wurde dupliziert."
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

planNameInput.value =
  plan.name;

    if (!plan) {
      return;
    }


    planExercises.innerHTML = "";


    plan.exercises.forEach(
      function (exercise, index) {

const card =
  createPlanExerciseCard(
    exercise,
    index
  );

planExercises.appendChild(card);

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

updateDraftCard();