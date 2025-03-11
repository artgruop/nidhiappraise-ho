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
        tblBodyEl.innerHTML = "";

        let totalSick = 0;
        let totalReceived = 0;

        userArray.forEach(([id, currentUserValue]) => {
            let formattedDate = formatDate(currentUserValue.hiddenmainDate);
            let totlsickValue = parseInt(currentUserValue.totlsick) || 0;
            let recevdValue = parseInt(currentUserValue.received) || 0;

            totalSick += totlsickValue;
            totalReceived += recevdValue;

            tblBodyEl.innerHTML += `
                <tr>
                    <td>${formattedDate || "-"}</td> 
                    <td>${currentUserValue.hiddenbranch || "-"}</td> 
                    <td>${currentUserValue.usedstic || "-"}</td>
                    <td>${currentUserValue.damaged || "-"}</td>
                    <td>${totlsickValue}</td>
                    <td>${recevdValue}</td>
                </tr>
            `;
        });
        // Update totals
        totalStickerEl.textContent = `${totalSick}`;
        totalReceivedEl.textContent = `${totalReceived}`;        

        updateBalance();
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='6'>No Records Found</td></tr>";
        
    }
});