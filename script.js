
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// import {GoogleGenAI} from '@google/genai';

// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// Example of how you might use the API if needed in the future:
/*
async function run() {
    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash-preview-04-17', // Updated model name
            contents: 'Suggest 3 facts about blood donation.',
        });
        let fullText = "";
        for await (const chunk of response) {
            fullText += chunk.text;
        }
        // Display fullText in a relevant part of the page
        // const factsElement = document.getElementById('donation-facts');
        // if (factsElement) factsElement.textContent = fullText;
        console.log(fullText);
    } catch (error) {
        console.error("Error fetching facts:", error);
        // const factsElement = document.getElementById('donation-facts');
        // if (factsElement) factsElement.textContent = "Could not load facts at this time.";
    }
}
// run(); // Call this function if you want to execute it
*/

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            nav.classList.toggle('active');
            menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"], .hero-section a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.startsWith('#')) {
                const targetId = hrefAttribute.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.setAttribute('aria-expanded', 'false');
                            menuToggle.textContent = '☰';
                        }
                    }
                }
            }
        });
    });

    // Mock form submission for "Find a Center"
    const findCenterForm = document.getElementById('find-center-form');
    const searchResultsDiv = document.getElementById('search-results');

    if (findCenterForm && searchResultsDiv) {
        findCenterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const zipInput = findCenterForm.querySelector('#zipcode');
            const zipCode = zipInput ? zipInput.value.trim() : '';

            searchResultsDiv.innerHTML = ''; // Clear previous results

            if (zipCode) {
                const loadingMessage = document.createElement('p');
                loadingMessage.textContent = `Searching for centers near ${zipCode}...`;
                searchResultsDiv.appendChild(loadingMessage);

                // Simulate API call
                setTimeout(() => {
                    searchResultsDiv.innerHTML = ''; // Clear loading message
                    const resultMessage = document.createElement('p');
                    if (zipCode === "90210" || zipCode === "10001") { // Example valid zip codes
                        resultMessage.innerHTML = `
                            <strong>Donation Centers Found Near ${zipCode}:</strong>
                            <ul>
                                <li>Community Blood Center - 123 Main St, Cityville (Open M-F 9am-5pm)</li>
                                <li>Red Cross Drive - Town Hall Annex, Suburbia (Next Drive: Tomorrow 10am-3pm)</li>
                            </ul>
                        `;
                    } else {
                        resultMessage.textContent = `No donation centers found for zip code ${zipCode}. Please try another location or check national blood bank websites.`;
                    }
                    searchResultsDiv.appendChild(resultMessage);
                }, 1500);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Please enter a zip code to search.';
                errorMessage.style.color = 'red';
                searchResultsDiv.appendChild(errorMessage);
            }
        });
    }

    // Donation Registration Form Handling
    const registrationForm = document.getElementById('donation-registration-form');
    const registrationFeedbackDiv = document.getElementById('registration-feedback');

    if (registrationForm && registrationFeedbackDiv) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registrationFeedbackDiv.innerHTML = ''; // Clear previous feedback
            registrationFeedbackDiv.className = 'form-feedback'; // Reset classes

            const formData = new FormData(registrationForm);
            const data = {};
            let isValid = true;

            // Basic Validation
            const requiredFields = ['fullName', 'email', 'phone', 'dob', 'streetAddress', 'city', 'state', 'regZipCode', 'preferredDate', 'preferredTime'];
            for (const fieldName of requiredFields) {
                const inputElement = registrationForm.querySelector(`[name="${fieldName}"]`);
                const formValue = formData.get(fieldName);
                data[fieldName] = formValue ? String(formValue).trim() : '';

                if (inputElement && inputElement.required && !data[fieldName]) {
                    isValid = false;
                }
            }
            // Specific check for consent checkbox
            const consentCheckbox = registrationForm.querySelector('#consent');
            if (consentCheckbox && consentCheckbox.required && !consentCheckbox.checked) {
                isValid = false;
                data['consent'] = 'false';
            } else if (consentCheckbox) {
                data['consent'] = String(consentCheckbox.checked);
            }


            if (isValid) {
                // Simulate successful submission
                registrationFeedbackDiv.classList.add('success');
                registrationFeedbackDiv.innerHTML = `<p>Thank you, <strong>${data.fullName}</strong>! Your registration has been received. We will contact you shortly to confirm your preferred appointment on ${data.preferredDate} around ${data.preferredTime}.</p>`;

                console.log('Mock Registration Data:', data); // Log data for demonstration
                registrationForm.reset(); // Clear the form
                registrationForm.style.display = 'none'; // Hide form after successful submission

                // Show form again after a delay, or provide a button to do so
                setTimeout(() => {
                    registrationForm.style.display = 'block';
                    registrationFeedbackDiv.innerHTML = '';
                    registrationFeedbackDiv.className = 'form-feedback';
                }, 10000); // Hide success message after 10s and show form

            } else {
                // Display error message
                registrationFeedbackDiv.classList.add('error');
                registrationFeedbackDiv.innerHTML = '<p>Please fill out all required fields and provide consent.</p>';
            }
        });
    }

    // Request Blood Form Handling
    const requestBloodForm = document.getElementById('request-blood-form');
    const donorSearchResultsDiv = document.getElementById('donor-search-results');

    if (requestBloodForm && donorSearchResultsDiv) {
        requestBloodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bloodGroupSelect = requestBloodForm.querySelector('#requiredBloodGroup');
            const requiredBloodGroup = bloodGroupSelect ? bloodGroupSelect.value : '';

            donorSearchResultsDiv.innerHTML = ''; // Clear previous results

            if (requiredBloodGroup) {
                const loadingMessage = document.createElement('p');
                loadingMessage.textContent = `Searching for potential donors with blood group ${requiredBloodGroup}...`;
                donorSearchResultsDiv.appendChild(loadingMessage);

                // Simulate API call and processing
                setTimeout(() => {
                    donorSearchResultsDiv.innerHTML = ''; // Clear loading message
                    const resultMessage = document.createElement('p');
                    resultMessage.innerHTML = `
                        <strong>Regarding your request for blood group ${requiredBloodGroup}:</strong><br>
                        We are checking our volunteer donor registry. If potential matches are available, our coordination team will be notified.
                        To proceed with an official request, please contact Blood Donation Connect directly at
                        <strong>info@blooddonationconnect.org</strong> or call <strong>(123) 456-7890</strong>
                        with your verified medical requirement details.
                        <br><br><em>We prioritize donor privacy and safety in all our facilitations.</em>
                    `;
                    donorSearchResultsDiv.appendChild(resultMessage);
                }, 2000);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Please select a required blood group to search.';
                errorMessage.style.color = 'red';
                donorSearchResultsDiv.appendChild(errorMessage);
            }
        });
    }

    // Eligibility Check for Last Donation Date
    const lastDonationDateInput = document.getElementById('lastDonationDate');
    const checkIntervalButton = document.getElementById('checkIntervalButton');
    const intervalCheckResultDiv = document.getElementById('intervalCheckResult');

    if (lastDonationDateInput && checkIntervalButton && intervalCheckResultDiv) {
        checkIntervalButton.addEventListener('click', () => {
            const lastDonationDateString = lastDonationDateInput.value;
            intervalCheckResultDiv.innerHTML = ''; // Clear previous result
            intervalCheckResultDiv.className = 'form-feedback'; // Reset classes

            if (!lastDonationDateString) {
                intervalCheckResultDiv.classList.add('error');
                intervalCheckResultDiv.textContent = 'Please select your last donation date.';
                return;
            }

            const lastDonationDate = new Date(lastDonationDateString);
            const today = new Date();

            // Reset time part for accurate day comparison
            lastDonationDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (isNaN(lastDonationDate.getTime())) {
                intervalCheckResultDiv.classList.add('error');
                intervalCheckResultDiv.textContent = 'Invalid date selected. Please choose a valid date.';
                return;
            }

            if (lastDonationDate > today) {
                intervalCheckResultDiv.classList.add('error');
                intervalCheckResultDiv.textContent = 'Last donation date cannot be in the future.';
                return;
            }

            const diffTime = today.getTime() - lastDonationDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const requiredInterval = 56; // 56 days for whole blood donation

            if (diffDays >= requiredInterval) {
                intervalCheckResultDiv.classList.add('success');
                intervalCheckResultDiv.textContent = `It has been ${diffDays} days since your last donation. You are likely eligible to donate again based on the ${requiredInterval}-day interval.`;
            } else {
                intervalCheckResultDiv.classList.add('error');
                const nextEligibleDate = new Date(lastDonationDate);
                nextEligibleDate.setDate(lastDonationDate.getDate() + requiredInterval);
                intervalCheckResultDiv.textContent = `It has been ${diffDays} days since your last donation. You need to wait at least ${requiredInterval - diffDays} more day(s). You may be eligible to donate again after ${nextEligibleDate.toLocaleDateString()}.`;
            }
        });
    }

});
