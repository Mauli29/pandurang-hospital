// १. Supabase Initialize करा (तुमची URL आणि Key येथे टाका)
const supabaseUrl = 'https://vszlbxsjruhlqmlplnnu.supabase.co'; // तुमची URL
const supabaseKey = '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzemxieHNqcnVobHFtbHBsbm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDY2NTMsImV4cCI6MjEwNTM4MjY1M30.fBEF8uaJx4c53h2CLyn51GcIvGfDhVIR3RaMk-qBozc'; // तुमची पूर्ण Key टाका

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// २. फॉर्म सबमिट झाल्यावर डेटा डेटाबेसमध्ये पाठवा
document.addEventListener('DOMContentLoaded', () => {
  const appointmentForm = document.getElementById('appointmentForm');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // पेज रिलोड होण्यापासून थांबवा

      // सबमिट बटण लोडिंग स्टेटमध्ये टाका
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      // फॉर्म मधील डेटा घ्या
      const formData = {
        full_name: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        preferred_date: document.getElementById('date').value,
        symptoms: document.getElementById('symptoms').value
      };

      // इथे आपण टेबलचे नाव बदलून 'appoinment' केले आहे
      const { data, error } = await supabaseClient
        .from('appoinment')
        .insert([formData]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Error: ' + error.message);
      } else {
        alert('Thank you! Your appointment request has been successfully recorded.');
        appointmentForm.reset(); // यशस्वी झाल्यावर फॉर्म रिकामा करा
      }

      // बटण पुन्हा पूर्ववत करा
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  }
});