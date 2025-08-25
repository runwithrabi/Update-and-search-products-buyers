const sampleData = [
    { id: 'P001', name: 'Laptop', type: 'product', category: 'electronics', price: 899.99, location: 'Warehouse A', description: 'High-performance laptop with 16GB RAM and 512GB SSD' },
    { id: 'P002', name: 'Smartphone', type: 'product', category: 'electronics', price: 699.99, location: 'Warehouse B', description: 'Latest model with advanced camera system' },
    { id: 'P003', name: 'T-Shirt', type: 'product', category: 'clothing', price: 19.99, location: 'Warehouse C', description: 'Cotton t-shirt, available in multiple colors' },
    { id: 'P004', name: 'Jeans', type: 'product', category: 'clothing', price: 49.99, location: 'Warehouse C', description: 'Classic fit denim jeans' },
    { id: 'P005', name: 'Coffee Maker', type: 'product', category: 'electronics', price: 89.99, location: 'Warehouse A', description: 'Programmable coffee maker with timer' },
    { id: 'P006', name: 'Organic Apples', type: 'product', category: 'food', price: 4.99, location: 'Warehouse D', description: 'Fresh organic apples, pack of 6' },
    { id: 'B001', name: 'ABC Corporation', type: 'buyer', category: 'electronics', price: 10000, location: 'New York', description: 'Regular buyer of electronic components' },
    { id: 'B002', name: 'Fashion Outlet', type: 'buyer', category: 'clothing', price: 5000, location: 'Los Angeles', description: 'Clothing retailer with multiple locations' },
    { id: 'B003', name: 'Grocery Chain', type: 'buyer', category: 'food', price: 8000, location: 'Chicago', description: 'Supermarket chain with focus on organic products' },
    { id: 'B004', name: 'Tech Solutions', type: 'buyer', category: 'electronics', price: 15000, location: 'San Francisco', description: 'IT company purchasing hardware regularly' },
    { id: 'B005', name: 'Restaurant Group', type: 'buyer', category: 'food', price: 7500, location: 'Miami', description: 'Restaurant chain purchasing food supplies' },
];

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
const priceMinValue = document.getElementById('price-min-value');
const priceMaxValue = document.getElementById('price-max-value');
const filterLocation = document.getElementById('filter-location');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');
const resultsCount = document.getElementById('results-count');
const sortBy = document.getElementById('sort-by');
const resultsBody = document.getElementById('results-body');
const pagination = document.getElementById('pagination');

const updateSearchInput = document.getElementById('update-search-input');
const updateSearchBtn = document.getElementById('update-search-btn');
const updateResultsBody = document.getElementById('update-results-body');
const updateFormContainer = document.getElementById('update-form-container');
const updateForm = document.getElementById('update-form');
const recordId = document.getElementById('record-id');
const recordType = document.getElementById('record-type');
const recordName = document.getElementById('record-name');
const recordCategory = document.getElementById('record-category');
const recordPrice = document.getElementById('record-price');
const recordLocation = document.getElementById('record-location');
const recordDescription = document.getElementById('record-description');
const saveChangesBtn = document.getElementById('save-changes-btn');
const cancelUpdateBtn = document.getElementById('cancel-update-btn');
const feedbackMessage = document.getElementById('feedback-message');

let currentData = [...sampleData];
let currentPage = 1;
const itemsPerPage = 5;
let selectedRecord = null;

document.addEventListener('DOMContentLoaded', () => {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    priceMin.addEventListener('input', updatePriceRange);
    priceMax.addEventListener('input', updatePriceRange);
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    applyFiltersBtn.addEventListener('click', performSearch);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    sortBy.addEventListener('change', performSearch);
    
    updateSearchBtn.addEventListener('click', performUpdateSearch);
    updateSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performUpdateSearch();
    });
    
    updateForm.addEventListener('submit', saveChanges);
    cancelUpdateBtn.addEventListener('click', cancelUpdate);
    
    performSearch();
});

function updatePriceRange() {
    const minVal = parseInt(priceMin.value);
    const maxVal = parseInt(priceMax.value);
    
    if (minVal > maxVal) {
        priceMin.value = maxVal;
    }
    
    priceMinValue.textContent = `$${priceMin.value}`;
    priceMaxValue.textContent = `$${priceMax.value}`;
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    const categoryFilter = filterCategory.value;
    const minPrice = parseInt(priceMin.value);
    const maxPrice = parseInt(priceMax.value);
    const locationFilter = filterLocation.value.toLowerCase();
    
    let filteredData = sampleData.filter(item => {
     
        const matchesSearch = searchTerm === '' || 
            item.id.toLowerCase().includes(searchTerm) || 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm);
        
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
       
        const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
        
        const matchesLocation = locationFilter === '' || 
            item.location.toLowerCase().includes(locationFilter);
        
        return matchesSearch && matchesType && matchesCategory && matchesPrice && matchesLocation;
    });
  
    sortData(filteredData);
    
    currentData = filteredData;
    currentPage = 1;
    displayResults();
}

function sortData(data) {
    const sortOption = sortBy.value;
    
    switch (sortOption) {
        case 'name-asc':
            data.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            data.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            data.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            data.sort((a, b) => b.price - a.price);
            break;
        case 'date-asc':
            data.sort((a, b) => a.id.localeCompare(b.id));
            break;
        case 'date-desc':
            data.sort((a, b) => b.id.localeCompare(a.id));
            break;
    }
}

