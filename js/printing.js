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
//excell
function exportTable() {
    const branchValue = document.querySelector("#branch").value.trim();
    const dateValue = document.querySelector("#date").value.trim();   
    const userName = document.querySelector("#Appraiser").value || "N/A";
    if (!branchValue || !dateValue) {
        alert("⚠️ Please select a branch and date before exporting.");
        return;
    }
    let table = document.querySelector("table");
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([
        ["A R T LEASING LIMITED"],
        ["Gold Appraised Report"],
        [""],
        ["Branch:", branchValue],
        ["Date:", dateValue],
        ["AppraisedBy:", userName],
        [""],       
    ]);    
    let tableHeaders = [];
    document.querySelectorAll("table thead tr th").forEach(th => {
        tableHeaders.push(th.innerText.trim()); // Get header text
    });    
    let tableData = [];
    document.querySelectorAll("table tbody tr").forEach(row => {
        let rowData = [];
        row.querySelectorAll("td").forEach(td => {
            rowData.push(td.innerText.trim()); 
        });
        tableData.push(rowData);
    });  
    XLSX.utils.sheet_add_aoa(ws, [tableHeaders], { origin: -1 }); 
    XLSX.utils.sheet_add_aoa(ws, tableData, { origin: -1 });    
    XLSX.utils.book_append_sheet(wb, ws, `Report_${branchValue}_${dateValue}`); 
    XLSX.writeFile(wb, `Nidhi_Gold_Appraised_Report_${branchValue}_${dateValue}.xlsx`); 
}
// Print 
function printTable() {
    const branchValue = document.querySelector("#branch").value.trim(); 
    const dateValue = document.querySelector("#date").value.trim();
    const rowCount = document.querySelector("#rowCount_in").value;
    if (!branchValue || !dateValue) {
        alert("⚠️ Please select a branch and date before printing.");
        return;
    }
    let formattedDate = formatDate(dateValue);    
    const userName = document.querySelector("#Appraiser").value || "N/A"; 
    let printContent = document.querySelector(".table-container").innerHTML;
    printContent = printContent.replace(/<td[^>]*>\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}<\/td>/g, '');
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = `    
    <div class="title">
        <h1>CHENGANNUR NIDHI LIMITED</h1>
        <h4>Gold Appraised Report</h4>
    </div>
    <div class="info-table">       
        <p>Date:<span> ${formattedDate}</span></p>
        <p>Branch:<span>${branchValue}</span></p>
        <p>AppraisedBy:<span>${userName}</span></p>
         <p>Total Appraised:<span> ${rowCount}</span></p>
    </div> 
    <div class="maindata">
        ${printContent} 
    </div>
    <style>
        body {
            font-family: Arial, sans-serif;
            width: 210mm; 
            margin: 10mm auto;
            background-color: #fff;                    
        }    
        .title {
            text-align: center;
            padding-bottom: 5px;
            border-bottom: 2px solidrgb(12, 1, 1);
            color:rgb(2, 0, 0);
        }  
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }    
        h4 {
            font-size: 18px;
            font-weight: bold;
            margin: 2px;
        }    
        .info-table{
            width: 100%;
            display: block;
            justify-content: space-between;
            padding: 8px;
        }    
        .info-table p{
            font-size: 15px;
            margin:  3px;
            padding: 7px ;           
        }
        .info-table p span{
            font-size: 18px;
        }    
        .maindata {
            margin-top:3px;
            padding: 0px;
            background: #fff;  
            margin-left: 10px;          
        }
    </style>
    `;
    window.print(); 
    document.body.innerHTML = originalContent; 
}

