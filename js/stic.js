// date as DD/MM/YYYY
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

//branch name
document.addEventListener("DOMContentLoaded", () => {
      const branchName = localStorage.getItem('userName');
      if (branchName) {
        document.getElementById('userName').textContent = branchName;
        document.getElementById('hiddenuserName').value = branchName;        
      } else {  
        window.location.href = 'index.html';
      }      
});
  // db
import { database, ref, push, onValue } from "./firebaseConfig.js";


  const collectionListDB = ref(database, `stickerdb`);
  const mainappraisForm = document.getElementById("stickerForm");
  const tblBodyEl = document.querySelector("#tableBody");  
  const dateEL = document.querySelector("#hiddenmainDate");
  const branchEL = document.querySelector("#hiddenbranch");
  const recsticEL = document.querySelector("#hostic");
  const userEl = document.querySelector('#hiddenuserName');
 
  const totalStickerEl = document.getElementById("totalSticker"); 
  const totalReceivedEl = document.getElementById("totalReceived"); 
  const balanceEl = document.getElementById("balance")

  function updateBalance() {
    const used = parseInt(totalStickerEl.textContent.replace(/\D/g, "")) || 0; // Extract numbers
    const received = parseInt(totalReceivedEl.textContent.replace(/\D/g, "")) || 0;
    balanceEl.textContent = received - used; // Update balance
}

  mainappraisForm.addEventListener("submit", function (e) {
      e.preventDefault();   
      const collect = {    
          hiddenmainDate: dateEL.value,
          hiddenbranch: branchEL.value,         
          received: recsticEL.value,
          user: userEl.value,                          
      };
  const messageContainer = document.getElementById("messageContainer");
  push(collectionListDB, collect)
      .then(() => {
          messageContainer.innerHTML = `<p class="success-message">✔ Saved successfully!</p>`;
          mainappraisForm.reset();
      })
      .catch((error) => {
          console.error("Error adding data: ", error);
          messageContainer.innerHTML = `<p class="error-message">❌ Not Saved: ${error.message}. Please try again.</p>`;
      });  
  });  
  // Fetch Data 
 onValue(collectionListDB, function (snapshot) {
    if (snapshot.exists()) {
        let userArray = Object.entries(snapshot.val());
        tblBodyEl.innerHTML = ""; // ✅ Clear previous table content

        let totalSick = 0;
        let totalReceived = 0;

        userArray.forEach(([id, currentUserValue]) => {
            let formattedDatemain = formatDate(currentUserValue.hiddenmainDate);
            let totlsickValue = Number(currentUserValue.totlsick) || 0; // ✅ Handle undefined safely
            let recevdValue = Number(currentUserValue.recevd) || 0;

            let formattedDate = "-";
            let formattedTime = "-";

            // ✅ Correct Date Formatting
            if (currentUserValue.dateTime) {
                const dateObj = new Date(currentUserValue.dateTime);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = formatDate(dateObj);
                    formattedTime = formatTime(dateObj);
                }
            }

            totalSick += totlsickValue;
            totalReceived += recevdValue;

            // ✅ Correct table row & closing <td> issue
            tblBodyEl.innerHTML += `
                <tr>
                    <td>${formattedDatemain || "-"}</td> 
                    <td>${currentUserValue.hiddenbranch || "-"}</td> 
                    <td>${currentUserValue.usedstic || "-"}</td>
                    <td>${currentUserValue.damaged || "-"}</td>
                    <td>${totlsickValue}</td>
                    <td>${recevdValue}</td>
                    <td class="no-print">${formattedDate} ${formattedTime}</td> 
                </tr>
            `;
        });

        // ✅ Update totals safely
        if (totalStickerEl) totalStickerEl.textContent = `${totalSick}`;
        if (totalReceivedEl) totalReceivedEl.textContent = `${totalReceived}`;

        updateBalance(); // ✅ Ensure this function exists before calling it
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='7'>No Records Found</td></tr>"; // ✅ Fix column count
    }
});
