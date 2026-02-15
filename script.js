// ================= DYNAMIC FORM FIELDS =================

// Define fields for each competition type
const competitionFields = {
  dance: [
    { type: 'select', name: 'participationType', label: 'Participation Type *', required: true, options: ['Solo', 'Duo', 'Crew (3-8 members)', 'Crew (9+ members)'] },
    { type: 'text', name: 'crewName', label: 'Crew/Team Name (if applicable)', required: false },
    { type: 'select', name: 'danceStyle', label: 'Dance Style *', required: true, options: ['Hip Hop', 'Contemporary', 'Breaking', 'Popping', 'Locking', 'House', 'Krump', 'Freestyle', 'Other'] },
    { type: 'number', name: 'experience', label: 'Years of Experience *', required: true },
    { type: 'text', name: 'previousCompetitions', label: 'Previous Competitions (if any)', required: false }
  ],
  gaming: [
    { type: 'text', name: 'gamertag', label: 'Gamertag/Username *', required: true },
    { type: 'select', name: 'gameTitle', label: 'Game Title *', required: true, options: ['Valorant', 'CS:GO', 'League of Legends', 'Dota 2', 'Fortnite', 'PUBG', 'Call of Duty', 'FIFA', 'Other'] },
    { type: 'select', name: 'participationType', label: 'Participation Type *', required: true, options: ['Solo', 'Team (2-5 players)', 'Team (6+ players)'] },
    { type: 'text', name: 'teamName', label: 'Team Name (if applicable)', required: false },
    { type: 'select', name: 'rank', label: 'Current Rank/Level *', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Elite'] },
    { type: 'text', name: 'platform', label: 'Gaming Platform *', required: true }
  ],
  music: [
    { type: 'select', name: 'participationType', label: 'Participation Type *', required: true, options: ['Solo Artist', 'Band/Group', 'DJ'] },
    { type: 'text', name: 'artistName', label: 'Artist/Band Name *', required: true },
    { type: 'select', name: 'genre', label: 'Music Genre *', required: true, options: ['Pop', 'Rock', 'Hip Hop/Rap', 'Electronic/EDM', 'R&B', 'Jazz', 'Classical', 'Country', 'Metal', 'Other'] },
    { type: 'text', name: 'instrument', label: 'Primary Instrument/Skill *', required: true },
    { type: 'number', name: 'experience', label: 'Years of Experience *', required: true },
    { type: 'text', name: 'socialMedia', label: 'Social Media/Portfolio Link', required: false }
  ],
  sports: [
    { type: 'select', name: 'sportType', label: 'Sport Type *', required: true, options: ['Basketball', 'Football/Soccer', 'Cricket', 'Tennis', 'Badminton', 'Table Tennis', 'Athletics', 'Swimming', 'Other'] },
    { type: 'select', name: 'participationType', label: 'Participation Type *', required: true, options: ['Individual', 'Team'] },
    { type: 'text', name: 'teamName', label: 'Team Name (if applicable)', required: false },
    { type: 'select', name: 'ageCategory', label: 'Age Category *', required: true, options: ['Under 18', '18-25', '26-35', '36+'] },
    { type: 'number', name: 'experience', label: 'Years of Experience *', required: true },
    { type: 'text', name: 'achievements', label: 'Notable Achievements (if any)', required: false }
  ]
};

// Function to create dynamic fields
function createDynamicFields(competition) {
  const container = document.getElementById('dynamicFields');
  container.innerHTML = ''; // Clear existing fields

  if (!competition || !competitionFields[competition]) {
    return;
  }

  const fields = competitionFields[competition];
  
  fields.forEach(field => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group dynamic-field';
    
    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.textContent = field.label;
    formGroup.appendChild(label);

    let input;
    
    if (field.type === 'select') {
      input = document.createElement('select');
      input.id = field.name;
      input.name = field.name;
      
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = `Select ${field.label.replace(' *', '')}`;
      input.appendChild(defaultOption);
      
      // Add options
      field.options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase().replace(/\s+/g, '-');
        option.textContent = optionText;
        input.appendChild(option);
      });
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.id = field.name;
      input.name = field.name;
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.id = field.name;
      input.name = field.name;
      
      if (field.type === 'number') {
        input.min = '0';
        input.max = '50';
      }
    }
    
    if (field.required) {
      input.required = true;
    }
    
    formGroup.appendChild(input);
    container.appendChild(formGroup);
  });

  // Add animation
  const dynamicFields = container.querySelectorAll('.dynamic-field');
  dynamicFields.forEach((field, index) => {
    setTimeout(() => {
      field.style.opacity = '0';
      field.style.transform = 'translateY(20px)';
      field.style.transition = 'all 0.4s ease';
      
      setTimeout(() => {
        field.style.opacity = '1';
        field.style.transform = 'translateY(0)';
      }, 50);
    }, index * 50);
  });
}

// ================= FORM SUBMISSION TO GOOGLE SHEETS =================

// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

document.addEventListener('DOMContentLoaded', function() {
  const competitionSelect = document.getElementById('Competition');
  const form = document.getElementById('registerForm');
  
  // Listen for competition selection change
  if (competitionSelect) {
    competitionSelect.addEventListener('change', function() {
      createDynamicFields(this.value);
    });
  }
  
  // Handle form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Collect all form data including dynamic fields
      const formData = new FormData(form);
      const data = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      try {
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        // Show success message
        submitBtn.textContent = '✓ Registration Successful!';
        submitBtn.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
        
        // Reset form
        form.reset();
        document.getElementById('dynamicFields').innerHTML = '';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
        
      } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = '✗ Error - Please try again';
        submitBtn.style.background = 'linear-gradient(90deg, #ff4444, #cc0000)';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }
});
