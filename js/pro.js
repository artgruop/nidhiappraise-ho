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
  // db
  import { database, ref, onValue } from "./firebaseConfig.js";

  const collectionListDB = ref(database, `stickerdb`);
  const tblBodyEl = document.querySelector("#tableBody");
  const filterNmeEl = document.querySelector("#workuser");
  function fetchData() {
      onValue(collectionListDB, (snapshot) => {
          if (snapshot.exists()) {
              let userArray = Object.entries(snapshot.val());
              const workuser = filterNmeEl.value.trim().toLowerCase(); 
  
              const filteredRows = userArray
                  .filter(([id, currentUserValue]) => {                      
                      return workuser === "all" || 
                             (currentUserValue.user?.toLowerCase() === workuser);
                  })
                  .map(([id, currentUserValue]) => {
                      let formattedDate = formatDate(currentUserValue.hiddenmainDate);
                      return `
                          <tr>
                              <td>${formattedDate || "-"}</td> 
                              <td style="width: 50%;">${currentUserValue.hiddenbranch || "-"}</td> 
                              <td>${currentUserValue.usedstic || "-"}</td>                    
                          </tr>
                      `;
                  })
                  .join("");
              tblBodyEl.innerHTML = filteredRows || "<tr><td colspan='3'>No Records Found</td></tr>";
          } else {
              tblBodyEl.innerHTML = "<tr><td colspan='3'>No Records Found</td></tr>";
          }
      });
  }
  
 
  filterNmeEl.addEventListener("change", fetchData);
  

  fetchData();