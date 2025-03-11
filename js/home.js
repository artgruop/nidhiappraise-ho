
// Function to format date as DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return "Unknown Date"; // Handle missing values
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return the original if invalid
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // Load and fill 
/*document.addEventListener("DOMContentLoaded", () => {    
  const branchName = localStorage.getItem('brName');
  const mainDate = localStorage.getItem('mainDate');
  const formattedMainDate = formatDate(mainDate);

  const staff1 = localStorage.getItem('staff1') || "N/A";
  const staff2 = localStorage.getItem('staff2') || "N/A";
  const staff3 = localStorage.getItem('staff3') || " ";    
  if (branchName && mainDate) {        
      const mainDateEl = document.getElementById('mainDate');
      if (mainDateEl) mainDateEl.textContent = formattedMainDate;        
      const hiddenMainDateEl = document.getElementById('hiddenmainDate');
      if (hiddenMainDateEl) hiddenMainDateEl.value = formattedMainDate;       
      const branchEl = document.getElementById('branch');
      if (branchEl) branchEl.textContent = branchName;        
      const hiddenBranchEl = document.getElementById('hiddenbranch');
      if (hiddenBranchEl) hiddenBranchEl.value = branchName;        
      const brMgrEl = document.getElementById('brmgr');
      if (brMgrEl) brMgrEl.textContent = staff1;        
      const hiddenBrMgrEl = document.getElementById('hiddenbrmgr');
      if (hiddenBrMgrEl) hiddenBrMgrEl.value = staff1;
      const staff1El = document.getElementById('stff1');
      if (staff1El) staff1El.textContent = staff2;        
      const hiddenStaff1El = document.getElementById('hiddenstff1');
      if (hiddenStaff1El) hiddenStaff1El.value = staff2;
      const staff2El = document.getElementById('stff2');
      if (staff2El) staff2El.textContent = staff3;        
      const hiddenStaff2El = document.getElementById('hiddenstff2');
      if (hiddenStaff2El) hiddenStaff2El.value = staff3;
  } else {        
      window.location.href = 'info.html';
  }
});*/
    //branch name---------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
      // Retrieve branch information from localStorage
      const branchName = localStorage.getItem('userName');
    
      if (branchName) {
        // Display the branch name
        document.getElementById('userName').textContent = branchName;
        document.getElementById('hiddenuserName').value = branchName;
        
      } else {
        // Redirect back to login if no branch name found
        window.location.href = 'index.html';
      }
    });