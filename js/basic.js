const populationURL ="https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
const employmentURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";


const fetchStatFinData = async (URL, body) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return response.json();
};



const initializeCode = async () => {
    const populationBody = await (await fetch("../json/population_query.json")).json();
    const employmentBody = await (await fetch("../json/employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all ([
        fetchStatFinData(populationURL, populationBody),
        fetchStatFinData(employmentURL, employmentBody)
    ]);

    const setupTable = (populationData, employmentData) => {
        const tbody = document.getElementById("table-rows");
        
        // Get the data array and municipality names from the response
        const values = populationData.value;
        const municipalities = populationData.dimension.Alue.category.label;

        // Get the employment data
        const employmentValues = employmentData.value;

        // Clear any existing rows
        tbody.innerHTML = '';

        // Create a row for each municipality
        Object.entries(municipalities).forEach(([code, name], index) => {
            const row = document.createElement("tr");
            
            // Create and populate municipality name cell
            const nameCell = document.createElement("td");
            nameCell.textContent = name;
            
            // Create and populate population cell
            const popCell = document.createElement("td");
            popCell.textContent = values[index];

            // Create and populate employment cell
            const empCell = document.createElement("td");
            empCell.textContent = employmentValues[index]
            
            // Add cells to row
            row.appendChild(nameCell);
            row.appendChild(popCell);
            row.appendChild(empCell);
            
            // Add row to table body
            tbody.appendChild(row);
        });
    };

    setupTable(populationData, employmentData);
}

// Add this line at the end of your file to initialize the code when the page loads
window.addEventListener('load', initializeCode);