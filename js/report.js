//  date & time
function formatDate(dateString) {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function formatTime(dateString) {
  if (!dateString) return "Unknown Time";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  return date.toLocaleTimeString();
}
//user name
document.addEventListener("DOMContentLoaded", () => {     
      const branchName = localStorage.getItem('userName');    
      if (branchName) {
        document.getElementById('userName').textContent = branchName;
        document.getElementById('hiddenUserName').value = branchName;        
      } else {        
        window.location.href = './';
      }
});
//branch droplist
document.addEventListener("DOMContentLoaded", function () {
    const branchSelect = document.getElementById("branch");
    const appraisSelect = document.getElementById("Appraiser");
    fetch("resources/droplist.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load appraiser.json");
            }
            return response.json();
        })
        .then(data => {
            branchSelect.innerHTML = `<option value="" disabled selected>Select Branch</option>`;
            data.branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch;
                option.textContent = branch;
                branchSelect.appendChild(option);            
            });
            appraisSelect.innerHTML = `<option value="" disabled selected></option>`;
            data.Appraiser.forEach(appraiser => {
                const option = document.createElement("option");
                option.value = appraiser;
                option.textContent = appraiser;
                appraisSelect.appendChild(option); 
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
//Data get fom db
import { database, ref, push, onValue, update, remove } from "./firebaseConfig.js";

const branchEL = document.querySelector("#branch");
const dateEL = document.querySelector("#date");
const appraisEl = document.querySelector("#Appraiser");

const tblBodyEl = document.querySelector("#tableBody");
const displayBtn = document.querySelector(".display");
const rowCountEl = document.getElementById("rowCount");
const rowCount_1nEl = document.getElementById("rowCount_in")

function fetchData() {
    const branchValue = branchEL.value.trim();
    const dateValue = dateEL.value.trim();
    const apprasValue = appraisEl.value.trim();

    if (!branchValue || !dateValue) {
        tblBodyEl.innerHTML = "<tr><td colspan='8'>⚠️ Select a branch and date.</td></tr>";
        rowCountEl.textContent = "Total: 0";
        return;
    }
    const formattedDate2 = formatDate(dateValue).replace(/\//g, '-');
    const goldVerifyDB = ref(database, `goldvrfy/${apprasValue}/${branchValue}/${formattedDate2}`);    
        onValue(goldVerifyDB, (goldSnapshot) => {
            if (goldSnapshot.exists()) {
                let userArray = Object.entries(goldSnapshot.val());
                tblBodyEl.innerHTML = "";
                userArray.forEach(([id, currentUserValue], index) => {
                    let formattedDate = "-";
                    let formattedTime = "-";
                    if (currentUserValue.dateTime) {
                        const dateObj = new Date(currentUserValue.dateTime);
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = formatDate(dateObj);
                            formattedTime = formatTime(dateObj);
                        }
                    }
                    tblBodyEl.innerHTML += `
                        <tr>   
                            <td>${currentUserValue.Pledge || "-"}</td> 
                            <td>${currentUserValue.glwgt || "-"}</td> 
                            <td>${currentUserValue.stnwgt || "-"}</td> 
                            <td>${currentUserValue.netwgt || "-"}</td>
                            <td>${currentUserValue.lonamt || "-"}</td>
                            <td>${currentUserValue.remark || "-"}</td>
                            <td class="no-print">${formattedDate} ${formattedTime}</td>
                            <td class="no-print"><button class="correctionBtn" type="button" data-id="${id}">Correct</button></td>  <!-- Add class --> 
                        </tr>
                    `;
                });
                rowCountEl.textContent = `Total: ${userArray.length}`;
                rowCount_1nEl.value = `${userArray.length}`;
            } else {
                tblBodyEl.innerHTML = "<tr><td colspan='8'>⚠️ No Records Found</td></tr>";
                rowCountEl.textContent = "Total: 0";
            }
        });
  
}
// --- Update & Delete Logic ---

const correctionPopup = document.getElementById("correctionPopup");
const correctionForm = document.getElementById("correctionForm");
const cancelBtn = document.querySelector(".cancel");
const updateBtn = document.querySelector(".update");
const deleteBtn = document.querySelector(".delete");

// Input fields in the popup
const glnumInput = document.getElementById("glnum");
const glwgtInput = document.getElementById("glwgt");
const stnwgtInput = document.getElementById("stnwgt");
const netwgtInput = document.getElementById("netwgt");
const lonamtInput = document.getElementById("lonamt");
const remarkInput = document.getElementById("remark");

let currentRecordId = null;
let currentRecordBranch = null;
let currentRecordAppraiser = null;
let currentRecordDate = null;

// Event Delegation for "Correct" button
tblBodyEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("correctionBtn")) {
        const id = e.target.dataset.id;

        currentRecordId = id;
        currentRecordBranch = branchEL.value.trim();
        currentRecordAppraiser = appraisEl.value.trim();
        const dateValue = dateEL.value.trim();
        currentRecordDate = formatDate(dateValue).replace(/\//g, '-');
        // row values
        const row = e.target.closest("tr");
        const cells = row.querySelectorAll("td");

        glnumInput.value = cells[0].textContent;
        glwgtInput.value = cells[1].textContent;
        stnwgtInput.value = cells[2].textContent;
        netwgtInput.value = cells[3].textContent;
        lonamtInput.value = cells[4].textContent;
        remarkInput.value = cells[5].textContent;

        correctionPopup.style.display = "flex";
    }
});

// Close Popup
cancelBtn.addEventListener("click", () => {
    correctionPopup.style.display = "none";
    currentRecordId = null;
    correctionForm.reset();
});

// Update Record
updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentRecordId) return;

    if (!currentRecordBranch || !currentRecordDate || !currentRecordAppraiser) {
        alert("Error: Missing context for update.");
        return;
    }

    const newData = {
        Pledge: glnumInput.value,
        glwgt: glwgtInput.value,
        stnwgt: stnwgtInput.value,
        netwgt: netwgtInput.value,
        lonamt: lonamtInput.value,
        remark: remarkInput.value,
    };

    const recordRef = ref(database, `goldvrfy/${currentRecordAppraiser}/${currentRecordBranch}/${currentRecordDate}/${currentRecordId}`);

    update(recordRef, newData)
        .then(() => {
            alert("Record updated successfully!");
            correctionPopup.style.display = "none";
            // The onValue listener will automatically update the table
        })
        .catch((error) => {
            console.error("Error updating record:", error);
            alert("Failed to update record.");
        });
});

// Delete Record
deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentRecordId) return;

    if (!confirm("Are you sure you want to delete this record?")) return;

    if (!currentRecordBranch || !currentRecordDate || !currentRecordAppraiser) {
        alert("Error: Missing context for delete.");
        return;
    }

    const recordRef = ref(database, `goldvrfy/${currentRecordAppraiser}/${currentRecordBranch}/${currentRecordDate}/${currentRecordId}`);

    remove(recordRef)
        .then(() => {
            alert("Record deleted successfully!");
            correctionPopup.style.display = "none";
            // The onValue listener will automatically update the table
        })
        .catch((error) => {
            console.error("Error deleting record:", error);
            alert("Failed to delete record.");
        });
});


if (displayBtn) {
    displayBtn.addEventListener("click", fetchData);
} else {
    console.error("Display button not found! Ensure it exists in the HTML.");
}

