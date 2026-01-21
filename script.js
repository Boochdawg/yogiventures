// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    // TODO: Replace with your EmailJS Public Key after setup
    // Get it from: https://dashboard.emailjs.com/admin/integration
    // See EMAILJS_SETUP.md for detailed instructions
    // Initialize EmailJS with your Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("dV-b0Lj6QtnbBkGBa");
    }
    
    // Phone Number Click Tracking and Enhancement
    const phoneNumber = '4789722645';
    const formattedPhone = '478-972-2645';
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        // Ensure all phone links use the correct format
        link.setAttribute('href', `tel:${phoneNumber}`);
        link.setAttribute('aria-label', `Call ${formattedPhone}`);
        
        // Track phone link clicks (optional - for analytics)
        link.addEventListener('click', function(e) {
            // Log phone click for tracking (you can integrate with analytics later)
            console.log('Phone number clicked:', formattedPhone);
            
            // Optional: Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Format phone number input as user types (if phone input exists)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
                e.target.value = value;
            }
        });
        
        // Set placeholder with format hint
        phoneInput.setAttribute('placeholder', '478-972-2645');
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Business-specific conditional fields
    const businessSelect = document.getElementById('business');
    const conditionalFields = {
        'barbering': document.getElementById('barbering-fields'),
        'engineering': document.getElementById('engineering-fields'),
        'podcast': document.getElementById('podcast-fields')
    };

    if (businessSelect) {
        businessSelect.addEventListener('change', function() {
            // Hide all conditional fields
            Object.values(conditionalFields).forEach(field => {
                if (field) field.style.display = 'none';
            });

            // Show relevant conditional fields
            const selectedBusiness = this.value;
            if (conditionalFields[selectedBusiness]) {
                conditionalFields[selectedBusiness].style.display = 'block';
            }
            
            // Make message field optional for barbering, required for others
            const messageField = document.getElementById('message');
            const messageRequiredIndicator = document.getElementById('message-required-indicator');
            if (messageField) {
                if (selectedBusiness === 'barbering') {
                    messageField.removeAttribute('required');
                    if (messageRequiredIndicator) messageRequiredIndicator.style.display = 'none';
                } else {
                    messageField.setAttribute('required', 'required');
                    if (messageRequiredIndicator) messageRequiredIndicator.style.display = 'inline';
                }
            }
        });
        
        // Set initial state on page load
        const initialBusiness = businessSelect.value;
        const messageField = document.getElementById('message');
        const messageRequiredIndicator = document.getElementById('message-required-indicator');
        if (messageField && initialBusiness === 'barbering') {
            messageField.removeAttribute('required');
            if (messageRequiredIndicator) messageRequiredIndicator.style.display = 'none';
        }
    }

    // Pricing System for Barbering
    const barberingPricing = {
        base: {
            'men-fades': 30,
            'youth-fades': 20,
            'women-fades': 25,
            'mens-haircuts': 25,
            'straight-hair-shear': 45
        },
        addons: {
            'beard': 5,
            'precut-wash': 10,
            'enhancements': 10,
            'steam': 0, // Price to be determined or included
            'steam-exfoliation': 20
        }
    };

    // Handle "Unsure (Consultation Req)" service type - auto-check consultation
    const serviceTypeSelect = document.getElementById('service-type');
    const facialHairSelect = document.getElementById('facial-hair-grooming');
    const priceCalculation = document.getElementById('price-calculation');
    const priceItems = document.getElementById('price-items');
    const calculatedTotal = document.getElementById('calculated-total');
    
    // Consultation elements (defined early so they can be used in service type handler)
    const consultationCheckbox = document.getElementById('consultation-checkbox');
    const consultationFields = document.getElementById('consultation-fields');
    
    // Track which textarea fields have been interacted with (focused) - defined early for use in listeners
    const textareaInteracted = {
        'style-inspiration': false,
        'special-requests': false
    };
    
    function calculateBarberingPrice() {
        if (!priceCalculation || !priceItems || !calculatedTotal) return;
        
        const serviceType = serviceTypeSelect?.value || '';
        const facialHair = facialHairSelect?.value || '';
        const additionalServices = Array.from(document.querySelectorAll('input[name="additional-service"]:checked')).map(cb => cb.value);
        
        // Don't show price if no service selected
        if (!serviceType || serviceType === 'unsure-consultation') {
            priceCalculation.style.display = 'none';
            return;
        }
        
        let total = 0;
        let items = [];
        
        // Base service price
        if (barberingPricing.base[serviceType]) {
            const basePrice = barberingPricing.base[serviceType];
            total += basePrice;
            items.push({ name: serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text.split(' - ')[0], price: basePrice });
        }
        
        // Beard grooming
        if (facialHair === 'yes') {
            total += barberingPricing.addons.beard;
            items.push({ name: 'Facial Hair Grooming', price: barberingPricing.addons.beard });
        }
        
        // Additional services
        additionalServices.forEach(service => {
            if (barberingPricing.addons[service] !== undefined) {
                const price = barberingPricing.addons[service];
                if (price > 0) {
                    total += price;
                    const serviceName = document.querySelector(`label[for="additional-${service}"]`)?.textContent.split(' (')[0] || service;
                    items.push({ name: serviceName, price: price });
                }
            }
        });
        
        // Display price breakdown
        if (items.length > 0) {
            priceItems.innerHTML = items.map(item => `
                <div class="price-item">
                    <span class="price-item-name">${item.name}</span>
                    <span class="price-item-amount">$${item.price}</span>
                </div>
            `).join('');
            
            calculatedTotal.textContent = `$${total}`;
            priceCalculation.style.display = 'block';
        } else {
            priceCalculation.style.display = 'none';
        }
    }
    
    // Update price when selections change
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            if (this.value === 'unsure-consultation') {
                // Auto-check consultation checkbox
                if (consultationCheckbox) {
                    consultationCheckbox.checked = true;
                    if (consultationFields) {
                        consultationFields.style.display = 'block';
                        // Auto-scroll to consultation form when "Unsure" is selected
                        setTimeout(() => {
                            consultationFields.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                    }
                }
                if (priceCalculation) priceCalculation.style.display = 'none';
            } else {
                calculateBarberingPrice();
            }
        });
    }
    
    if (facialHairSelect) {
        facialHairSelect.addEventListener('change', calculateBarberingPrice);
    }
    
    // Listen for additional service checkbox changes
    document.querySelectorAll('input[name="additional-service"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateBarberingPrice);
    });

    // Handle "Other" checkbox in Need to Know
    const needOtherCheckbox = document.getElementById('need-other');
    const otherDescriptionGroup = document.getElementById('other-description-group');
    const otherDescription = document.getElementById('other-description');
    const charCount = document.getElementById('char-count');

    if (needOtherCheckbox && otherDescriptionGroup) {
        needOtherCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherDescriptionGroup.style.display = 'block';
                if (otherDescription) otherDescription.required = true;
            } else {
                otherDescriptionGroup.style.display = 'none';
                if (otherDescription) {
                    otherDescription.required = false;
                    otherDescription.value = '';
                    if (charCount) charCount.textContent = '0';
                }
            }
        });
    }

    // Character counter for other description
    if (otherDescription && charCount) {
        otherDescription.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 900) {
                this.value = this.value.substring(0, 900);
                charCount.textContent = 900;
            }
        });
    }

    // Consultation checkbox toggle for barbering
    // (consultationCheckbox and consultationFields already defined above)
    const consultationOnline = document.getElementById('consultation-online');
    const consultationCall = document.getElementById('consultation-call');
    const callInfo = document.getElementById('call-info');
    
    if (consultationCheckbox && consultationFields) {
        consultationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                consultationFields.style.display = 'block';
                // Reset scroll flag and interaction tracking when consultation is opened
                hasScrolledToRecommendations = false;
                textareaInteracted['style-inspiration'] = false;
                textareaInteracted['special-requests'] = false;
                // Don't auto-scroll when manually checking - only when "Unsure" is selected
            } else {
                consultationFields.style.display = 'none';
                // Hide recommendations when consultation is unchecked
                const recommendations = document.getElementById('cut-recommendations');
                if (recommendations) recommendations.style.display = 'none';
                // Reset scroll flag and interaction tracking
                hasScrolledToRecommendations = false;
                textareaInteracted['style-inspiration'] = false;
                textareaInteracted['special-requests'] = false;
            }
        });
    }

    // Handle consultation method selection (online vs call)
    if (consultationOnline && consultationCall && callInfo) {
        consultationOnline.addEventListener('change', function() {
            if (this.checked) {
                callInfo.style.display = 'none';
                // Show all consultation form fields
                const consultationIntro = document.querySelector('.consultation-intro');
                const hairLengthField = document.getElementById('hair-length')?.closest('.form-group');
                const hairTypeField = document.getElementById('hair-type')?.closest('.form-group');
                const stylePreferenceField = document.getElementById('style-preference')?.closest('.form-group');
                const beardStyleField = document.getElementById('beard-style')?.closest('.form-group');
                const styleInspirationField = document.getElementById('style-inspiration')?.closest('.form-group');
                const specialRequestsField = document.getElementById('special-requests')?.closest('.form-group');
                const cutRecommendationsDiv = document.getElementById('cut-recommendations');
                
                if (consultationIntro) consultationIntro.style.display = 'block';
                if (hairLengthField) hairLengthField.style.display = 'block';
                if (hairTypeField) hairTypeField.style.display = 'block';
                if (stylePreferenceField) stylePreferenceField.style.display = 'block';
                if (beardStyleField) beardStyleField.style.display = 'block';
                if (styleInspirationField) styleInspirationField.style.display = 'block';
                if (specialRequestsField) specialRequestsField.style.display = 'block';
                if (cutRecommendationsDiv) cutRecommendationsDiv.style.display = 'block';
            }
        });

        consultationCall.addEventListener('change', function() {
            if (this.checked) {
                callInfo.style.display = 'block';
                // Hide all consultation form fields (except the method selection)
                const consultationIntro = document.querySelector('.consultation-intro');
                const hairLengthField = document.getElementById('hair-length')?.closest('.form-group');
                const hairTypeField = document.getElementById('hair-type')?.closest('.form-group');
                const stylePreferenceField = document.getElementById('style-preference')?.closest('.form-group');
                const beardStyleField = document.getElementById('beard-style')?.closest('.form-group');
                const styleInspirationField = document.getElementById('style-inspiration')?.closest('.form-group');
                const specialRequestsField = document.getElementById('special-requests')?.closest('.form-group');
                const cutRecommendationsDiv = document.getElementById('cut-recommendations');
                
                if (consultationIntro) consultationIntro.style.display = 'none';
                if (hairLengthField) hairLengthField.style.display = 'none';
                if (hairTypeField) hairTypeField.style.display = 'none';
                if (stylePreferenceField) stylePreferenceField.style.display = 'none';
                if (beardStyleField) beardStyleField.style.display = 'none';
                if (styleInspirationField) styleInspirationField.style.display = 'none';
                if (specialRequestsField) specialRequestsField.style.display = 'none';
                if (cutRecommendationsDiv) cutRecommendationsDiv.style.display = 'none';
            }
        });
    }

    // Cut Recommendation Algorithm
    const cutRecommendations = {
        // Service base prices
        services: {
            'haircut': 35,
            'beard-trim': 20,
            'haircut-beard': 50,
            'line-up': 25,
            'hot-towel-shave': 30,
            'premium-package': 75
        },
        
        // Additional services
        addons: {
            'hair-wash': { name: 'Hair Wash & Conditioning', price: 10 },
            'scalp-treatment': { name: 'Scalp Treatment', price: 15 },
            'beard-oil': { name: 'Beard Oil & Styling', price: 8 },
            'hot-towel': { name: 'Hot Towel Treatment', price: 12 },
            'edge-up': { name: 'Precision Edge Up', price: 10 },
            'styling': { name: 'Premium Styling', price: 15 }
        },

        // Cut recommendations based on preferences
        getRecommendation: function(hairLength, hairType, stylePreference, beardStyle) {
            let recommendedCut = '';
            let baseService = '';
            let addons = [];
            let description = '';

            // Determine base cut based on style preference
            if (stylePreference === 'classic') {
                if (hairLength === 'very-short' || hairLength === 'short') {
                    recommendedCut = 'Classic Fade';
                    baseService = 'haircut';
                    description = 'A timeless fade that never goes out of style. Clean, professional, and always sharp.';
                    addons = ['edge-up', 'styling'];
                } else {
                    recommendedCut = 'Classic Taper';
                    baseService = 'haircut';
                    description = 'Traditional taper cut with clean lines. Perfect for a professional, polished look.';
                    addons = ['hair-wash', 'styling'];
                }
            } else if (stylePreference === 'modern') {
                if (hairLength === 'short' || hairLength === 'medium') {
                    recommendedCut = 'Textured Crop';
                    baseService = 'haircut';
                    description = 'Modern textured crop with movement and dimension. Trendy and versatile.';
                    addons = ['hair-wash', 'scalp-treatment', 'styling'];
                } else {
                    recommendedCut = 'Modern Pompadour';
                    baseService = 'haircut';
                    description = 'Contemporary pompadour with volume and style. Bold and statement-making.';
                    addons = ['hair-wash', 'styling'];
                }
            } else if (stylePreference === 'low-maintenance') {
                recommendedCut = 'Low Maintenance Fade';
                baseService = 'haircut';
                description = 'Easy-to-maintain fade that looks great between cuts. Perfect for busy lifestyles.';
                addons = ['edge-up'];
            } else if (stylePreference === 'bold') {
                if (hairLength === 'short' || hairLength === 'medium') {
                    recommendedCut = 'Bold Undercut';
                    baseService = 'haircut';
                    description = 'Sharp contrast undercut with clean lines. Makes a strong statement.';
                    addons = ['edge-up', 'styling'];
                } else {
                    recommendedCut = 'Creative Textured Cut';
                    baseService = 'haircut';
                    description = 'Unique textured cut with personalized styling. Stand out from the crowd.';
                    addons = ['hair-wash', 'scalp-treatment', 'styling'];
                }
            } else if (stylePreference === 'professional') {
                recommendedCut = 'Executive Cut';
                baseService = 'haircut';
                description = 'Professional cut with precision and polish. Perfect for the boardroom.';
                addons = ['hair-wash', 'edge-up', 'styling'];
            } else if (stylePreference === 'casual') {
                recommendedCut = 'Casual Textured Cut';
                baseService = 'haircut';
                description = 'Relaxed textured cut that\'s easy-going yet stylish. Perfect for everyday wear.';
                addons = ['hair-wash'];
            } else {
                // Default recommendation
                recommendedCut = 'Signature Cut';
                baseService = 'haircut';
                description = 'A personalized cut tailored to your hair type and preferences.';
                addons = ['hair-wash', 'styling'];
            }

            // Adjust for hair type
            if (hairType === 'curly' || hairType === 'coily') {
                addons.push('scalp-treatment');
            }

            // Add beard services if applicable
            if (beardStyle && beardStyle !== 'clean-shaven' && beardStyle !== '') {
                if (baseService === 'haircut') {
                    baseService = 'haircut-beard';
                } else {
                    addons.push('beard-oil');
                }
                
                if (beardStyle === 'styled') {
                    addons.push('hot-towel');
                }
            }

            // Special considerations
            if (stylePreference === 'bold' || stylePreference === 'modern') {
                if (!addons.includes('styling')) {
                    addons.push('styling');
                }
            }

            return {
                cut: recommendedCut,
                baseService: baseService,
                addons: addons,
                description: description
            };
        },

        // Calculate total price
        calculateTotal: function(baseService, addons) {
            let total = this.services[baseService] || 0;
            addons.forEach(addon => {
                if (this.addons[addon]) {
                    total += this.addons[addon].price;
                }
            });
            return total;
        }
    };

    // Track all consultation fields to know when all are answered
    const allConsultationFields = [
        'hair-length', 
        'hair-type', 
        'style-preference', 
        'beard-style', 
        'style-inspiration', 
        'special-requests'
    ];
    const recommendationsDiv = document.getElementById('cut-recommendations');
    let hasScrolledToRecommendations = false; // Track if we've already scrolled to recommendations
    
    // Mark textareas as interacted when user focuses on them
    const styleInspiration = document.getElementById('style-inspiration');
    const specialRequests = document.getElementById('special-requests');
    if (styleInspiration) {
        styleInspiration.addEventListener('focus', function() {
            textareaInteracted['style-inspiration'] = true;
        });
    }
    if (specialRequests) {
        specialRequests.addEventListener('focus', function() {
            textareaInteracted['special-requests'] = true;
        });
    }
    
    // Function to check if all consultation fields have been answered
    function areAllConsultationFieldsAnswered() {
        if (!consultationCheckbox || !consultationCheckbox.checked) return false;
        
        const hairLength = document.getElementById('hair-length')?.value || '';
        const hairType = document.getElementById('hair-type')?.value || '';
        const stylePreference = document.getElementById('style-preference')?.value || '';
        const beardStyle = document.getElementById('beard-style')?.value || '';
        
        // All select fields must have values (not empty/default)
        if (!hairLength || !hairType || !stylePreference || !beardStyle) return false;
        
        // Textareas must have been interacted with (focused) - they can be empty
        if (!textareaInteracted['style-inspiration'] || !textareaInteracted['special-requests']) return false;
        
        return true;
    }
    
    // Add event listeners to all consultation fields
    allConsultationFields.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            // For select elements, use 'change'
            // For textareas, use both 'input' and 'blur' to catch when user finishes typing
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', function() {
                    updateRecommendations();
                    checkAndScrollToRecommendations();
                });
            } else if (input.tagName === 'TEXTAREA') {
                input.addEventListener('blur', function() {
                    updateRecommendations();
                    checkAndScrollToRecommendations();
                });
                input.addEventListener('input', function() {
                    updateRecommendations();
                });
            }
        }
    });
    
    // Function to check if all fields are answered and scroll to recommendations
    function checkAndScrollToRecommendations() {
        if (hasScrolledToRecommendations) return; // Only scroll once
        
        if (areAllConsultationFieldsAnswered() && recommendationsDiv && recommendationsDiv.style.display !== 'none') {
            hasScrolledToRecommendations = true;
            setTimeout(() => {
                recommendationsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 200);
        }
    }

    function updateRecommendations() {
        if (!consultationCheckbox || !consultationCheckbox.checked) return;
        if (!recommendationsDiv) return;

        const hairLength = document.getElementById('hair-length')?.value || '';
        const hairType = document.getElementById('hair-type')?.value || '';
        const stylePreference = document.getElementById('style-preference')?.value || '';
        const beardStyle = document.getElementById('beard-style')?.value || '';

        // Check for Straight Hair recommendation based on length and type
        if ((hairLength === 'medium' || hairLength === 'long' || hairLength === 'very-long') && 
            (hairType === 'straight' || hairType === 'curly')) {
            // Show recommendation for Straight Hair cut
            const recommendedCutDiv = document.getElementById('recommended-cut');
            if (recommendedCutDiv) {
                const lengthText = hairLength === 'medium' ? 'Medium' : hairLength === 'long' ? 'Long' : 'Very Long';
                recommendedCutDiv.innerHTML = `
                    <div class="recommended-cut-card">
                        <h5>Straight Hair Cut and Style Service</h5>
                        <p>Based on your hair length (${lengthText}) and type (${hairType.charAt(0).toUpperCase() + hairType.slice(1)}), we recommend our Straight Hair Male Shear Cuts service. This specialized service is perfect for medium to long hair and provides precision cutting with professional styling.</p>
                        <p class="recommendation-price">Starting at $40</p>
                    </div>
                `;
            }
            
            // Show simple service recommendation
            const recommendedServicesDiv = document.getElementById('recommended-services');
            if (recommendedServicesDiv) {
                recommendedServicesDiv.innerHTML = `
                    <div class="services-list">
                        <div class="service-item main-service">
                            <span class="service-name">Straight Hair Male Shear Cuts</span>
                            <span class="service-price">$40</span>
                        </div>
                    </div>
                `;
            }
            
            // Show total
            const priceTotalDiv = document.getElementById('price-total');
            if (priceTotalDiv) {
                priceTotalDiv.innerHTML = `
                    <div class="total-card">
                        <span class="total-label">Estimated Total</span>
                        <span class="total-price">$40</span>
                    </div>
                `;
            }
            
            recommendationsDiv.style.display = 'block';
            // Check if all fields are answered before scrolling
            checkAndScrollToRecommendations();
            return;
        }

        // Only show recommendations if we have enough info (all required fields filled)
        if (hairLength && hairType && stylePreference) {
            const recommendation = cutRecommendations.getRecommendation(
                hairLength, 
                hairType, 
                stylePreference, 
                beardStyle
            );

            // Display recommended cut
            const recommendedCutDiv = document.getElementById('recommended-cut');
            if (recommendedCutDiv) {
                recommendedCutDiv.innerHTML = `
                    <div class="recommended-cut-card">
                        <h5>${recommendation.cut}</h5>
                        <p>${recommendation.description}</p>
                    </div>
                `;
            }

            // Display recommended services
            const recommendedServicesDiv = document.getElementById('recommended-services');
            if (recommendedServicesDiv) {
                let servicesHTML = '<div class="services-list">';
                servicesHTML += `<div class="service-item main-service">`;
                servicesHTML += `<span class="service-name">${cutRecommendations.services[recommendation.baseService] ? recommendation.baseService.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Haircut'}</span>`;
                servicesHTML += `<span class="service-price">$${cutRecommendations.services[recommendation.baseService] || 35}</span>`;
                servicesHTML += `</div>`;

                if (recommendation.addons.length > 0) {
                    recommendation.addons.forEach(addonKey => {
                        const addon = cutRecommendations.addons[addonKey];
                        if (addon) {
                            servicesHTML += `<div class="service-item addon-service">`;
                            servicesHTML += `<span class="service-name">+ ${addon.name}</span>`;
                            servicesHTML += `<span class="service-price">$${addon.price}</span>`;
                            servicesHTML += `</div>`;
                        }
                    });
                }

                servicesHTML += '</div>';
                recommendedServicesDiv.innerHTML = servicesHTML;
            }

            // Calculate and display total
            const total = cutRecommendations.calculateTotal(recommendation.baseService, recommendation.addons);
            const priceTotalDiv = document.getElementById('price-total');
            if (priceTotalDiv) {
                priceTotalDiv.innerHTML = `
                    <div class="total-card">
                        <span class="total-label">Estimated Total</span>
                        <span class="total-price">$${total}</span>
                    </div>
                `;
            }

            recommendationsDiv.style.display = 'block';
            // Check if all fields are answered before scrolling
            checkAndScrollToRecommendations();
        } else {
            recommendationsDiv.style.display = 'none';
        }
    }

    // Business-specific confirmation messages
    const confirmationMessages = {
        'barbering': {
            title: 'Thank You for Your Barbering Inquiry!',
            message: `We've received your appointment request and will contact you within 24 hours to confirm your preferred date and time. We're committed to delivering a premium grooming experience and making sure you look your best!`
        },
        'engineering': {
            title: 'Thank You for Your Engineering Inquiry!',
            message: `We've received your system engineering consultation request. Our team will review your project details and contact you within 48 hours to discuss how we can help optimize your infrastructure and systems.`
        },
        'podcast': {
            title: 'Thank You for Your Podcast Inquiry!',
            message: `We've received your inquiry about Cutz and Commentary Podcast. We'll contact you soon about your request, topic suggestion, or feedback. Stay tuned for upcoming episodes and thank you for being part of our community!`
        },
        'general': {
            title: 'Thank You for Contacting YogiVentures!',
            message: `We've received your message and will get back to you within 24-48 hours. We appreciate your interest in YogiVentures, LLC and look forward to connecting with you.`
        }
    };

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoader = document.getElementById('submit-loader');

    function showFormStatus(message, isError = false) {
        if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.className = `form-status ${isError ? 'error' : 'success'}`;
            formStatus.textContent = message;
            
            // Scroll to status
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function resetSubmitButton() {
        if (submitText) submitText.style.display = 'inline';
        if (submitLoader) submitLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoader) submitLoader.style.display = 'inline';
            if (formStatus) formStatus.style.display = 'none';

            try {
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                const businessType = data.business || 'general';

                // Format email content for better organization
                let emailContent = `NEW INQUIRY - ${businessType.toUpperCase()}\n\n`;
                emailContent += `=== CONTACT INFORMATION ===\n`;
                emailContent += `Name: ${data.name}\n`;
                emailContent += `Email: ${data.email}\n`;
                emailContent += `Phone: ${data.phone || 'Not provided'}\n\n`;
                
                emailContent += `=== BUSINESS INTEREST ===\n`;
                emailContent += `Business: ${data.business}\n\n`;

                // Add business-specific details
                if (businessType === 'barbering') {
                    emailContent += `=== BARBERING DETAILS ===\n`;
                    emailContent += `Service Type: ${data['service-type'] || 'Not specified'}\n`;
                    emailContent += `Facial Hair Grooming: ${data['facial-hair-grooming'] || 'Not specified'}\n`;
                    
                    // Handle multiple additional services (checkboxes)
                    const additionalServices = Array.isArray(data['additional-service']) 
                        ? data['additional-service'].join(', ') 
                        : (data['additional-service'] || 'None');
                    emailContent += `Additional Services: ${additionalServices}\n`;
                    
                    // Handle multiple need to know items (checkboxes)
                    const needToKnowItems = Array.isArray(data['need-to-know']) 
                        ? data['need-to-know'].join(', ') 
                        : (data['need-to-know'] || 'None');
                    emailContent += `Need to Know: ${needToKnowItems}\n`;
                    
                    // Check if "other" is selected and has description
                    const needToKnowArray = Array.isArray(data['need-to-know']) ? data['need-to-know'] : (data['need-to-know'] ? [data['need-to-know']] : []);
                    if (needToKnowArray.includes('other') && data['other-description']) {
                        emailContent += `Other Description: ${data['other-description']}\n`;
                    }
                    emailContent += `Preferred Date: ${data['preferred-date'] || 'Not specified'}\n`;
                    emailContent += `Preferred Time: ${data['preferred-time'] || 'Not specified'}\n`;
                    
                    // Calculate and include price
                    const serviceType = data['service-type'] || '';
                    const facialHair = data['facial-hair-grooming'] || '';
                    const additionalServicesArray = Array.isArray(data['additional-service']) ? data['additional-service'] : (data['additional-service'] ? [data['additional-service']] : []);
                    
                    // Use the barberingPricing object defined earlier
                    const pricing = {
                        base: {
                            'men-fades': 30,
                            'youth-fades': 20,
                            'women-fades': 25,
                            'mens-haircuts': 25,
                            'straight-hair-shear': 45
                        },
                        addons: {
                            'beard': 5,
                            'precut-wash': 10,
                            'enhancements': 10,
                            'steam': 0,
                            'steam-exfoliation': 20
                        }
                    };
                    
                    let calculatedPrice = 0;
                    if (pricing.base[serviceType]) {
                        calculatedPrice = pricing.base[serviceType];
                        if (facialHair === 'yes') {
                            calculatedPrice += pricing.addons.beard;
                        }
                        additionalServicesArray.forEach(service => {
                            if (pricing.addons[service] !== undefined && pricing.addons[service] > 0) {
                                calculatedPrice += pricing.addons[service];
                            }
                        });
                        emailContent += `\n=== ESTIMATED PRICE ===\n`;
                        emailContent += `Total: $${calculatedPrice}\n\n`;
                    }
                    
                    // Add consultation details if requested
                    if (data['consultation-requested'] === 'on') {
                        emailContent += `=== STYLE CONSULTATION REQUESTED ===\n`;
                        emailContent += `Consultation Method: ${data['consultation-method'] || 'online'}\n`;
                        emailContent += `Current Hair Length: ${data['hair-length'] || 'Not specified'}\n`;
                        emailContent += `Hair Type: ${data['hair-type'] || 'Not specified'}\n`;
                        emailContent += `Style Preference: ${data['style-preference'] || 'Not specified'}\n`;
                        emailContent += `Beard Style: ${data['beard-style'] || 'Not specified'}\n`;
                        emailContent += `Style Inspiration: ${data['style-inspiration'] || 'Not provided'}\n`;
                        emailContent += `Special Requests: ${data['special-requests'] || 'None'}\n\n`;
                    }
                } else if (businessType === 'engineering') {
                    emailContent += `=== ENGINEERING DETAILS ===\n`;
                    emailContent += `Project Type: ${data['project-type'] || 'Not specified'}\n`;
                    emailContent += `Company Size: ${data['company-size'] || 'Not specified'}\n\n`;
                } else if (businessType === 'podcast') {
                    emailContent += `=== PODCAST DETAILS ===\n`;
                    emailContent += `Inquiry Type: ${data['podcast-inquiry-type'] || 'Not specified'}\n`;
                    emailContent += `Episode or Topic Reference: ${data['episode-reference'] || 'Not specified'}\n\n`;
                }

                emailContent += `=== MESSAGE ===\n`;
                emailContent += `${data.message}\n\n`;
                emailContent += `---\n`;
                emailContent += `Submitted: ${new Date().toLocaleString()}\n`;

                // EmailJS Configuration
                // TODO: Replace these with your actual EmailJS credentials after setup
                // See EMAILJS_SETUP.md for detailed instructions
                const emailjsConfig = {
                    serviceId: 'service_lighwzi',      // Your EmailJS service ID
                    templateId: 'template_u747z1i',     // Your EmailJS template ID
                    publicKey: 'dV-b0Lj6QtnbBkGBa'         // Your EmailJS public key
                };

                // Format email subject
                const businessTypeFormatted = businessType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                const emailSubject = `New ${businessTypeFormatted} Inquiry - ${data.name}`;

                let emailSent = false;

                // Try to send email via EmailJS
                try {
                    // Check if EmailJS is configured
                    if (emailjsConfig.serviceId !== 'YOUR_SERVICE_ID' && 
                        emailjsConfig.templateId !== 'YOUR_TEMPLATE_ID' && 
                        emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
                        
                        await emailjs.send(
                            emailjsConfig.serviceId,
                            emailjsConfig.templateId,
                            {
                                to_email: 'dross.ross20@gmail.com',
                                to_name: 'Devon "Ross" Ross',
                                from_name: data.name,
                                from_email: data.email,
                                subject: emailSubject,
                                message: emailContent,
                                business_type: businessTypeFormatted,
                                phone: data.phone || 'Not provided',
                                reply_to: data.email
                            },
                            emailjsConfig.publicKey
                        );
                        emailSent = true;
                    } else {
                        throw new Error('EmailJS is not configured. See EMAILJS_SETUP.md.');
                    }
                } catch (emailError) {
                    console.error('EmailJS Error:', emailError);
                }

                if (emailSent) {
                    // Show success message with business-specific confirmation
                    const confirmation = confirmationMessages[businessType] || confirmationMessages['general'];
                    showFormStatus(`${confirmation.title}\n\n${confirmation.message}`, false);
                } else {
                    showFormStatus(
                        'We could not send your message by email yet. Please verify EmailJS settings in EMAILJS_SETUP.md or contact us directly at dross.ross20@gmail.com or 478-972-2645.',
                        true
                    );
                }

                // Reset form after showing success
                setTimeout(() => {
                    contactForm.reset();
                    // Hide conditional fields
                    Object.values(conditionalFields).forEach(field => {
                        if (field) field.style.display = 'none';
                    });
                    resetSubmitButton();
                }, 5000);

            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('Sorry, there was an error sending your message. Please try again or contact us directly at dross.ross20@gmail.com or call 478-972-2645', true);
                resetSubmitButton();
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe business cards
    const businessCards = document.querySelectorAll('.business-card');
    if (businessCards.length > 0) {
        businessCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Observe value items
    const valueItems = document.querySelectorAll('.value-item');
    if (valueItems.length > 0) {
        valueItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
});
