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
        document.getElementById('hiddenuserName').value = branchName;        
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
import { database, ref, push, onValue } from "./firebaseConfig.js";

const branchEL = document.querySelector("#branch");
const dateEL = document.querySelector("#date");
const appraisEl = document.querySelector("#Appraiser");

const tblBodyEl = document.querySelector("#tableBody");
const displayBtn = document.querySelector(".display");
const rowCountEl = document.getElementById("rowCount");

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
                            <td class="no-print">${formattedDate} ${formattedTime}</td> <!-- Add class --> 
                        </tr>
                    `;
                });
                rowCountEl.textContent = `Total: ${userArray.length}`;
            } else {
                tblBodyEl.innerHTML = "<tr><td colspan='8'>⚠️ No Records Found</td></tr>";
                rowCountEl.textContent = "Total: 0";
            }
        });
  
}
if (displayBtn) {
    displayBtn.addEventListener("click", fetchData);
} else {
    console.error("Display button not found! Ensure it exists in the HTML.");
}
