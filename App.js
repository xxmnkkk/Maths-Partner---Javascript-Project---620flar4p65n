
const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", search);
  
async function search() {
  const operation = document.querySelector("#select-option").value;
  const expression = document.querySelector("#input-bar").value;

  if (expression == "") {
    alert("Please enter a problem statement.");
    return;
  }

  try {
    const response = await fetch(`https://newton.vercel.app/api/v2/${operation}/${encodeURIComponent(expression)}`);
    const data = await response.json();

    if (data.error) {
      alert("An error occurred while fetching the result. Please check your input.");
      return;
    }

    const resultBox = document.querySelector("#result-box");
    resultBox.innerHTML = `
      <p><strong>The output of ${operation} : ${expression}</strong>
      </p><p>${data.result}</p>`;
    saveResultToLocalStorage(operation, expression, data.result);
  } 
  catch (error) {
    alert("An error occurred while fetching the result.");
  }
}
  
function saveResultToLocalStorage(operation, expression, result) {
  const savedResults = JSON.parse(localStorage.getItem("savedResults"));
  savedResults.push({ operation, expression, result });
  localStorage.setItem("savedResults", JSON.stringify(savedResults));
  loadSavedResults();
}

function loadSavedResults() {
  const savedResults = JSON.parse(localStorage.getItem("savedResults"));
  const historyBox = document.querySelector(".history-box");
  
  historyBox.innerHTML = savedResults.map((savedResult, index) => `
      <div class="history-card">
        <div class="history-content">
          <p><strong>${savedResult.operation} : ${savedResult.expression}</strong></p>
          <p>${savedResult.result}</p>
        </div>
        <button class="delete-history" data-index="${index}">Delete</button>
      </div>
    `).join("");

  const deleteButtons = document.querySelectorAll(".delete-history");
  deleteButtons.forEach((button) => {button.addEventListener("click", deleteHistoryEntry)});
}
  
function deleteHistoryEntry(event) {
  const indexToRemove = parseInt(event.target.getAttribute("data-index"));
  const savedResults = JSON.parse(localStorage.getItem("savedResults"));
  savedResults.splice(indexToRemove, 1);
  localStorage.setItem("savedResults", JSON.stringify(savedResults));
  loadSavedResults();
}


const savedButton = document.querySelector("#saved-button");
const historyBox = document.querySelector(".history-box");
historyBox.style.display = "none";
savedButton.addEventListener("click", toggleHistoryBox);

function toggleHistoryBox() {
  if (historyBox.style.display === "none") {
    historyBox.style.display = "block";
    savedButton.classList.add("active-box-shadow");
    savedButton.value = "CLOSE HISTORY";
  } else {
    historyBox.style.display = "none";
    savedButton.classList.remove("active-box-shadow");
    savedButton.value = "SAVED SOLUTIONS";
  }
}

const deleteButton = document.querySelector("#delete-button");
deleteButton.addEventListener("click", deleteResult);

function deleteResult() {
  const operation = document.querySelector("#select-option").value;
  const expression = document.querySelector("#input-bar").value;

  const savedResults = JSON.parse(localStorage.getItem("savedResults")) || [];
  const indexToRemove = savedResults.findIndex((savedResult) => 
    savedResult.operation === operation && savedResult.expression === expression
  );

  if (indexToRemove !== -1) {
    savedResults.splice(indexToRemove, 1);
    localStorage.setItem("savedResults", JSON.stringify(savedResults));
    loadSavedResults();
  }

  const resultBox = document.querySelector("#result-box");
  resultBox.innerHTML = "";
}

loadSavedResults();