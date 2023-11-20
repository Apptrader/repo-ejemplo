const validateInput = (data) => {
    
    const validationErrors = {};
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    const decimalNumberPattern = /^\d+(\.\d{1,2})?$/;
    const datePattern =/^(19\d\d|20[0-9][0-9])-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)$/

    const validateField = (field, value, errorMessage) => {
        if (!value) {
            validationErrors[field] = `Please provide ${field.replace('_', ' ')}`;
        } 
        
        else if (field === 'name' && value.length > 40) {
            validationErrors[field] = `${field.replace('_', ' ')} should not exceed 40 characters`;
        } 
        
        else if (field === 'description' && value.length > 150) {
            validationErrors[field] = `${field.replace('_', ' ')} should not exceed 150 characters`;
        } 
        
        else if (field === 'image' && !urlPattern.test(value)) {
            validationErrors[field] = `Invalid ${field} URL`;
        } 
        
        else if (field === 'releasedDate' && !datePattern.test(value)) {
            validationErrors[field] = `Invalid ${field.replace('_', ' ')} format`;
        } 
        
        else if (field === 'rating') {
            const ratingValue = parseFloat(value);
            if (isNaN(ratingValue) || ratingValue > 10 || ratingValue < 1 || (ratingValue < 10 && !decimalNumberPattern.test(value))) {
                validationErrors[field] = `Invalid ${field} value`;
            }
        }
        
        else if (field === 'genres' && (value.length === 0 || value.length > 5)) {
            validationErrors[field] = `Select ${value.length === 0 ? 'at least one' : 'up to 5'} ${field}`;
        } 
        
        else if (field === 'platforms' && (value.length === 0 || value.length > 5)) {
            validationErrors[field] = `Select ${value.length === 0 ? 'at least one' : 'up to 5'} ${field}`;
        }
    };

    validateField('name', data.name);
    validateField('description', data.description);
    validateField('image', data.image);
    validateField('releasedDate', data.releasedDate);
    validateField('rating', data.rating);
    validateField('genres', data.genres);
    validateField('platforms', data.platforms);

    return validationErrors;
};

export default validateInput;