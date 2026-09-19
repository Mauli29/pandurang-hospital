// १. येथे तुमची खरी Supabase URL आणि पूर्ण Key टाका
const supabaseUrl = 'https://vszlbxsjruhlqmlplnnu.supabase.co';
const supabaseKey = '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzemxieHNqcnVobHFtbHBsbm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDY2NTMsImV4cCI6MjEwNTM4MjY1M30.fBEF8uaJx4c53h2CLyn51GcIvGfDhVIR3RaMk-qBozc'; // तुमची पूर्ण Key टाका

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- Login System ---
function checkLogin() {
  const id = document.getElementById('adminId').value;
  const pass = document.getElementById('adminPass').value;

  // येथे तुम्ही तुमचा ID आणि Password सेट करू शकता
  if (id === 'admin' && pass === 'hospital123') {
    // लॉगिन यशस्वी झाल्यावर लॉगिन स्क्रीन लपवा आणि डॅशबोर्ड दाखवा
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    // लॉगिन झाल्यावरच डेटाबेस मधून डेटा घ्या
    fetchAppointments();
  } else {
    // चुकीचा पासवर्ड टाकल्यास एरर दाखवा
    document.getElementById('loginError').style.display = 'block';
  }
}

function logout() {
  // लॉगआउट केल्यावर पुन्हा लॉगिन स्क्रीन दाखवा
  document.getElementById('adminId').value = '';
  document.getElementById('adminPass').value = '';
  document.getElementById('loginError').style.display = 'none';
  
  document.getElementById('dashboardSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'flex';
}

// --- Fetch Data ---
async function fetchAppointments(selectedDate = null) {
  const tbody = document.getElementById('tableBody');
  const recordCount = document.getElementById('recordCount');
  
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p>Fetching data...</p></td></tr>';

  let query = supabaseClient.from('appoinment').select('*').order('preferred_date', { ascending: true });

  if (selectedDate) {
    query = query.eq('preferred_date', selectedDate);
  }

  const { data, error } = await query;

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
    recordCount.innerText = "Error";
    return;
  }

  if (data.length === 0) {
    let msg = selectedDate ? `No appointments found for ${selectedDate}.` : 'No appointments found.';
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; font-weight:bold; color:#555;">${msg}</td></tr>`;
    recordCount.innerText = "0 Records";
    return;
  }

  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const symptomsText = item.symptoms ? item.symptoms : '<span style="color:#aaa;">-</span>';
    const row = `
      <tr>
        <td><strong>${index + 1}</strong></td>
        <td style="font-size: 1.05rem; font-weight: 500;">${item.full_name}</td>
        <td><a href="tel:${item.phone}" style="color: #0284c7; text-decoration: none;"><i class="fa-solid fa-phone"></i> ${item.phone}</a></td>
        <td><span class="badge">${item.department}</span></td>
        <td><span class="date-badge"><i class="fa-regular fa-calendar"></i> ${item.preferred_date}</span></td>
        <td>${symptomsText}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  recordCount.innerText = `Total Records: ${data.length}`;
}

function applyFilter() {
  const selectedDate = document.getElementById('filterDate').value;
  fetchAppointments(selectedDate);
}

function clearFilter() {
  document.getElementById('filterDate').value = '';
  fetchAppointments();
}