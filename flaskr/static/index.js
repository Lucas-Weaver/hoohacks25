

document.addEventListener('DOMContentLoaded', function() {
            
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const applyRecommendations = document.getElementById('apply-recommendations');
    const clearChat = document.getElementById('clear-chat');
    
    // Store conversation history
    let conversationHistory = [];
    
    // Store the latest AI recommendations
    let latestRecommendations = {};
    
    // Function to add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.innerHTML = message + '<span class="message-time">Just now</span>';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to get AI response via Flask backend
    async function getAIResponse(userMessage) {
        // Add loading message
        const loadingId = 'loading-message-' + Date.now();
        addMessage('<div id="' + loadingId + '">Thinking...</div>');
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: userMessage,
                    conversation: conversationHistory
                })
            });
            
            const data = await response.json();
            
            // Remove loading message
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.remove();
            }
            
            if (data.response) {
                // Update conversation history
                conversationHistory = data.conversation || conversationHistory;
                
                // Add AI message to chat
                addMessage(data.response);
                
                // Store recommendations if available
                if (data.form_updates && Object.keys(data.form_updates).length > 0) {
                    latestRecommendations = data.form_updates;
                    
                    // Notify user that recommendations are available
                    const noticeDiv = document.createElement('div');
                    noticeDiv.className = 'message ai-message';
                    noticeDiv.innerHTML = 
                        '<div class="alert alert-info py-2 mb-0">I have nutritional recommendations based on our conversation. ' +
                        'Click "Apply AI Recommendations" to update the form.</div>' +
                        '<span class="message-time">Just now</span>';
                    chatMessages.appendChild(noticeDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Highlight the apply recommendations button
                    applyRecommendations.classList.add('btn-primary');
                    applyRecommendations.classList.remove('btn-outline-secondary');
                    
                    // Make the button pulse to draw attention
                    applyRecommendations.classList.add('animate-pulse');
                    setTimeout(() => {
                        applyRecommendations.classList.remove('animate-pulse');
                    }, 3000);
                }
            } else {
                addMessage("I'm having trouble understanding. Could you rephrase?");
            }
        } catch (error) {
            console.error("Error:", error);
            
            // Remove loading message
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.remove();
            }
            
            addMessage("Sorry, I encountered an error while processing your request.");
        }
    }
    
    // Function to apply recommendations to form fields
    function applyFormRecommendations(recommendations) {
        // Map of form field IDs to their corresponding recommendation keys
        const fieldMap = {
            'calories': 'calories',
            'protein': 'protein',
            'carbs': 'carbs',
            'fat': 'fat',
            'fiber': 'fiber',
            'sugar': 'sugar',
            'sodium': 'sodium'
        };
        
        // Apply each recommendation to its corresponding form field
        let appliedChanges = [];
        for (const [field, value] of Object.entries(recommendations)) {
            if (fieldMap[field] && document.getElementById(field)) {
                document.getElementById(field).value = value;
                appliedChanges.push(`${field}: ${value}`);
            }
        }
        
        // Handle dietary preferences if present in recommendations
        if (recommendations.diet_type) {
            const dietTypes = Array.isArray(recommendations.diet_type) 
                ? recommendations.diet_type 
                : [recommendations.diet_type];
                
            dietTypes.forEach(diet => {
                const dietCheckbox = document.getElementById(diet);
                if (dietCheckbox) {
                    dietCheckbox.checked = true;
                    appliedChanges.push(`diet: ${diet}`);
                }
            });
        }
        
        // Handle allergies if present
        if (recommendations.allergies) {
            const allergies = Array.isArray(recommendations.allergies) 
                ? recommendations.allergies 
                : [recommendations.allergies];
                
            allergies.forEach(allergy => {
                const allergyCheckbox = document.getElementById(allergy);
                if (allergyCheckbox) {
                    allergyCheckbox.checked = true;
                    appliedChanges.push(`allergy: ${allergy}`);
                }
            });
        }
        
        return appliedChanges;
    }
    
    // Handle send button click
    chatSend.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            getAIResponse(message);
        }
    });
    
    // Handle enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            chatSend.click();
        }
    });
    
    // Apply AI recommendations
    applyRecommendations.addEventListener('click', function() {
        if (Object.keys(latestRecommendations).length > 0) {
            const changes = applyFormRecommendations(latestRecommendations);
            
            // Reset button appearance
            applyRecommendations.classList.remove('btn-primary');
            applyRecommendations.classList.add('btn-outline-secondary');
            
            // Provide feedback about applied changes
            addMessage(`I've applied the following recommendations to your form: ${changes.join(', ')}. Feel free to adjust these values to better fit your specific needs.`);
            
            // Clear the recommendations
            latestRecommendations = {};
        } else {
            addMessage("I don't have any recommendations at the moment. Let me know your fitness goals, age, weight, height, and activity level so I can provide personalized recommendations.");
        }
    });
    
    // Clear chat
    clearChat.addEventListener('click', function() {
        chatMessages.innerHTML = '<div class="message ai-message">Hello! I\'m your nutrition assistant. I can help you determine appropriate calorie and macronutrient goals based on your personal needs. What\'s your goal? (Weight loss, maintenance, muscle gain, etc.)<span class="message-time">Just now</span></div>';
        conversationHistory = [];
        latestRecommendations = {};
        applyRecommendations.classList.remove('btn-primary');
        applyRecommendations.classList.add('btn-outline-secondary');
    });
    
    // Add a helper function for the AI to extract user information from chat
    function extractUserInformation(userMessage) {
        // This would be a more sophisticated function in a real implementation
        // that uses NLP to extract user information like height, weight, goals, etc.
        const info = {};
        
        // Simple regex patterns to detect common information
        const heightPattern = /(\d+)\s*(cm|feet|ft|'|inches|in|")/i;
        const weightPattern = /(\d+)\s*(kg|kilos|pounds|lbs)/i;
        const agePattern = /(\d+)\s*(years old|years|year old|year|yo)/i;
        
        // Extract information using regex
        const heightMatch = userMessage.match(heightPattern);
        if (heightMatch) {
            info.height = {
                value: heightMatch[1],
                unit: heightMatch[2]
            };
        }
        
        const weightMatch = userMessage.match(weightPattern);
        if (weightMatch) {
            info.weight = {
                value: weightMatch[1],
                unit: weightMatch[2]
            };
        }
        
        const ageMatch = userMessage.match(agePattern);
        if (ageMatch) {
            info.age = ageMatch[1];
        }
        
        return info;
    }


    // Add this to your existing script, within the DOMContentLoaded event listener

    // Animation for results section
    function animateResults() {
        const resultSection = document.getElementById('results-section');
        if (resultSection) {
            // Animate list items with staggered delay
            const listItems = resultSection.querySelectorAll('.stagger-item');
            listItems.forEach((item, index) => {
                item.style.animationDelay = `${0.1 + (index * 0.1)}s`;
            });
            
            // Scroll to results section
            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    // Call this function when the page loads if results are present
    animateResults();

    // Add event listener to the form submission
    document.querySelector('form').addEventListener('submit', function() {
        // Add loading indicator
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating...';
        submitBtn.disabled = true;
    });
});