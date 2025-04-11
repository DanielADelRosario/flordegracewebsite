document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        tabButtons: document.querySelectorAll('.navbar-nav .nav-link'),
        tabContents: document.querySelectorAll('.tab-content'),
        addEntryBtns: document.querySelectorAll('.btn-success'),
        modal: new bootstrap.Modal(document.getElementById('addEntryModal')),
        modalTitle: document.querySelector('#addEntryModal input[type="text"]'),
        modalDescription: document.querySelector('#addEntryModal textarea'),
        modalPublishedDate: document.querySelector('#addEntryModal input[placeholder^="Example:"]'),
        modalSaveBtn: document.querySelector('#addEntryModal .btn-primary'),
        modalFooter: document.querySelector('#addEntryModal .modal-footer'),
        boldBtn: document.querySelector('#addEntryModal .toolbar .btn:nth-child(1)'),
        italicBtn: document.querySelector('#addEntryModal .toolbar .btn:nth-child(2)'),
        alignBtn: document.querySelector('#addEntryModal .toolbar .btn:nth-child(3)'),
        sectionLists: {
            about: document.querySelector('#about .list-group'),
            announcements: document.querySelector('#announcements .list-group'),
            events: document.querySelector('#events .list-group'),
            faqs: document.querySelector('#faqs .list-group')
        }
    };

    // Initialize rich text editor
    const richTextContainer = document.createElement('div');
    Object.assign(richTextContainer.style, {
        minHeight: '120px',
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '0.5rem',
        outline: 'none'
    });
    richTextContainer.className = 'rich-text-editor';
    richTextContainer.contentEditable = true;
    elements.modalDescription.replaceWith(richTextContainer);

    // Data storage for all sections
    const sectionData = {
        about: [
            {
                id: 'about-1',
                title: 'About Flor de Grace',
                description: '<p>Information about our school...</p>',
                date: '3 days ago',
                dateLabel: 'Last updated'
            }
        ],
        announcements: [
            {
                id: 'announce-1',
                title: 'School Opening Update',
                description: '<p>Important information about school opening...</p>',
                date: 'May 15, 2023',
                dateLabel: 'Published'
            }
        ],
        events: [
            {
                id: 'event-1',
                title: 'Founding Anniversary',
                description: '<p>Details about our anniversary celebration...</p>',
                date: 'June 12, 2023',
                dateLabel: 'Event date'
            }
        ],
        faqs: [
            {
                id: 'faq-1',
                title: 'How to enroll online?',
                description: '<p>Step-by-step enrollment guide...</p>',
                date: '1 week ago',
                dateLabel: 'Last updated'
            }
        ]
    };

    // Current active section and editing state
    let currentSection = 'about';
    let currentEditingId = null;

    // Tab Functionality
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const section = button.dataset.tab;
            currentSection = section;
            
            // Update active tab UI
            elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            elements.tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(section).classList.add('active');
        });
    });

    // Text Formatting Functions
    const formatText = (command) => {
        document.execCommand(command, false, null);
        richTextContainer.focus();
    };

    elements.boldBtn.addEventListener('click', () => formatText('bold'));
    elements.italicBtn.addEventListener('click', () => formatText('italic'));

    // Alignment Handling
    const alignmentIcons = {
        left: '<i class="bi bi-text-left"></i>',
        center: '<i class="bi bi-text-center"></i>',
        right: '<i class="bi bi-text-right"></i>',
        justify: '<i class="bi bi-justify"></i>'
    };

    let currentAlign = 'left';
    elements.alignBtn.innerHTML = alignmentIcons.left;

    elements.alignBtn.addEventListener('click', () => {
        const alignments = Object.keys(alignmentIcons);
        currentAlign = alignments[(alignments.indexOf(currentAlign) + 1) % alignments.length];
        
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        if (currentAlign === 'justify') {
            document.execCommand('formatBlock', false, '<p>');
            const paragraphs = richTextContainer.querySelectorAll('p');
            
            if (paragraphs.length === 0) {
                const p = document.createElement('p');
                p.innerHTML = richTextContainer.innerHTML;
                richTextContainer.innerHTML = '';
                richTextContainer.appendChild(p);
            }
            
            richTextContainer.querySelectorAll('p').forEach(p => {
                p.style.textAlign = 'justify';
                p.style.textAlignLast = 'left';
            });
        } else {
            document.execCommand('justify' + currentAlign, false, null);
        }
        
        if (range) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        elements.alignBtn.innerHTML = alignmentIcons[currentAlign];
        richTextContainer.focus();
    });

    // Create entry HTML
    function createEntryHTML(entry, section) {
        const dateLabel = section === 'events' ? 'Event date' : 
                         section === 'announcements' ? 'Published' : 'Last updated';
        
        return `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom" data-id="${entry.id}">
                <div>
                    <h5 class="mb-1">${entry.title}</h5>
                    <small class="text-muted">${dateLabel}: ${entry.date}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2 edit-btn">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Render all sections
    function renderAllSections() {
        Object.keys(sectionData).forEach(section => {
            elements.sectionLists[section].innerHTML = '';
            sectionData[section].forEach(entry => {
                elements.sectionLists[section].insertAdjacentHTML('beforeend', createEntryHTML(entry, section));
            });
        });
        attachEventListeners();
    }

    // Attach event listeners to all buttons
    function attachEventListeners() {
        // Add entry buttons
        elements.addEntryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentEditingId = null;
                resetModal();
                elements.modal.show();
            });
        });

        // Delete buttons with SweetAlert
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryElement = e.target.closest('.list-group-item');
                const entryId = entryElement.dataset.id;
                const entryTitle = entryElement.querySelector('h5').textContent;
                const section = Object.keys(sectionData).find(section => 
                    sectionData[section].some(entry => entry.id === entryId)
                );
                
                Swal.fire({
                    title: 'Are you sure?',
                    text: `You're about to delete "${entryTitle}"`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        sectionData[section] = sectionData[section].filter(entry => entry.id !== entryId);
                        renderAllSections();
                        Swal.fire(
                            'Deleted!',
                            'Your entry has been deleted.',
                            'success'
                        );
                    }
                });
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryElement = e.target.closest('.list-group-item');
                const entryId = entryElement.dataset.id;
                const section = Object.keys(sectionData).find(section => 
                    sectionData[section].some(entry => entry.id === entryId)
                );
                
                if (section) {
                    currentSection = section;
                    const entry = sectionData[section].find(entry => entry.id === entryId);
                    if (entry) {
                        currentEditingId = entryId;
                        elements.modalTitle.value = entry.title;
                        richTextContainer.innerHTML = entry.description;
                        elements.modalPublishedDate.value = entry.date;
                        
                        elements.modalSaveBtn.textContent = 'Update';
                        elements.modal.show();
                    }
                }
            });
        });
    }

    // Save/Update entry with SweetAlert
    elements.modalSaveBtn.addEventListener('click', () => {
        const title = elements.modalTitle.value.trim();
        const description = richTextContainer.innerHTML;
        const date = elements.modalPublishedDate.value.trim() || new Date().toLocaleDateString();
        
        if (!title) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a title!',
                confirmButtonColor: '#198754'
            });
            return;
        }

        const action = currentEditingId ? 'updated' : 'saved';
        const actionText = currentEditingId ? 'Update' : 'Save';

        Swal.fire({
            title: `${actionText} Entry?`,
            html: `You're about to ${action}: <strong>"${title}"</strong>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${actionText} it!`,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                if (currentEditingId) {
                    // Update existing entry
                    sectionData[currentSection] = sectionData[currentSection].map(entry => 
                        entry.id === currentEditingId 
                            ? { ...entry, title, description, date }
                            : entry
                    );
                } else {
                    // Create new entry
                    const newEntry = {
                        id: Date.now().toString(),
                        title,
                        description,
                        date
                    };
                    sectionData[currentSection].unshift(newEntry);
                }
                
                renderAllSections();
                resetModal();
                elements.modal.hide();
                
                Swal.fire({
                    title: `${actionText}!`,
                    text: `Your entry has been ${action} successfully.`,
                    icon: 'success',
                    confirmButtonColor: '#198754',
                    timer: 1500
                });
            }
        });
    });

    // Reset modal
    function resetModal() {
        elements.modalTitle.value = '';
        richTextContainer.innerHTML = '';
        elements.modalPublishedDate.value = '';
        currentEditingId = null;
        elements.alignBtn.innerHTML = alignmentIcons.left;
        currentAlign = 'left';
        elements.modalSaveBtn.textContent = 'Save';
    }

    // Modal hide event
    document.getElementById('addEntryModal').addEventListener('hidden.bs.modal', resetModal);

    // Initial render
    renderAllSections();
});