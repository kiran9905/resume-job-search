const skillsList = ['Java', 'JavaScript', 'Python', 'Project Management', 'React', 'Node.js', 'C++', 'SQL', 'HTML', 'CSS', 'Nakuruai'];
// Create a LinkedIn job search link for a given skill
function createJobSearchLink(skill) {
  const jobLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}`; // Build LinkedIn search URL
  const jobLinkText = document.createElement('a'); // Create <a> tag
  jobLinkText.href = jobLink;
  jobLinkText.target = '_blank'; // Open in new tab
  jobLinkText.textContent = `Search for ${skill} jobs on LinkedIn`;
  document.getElementById('jobLinkContainer').appendChild(jobLinkText); // Add link to the page
}

// Check which skills from skillsList are found in the text
function extractSkills(text) {
  let foundSkills = [];
  skillsList.forEach(skill => {
    if (text.includes(skill)) { // Check if skill exists in text
      foundSkills.push(skill);
    }
  });
  return foundSkills;
}
// When a PDF file is selected
document.getElementById('pdfFile').addEventListener('change', function(e) {
  const file = e.target.files[0]; // Get the selected file
  const reader = new FileReader(); // Create a FileReader instance

  // When the file is loaded
  reader.onload = function() {
    const typedArray = new Uint8Array(reader.result); // Convert to typed array for pdf.js

    // Use PDF.js to read the PDF
    pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
      let output = ''; // To collect all text from all pages

      // Function to read one page at a time
      const readPage = (pageNum) => {
        pdf.getPage(pageNum).then(function(page) {
          page.getTextContent().then(function(textContent) {
            const text = textContent.items.map(item => item.str).join(' '); // Join all text items
            output += `Page ${pageNum}:\n${text}\n\n`;

            console.log(`Page ${pageNum} Text:`, text); // Optional debug log

            // Continue to next page or finish
            if (pageNum < pdf.numPages) {
              readPage(pageNum + 1); // Read next page
            } else {
              // Once all pages are read
              document.getElementById('output').textContent = output;

              // Find matching skills
              const skillsInResume = extractSkills(output);
              console.log('Found skills:', skillsInResume); // Debug log

              // Display job links or no skills message
              if (skillsInResume.length > 0) {
                skillsInResume.forEach(skill => {
                  createJobSearchLink(skill); // Add job link for each found skill
                });
              } else {
                document.getElementById('jobLinkContainer').innerHTML = 'No skills found in the resume.';
              }
            }
          });
        });
      };

      readPage(1); // Start from first page
    }).catch(function(error) {
      console.log('Error loading PDF: ', error); // If PDF loading fails
    });
  };

  reader.readAsArrayBuffer(file); // Start reading the file
});