function displayResults() {
    resultsCount.textContent = `${currentData.length} results found`;
    
    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = currentData.slice(startIndex, endIndex);
    
    resultsBody.innerHTML = '';
    
    if (currentPageData.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = `<td colspan="7" class="no-results">No results found</td>`;
        resultsBody.appendChild(noResultsRow);
    } else {
        currentPageData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.location}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            resultsBody.appendChild(row);
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => viewRecord(btn.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editRecord(btn.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteRecord(btn.getAttribute('data-id')));
        });
    }
    
    displayPagination(totalPages);
}

function displayPagination(totalPages) {
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults();
        }
    });
    pagination.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayResults();
        });
        pagination.appendChild(pageButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayResults();
        }
    });
    pagination.appendChild(nextButton);
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    filterType.value = 'all';
    filterCategory.value = 'all';
    priceMin.value = 0;
    priceMax.value = 1000;
    filterLocation.value = '';
    updatePriceRange();
    performSearch();
}

// View record details
function viewRecord(id) {
    const record = sampleData.find(item => item.id === id);
    if (record) {
        // In a real application, you might show a modal with details
        // For this demo, we'll just show an alert
        alert(`Record Details:\n\nID: ${record.id}\nName: ${record.name}\nType: ${record.type}\nCategory: ${record.category}\nPrice/Value: $${record.price.toFixed(2)}\nLocation: ${record.location}\nDescription: ${record.description}`);
    }
}

// Edit record
function editRecord(id) {
    // Switch to update tab
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === 'update') {
            btn.click();
        }
    });
    
    // Find the record
    const record = sampleData.find(item => item.id === id);
    if (record) {
        selectedRecord = record;
        
        // Populate the update form
        recordId.value = record.id;
        recordType.value = record.type;
        recordName.value = record.name;
        recordCategory.value = record.category;
        recordPrice.value = record.price;
        recordLocation.value = record.location;
        recordDescription.value = record.description;
        
        // Show the update form
        updateFormContainer.style.display = 'block';
        
        // Scroll to the form
        updateFormContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        // Find the index of the record
        const index = sampleData.findIndex(item => item.id === id);
        if (index !== -1) {
            // Remove the record from the data
            sampleData.splice(index, 1);
            
            // Update the display
            performSearch();
            
            // Show success message
            showFeedback('Record deleted successfully', 'success');
        }
    }
}

// Perform search in update tab
function performUpdateSearch() {
    const searchTerm = updateSearchInput.value.toLowerCase();
    
    // Filter data
    let filteredData = sampleData.filter(item => {
        return searchTerm === '' || 
            item.id.toLowerCase().includes(searchTerm) || 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm);
    });
    
    // Display results in update tab
    displayUpdateResults(filteredData);
}

// Display search results in update tab
function displayUpdateResults(data) {
    // Clear previous results
    updateResultsBody.innerHTML = '';
    
    // Display data
    if (data.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = `<td colspan="7" class="no-results">No results found</td>`;
        updateResultsBody.appendChild(noResultsRow);
    } else {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.location}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.id}">Select</button>
                </td>
            `;
            updateResultsBody.appendChild(row);
        });
        
        // Add event listeners to select buttons
        document.querySelectorAll('#update-results-body .edit-btn').forEach(btn => {
            btn.addEventListener('click', () => selectRecordForUpdate(btn.getAttribute('data-id')));
        });
    }
}

// Select a record for updating
function selectRecordForUpdate(id) {
    const record = sampleData.find(item => item.id === id);
    if (record) {
        selectedRecord = record;
        
        // Populate the update form
        recordId.value = record.id;
        recordType.value = record.type;
        recordName.value = record.name;
        recordCategory.value = record.category;
        recordPrice.value = record.price;
        recordLocation.value = record.location;
        recordDescription.value = record.description;
        
        // Show the update form
        updateFormContainer.style.display = 'block';
        
        // Scroll to the form
        updateFormContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Save changes to a record
function saveChanges(e) {
    e.preventDefault();
    
    if (!selectedRecord) return;
    
    // Validate form
    if (!recordName.value.trim()) {
        showFeedback('Name is required', 'error');
        return;
    }
    
    // Update the record
    selectedRecord.name = recordName.value;
    selectedRecord.category = recordCategory.value;
    selectedRecord.price = parseFloat(recordPrice.value);
    selectedRecord.location = recordLocation.value;
    selectedRecord.description = recordDescription.value;
    
    // Reset form and selected record
    updateForm.reset();
    updateFormContainer.style.display = 'none';
    selectedRecord = null;
    
    // Update displays
    performSearch();
    performUpdateSearch();
    
    // Show success message
    showFeedback('Record updated successfully', 'success');
}

// Cancel update
function cancelUpdate() {
    updateForm.reset();
    updateFormContainer.style.display = 'none';
    selectedRecord = null;
}

// Show feedback message
function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = 'feedback-message';
    feedbackMessage.classList.add(type);
    feedbackMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        feedbackMessage.style.display = 'none';
    }, 3000);
}