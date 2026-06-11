document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const profileNameInput = document.getElementById('profileName');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const deleteProfileBtn = document.getElementById('deleteProfileBtn');
    const profileSelector = document.getElementById('profileSelector');
    const exportProfileBtn = document.getElementById('exportProfileBtn');
    const importProfileInput = document.getElementById('importProfileInput');
    const searchBtn = document.getElementById('searchBtn');

    const serviceFormTitle = document.getElementById('serviceFormTitle');
    const editingServiceIdInput = document.getElementById('editingServiceId');
    const serviceNameInput = document.getElementById('serviceName');
    const serviceUrlTemplateInput = document.getElementById('serviceUrlTemplate');
    const serviceTargetInput = document.getElementById('serviceTargetInput');
    const serviceNotesInput = document.getElementById('serviceNotes');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const cancelEditServiceBtn = document.getElementById('cancelEditServiceBtn');
    const osintServicesListDiv = document.getElementById('osintServicesListContainer');
    const exportServicesBtn = document.getElementById('exportServicesBtn');
    const importServicesInput = document.getElementById('importServicesInput');
    const generalNotesTextarea = document.getElementById('general_notes');

    const allInputFields = [
        'name', 'surname', 'fathername', 'phone', 'address', 'email',
        'generic_username', 'telegram_tag', 'instagram_tag', 'tiktok_tag',
        'github_tag', 'facebook_username', 'linkedin_username', 'x_tag',
        'discord_tag', 'vk_tag', 'crypto_wallet', 'ip_address',
        'photo_notes', 'metadata_notes'
    ];

    function downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toastNotification');
        toast.textContent = message;
        toast.className = 'toast show'; 
        if (type === 'success') toast.classList.add('success');
        else if (type === 'error') toast.classList.add('error');
        else toast.classList.add('info');
        
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, duration);
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = 'Switch to Light Mode';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleBtn.textContent = 'Switch to Dark Mode';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('osint_theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('osint_theme', newTheme);
        applyTheme(newTheme);
        showToast(`Theme switched to ${newTheme}`, 'info');
    });

    const PROFILE_LIST_KEY = 'osint_profiles_list_v2';
    const PROFILE_PREFIX = 'osint_profile_v2_';

    function getProfileList() {
        return JSON.parse(localStorage.getItem(PROFILE_LIST_KEY)) || [];
    }

    function saveProfileList(list) {
        localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(list.sort()));
    }
    
    function saveProfileData(profileName, data) {
        localStorage.setItem(PROFILE_PREFIX + profileName, JSON.stringify(data));
        let profiles = getProfileList();
        if (!profiles.includes(profileName)) {
            profiles.push(profileName);
            saveProfileList(profiles);
        }
    }

    function populateProfileSelector() {
        const profiles = getProfileList();
        profileSelector.innerHTML = '<option value="">Select a Profile to Load</option>';
        profiles.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            profileSelector.appendChild(option);
        });
    }

    saveProfileBtn.addEventListener('click', () => {
        const profileName = profileNameInput.value.trim();
        if (!profileName) {
            showToast('Please enter a profile name.', 'error');
            return;
        }

        const profileData = { profileName }; 
        allInputFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) profileData[id] = el.value;
        });
        profileData.general_notes = generalNotesTextarea.value;
        allInputFields.forEach(id => {
            const checkbox = document.getElementById(`${id}_exclude`);
            if (checkbox) profileData[`${id}_exclude`] = checkbox.checked;
        });
        profileData.trigger_image_search_cb = document.getElementById('trigger_image_search_cb').checked;
        profileData.trigger_metadata_search_cb = document.getElementById('trigger_metadata_search_cb').checked;

        saveProfileData(profileName, profileData);
        populateProfileSelector(); 
        profileSelector.value = profileName;
        showToast(`Profile "${profileName}" saved successfully!`, 'success');
    });

    profileSelector.addEventListener('change', () => {
        const profileName = profileSelector.value;
        if (profileName) {
            const profileDataString = localStorage.getItem(PROFILE_PREFIX + profileName);
            if (profileDataString) {
                try {
                    const profileData = JSON.parse(profileDataString);
                    profileNameInput.value = profileData.profileName || profileName; 
                    allInputFields.forEach(id => {
                        const el = document.getElementById(id);
                        if (el && profileData[id] !== undefined) el.value = profileData[id];
                        
                        const checkbox = document.getElementById(`${id}_exclude`);
                        if (checkbox && profileData[`${id}_exclude`] !== undefined) checkbox.checked = profileData[`${id}_exclude`];
                        else if (checkbox) checkbox.checked = false;
                    });
                    generalNotesTextarea.value = profileData.general_notes || '';
                    document.getElementById('trigger_image_search_cb').checked = profileData.trigger_image_search_cb || false;
                    document.getElementById('trigger_metadata_search_cb').checked = profileData.trigger_metadata_search_cb || false;
                    showToast(`Profile "${profileName}" loaded.`, 'info');
                } catch (e) {
                    showToast(`Error loading profile "${profileName}".`, 'error');
                    console.error("Error parsing profile data:", e);
                }
            }
        } else {
            profileNameInput.value = '';
            allInputFields.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
                const checkbox = document.getElementById(`${id}_exclude`);
                if (checkbox) checkbox.checked = false;
            });
            generalNotesTextarea.value = '';
            document.getElementById('trigger_image_search_cb').checked = false;
            document.getElementById('trigger_metadata_search_cb').checked = false;
        }
    });

    deleteProfileBtn.addEventListener('click', () => {
        const profileName = profileSelector.value;
        if (!profileName) {
            showToast('Please select a profile to delete.', 'error');
            return;
        }
        if (confirm(`Are you sure you want to delete profile "${profileName}"?`)) {
            localStorage.removeItem(PROFILE_PREFIX + profileName);
            let profiles = getProfileList();
            profiles = profiles.filter(p => p !== profileName);
            saveProfileList(profiles);
            populateProfileSelector();
            profileNameInput.value = '';
            profileSelector.dispatchEvent(new Event('change'));
            showToast(`Profile "${profileName}" deleted.`, 'success');
        }
    });

    exportProfileBtn.addEventListener('click', () => {
        const profileName = profileSelector.value;
        if (!profileName) {
            showToast('Please select a profile to export.', 'error');
            return;
        }
        const profileDataString = localStorage.getItem(PROFILE_PREFIX + profileName);
        if (profileDataString) {
            try {
                const profileData = JSON.parse(profileDataString);
                downloadJSON(profileData, `${profileName}_osint_profile.json`);
                showToast(`Profile "${profileName}" exported.`, 'success');
            } catch (e) {
                showToast('Error exporting profile.', 'error');
            }
        } else {
            showToast('Selected profile data not found.', 'error');
        }
    });

    importProfileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedProfile = JSON.parse(e.target.result);
                    if (importedProfile && importedProfile.profileName) {
                        const existingProfiles = getProfileList();
                        if (existingProfiles.includes(importedProfile.profileName)) {
                            if (!confirm(`Profile "${importedProfile.profileName}" already exists. Overwrite?`)) {
                                importProfileInput.value = ''; 
                                return;
                            }
                        }
                        saveProfileData(importedProfile.profileName, importedProfile);
                        populateProfileSelector();
                        profileSelector.value = importedProfile.profileName;
                        profileSelector.dispatchEvent(new Event('change')); 
                        showToast(`Profile "${importedProfile.profileName}" imported successfully.`, 'success');
                    } else {
                        showToast('Invalid profile file format (missing profileName).', 'error');
                    }
                } catch (err) {
                    showToast('Error importing profile: Invalid JSON file.', 'error');
                    console.error("Error importing profile:", err);
                }
                importProfileInput.value = ''; 
            };
            reader.readAsText(file);
        }
    });


    const OSINT_SERVICES_STORAGE_KEY = 'osint_all_services_v1';
    let osintServicesGlobal = []; 

    const initialDefaultOsintServices = [
        { id: 'service_tel_profile', name: 'Telegram Profile', urlTemplate: 'https://t.me/{INPUT}', targetInputId: 'telegram_tag', notes: "" },
        { id: 'service_tel_regdate', name: 'TG Regdate Bot', urlTemplate: 'https://t.me/regdate_clone_bot?start=@{INPUT}', targetInputId: 'telegram_tag', notes: "Sends @username to bot" },
        { id: 'service_tel_tgdb', name: 'TG TGDB Bot', urlTemplate: 'https://t.me/tgdb_bot?start=/where_@{INPUT}', targetInputId: 'telegram_tag', notes: "Sends /where @username" },
        { id: 'service_tel_oksearch', name: 'TG OkSearch Bot', urlTemplate: 'https://t.me/OkSearchBot?start=@{INPUT}', targetInputId: 'telegram_tag', notes: "Sends @username to bot" },

        { id: 'service_usersearch_com', name: 'User-Searcher.com', urlTemplate: 'https://www.user-searcher.com/', targetInputId: 'generic_username', isManualSite: true, notes: "Manual. Opens if username given." },
        { id: 'service_usersearch_org', name: 'UserSearch.org', urlTemplate: 'https://www.usersearch.org/results_advanced2.php?URL_username={INPUT}', targetInputId: 'generic_username', notes: "" },
        { id: 'service_idcrawl_user', name: 'IDCrawl (Username)', urlTemplate: 'https://www.idcrawl.com/u/{INPUT}', targetInputId: 'generic_username', notes: "" },
        { id: 'service_whatsmyname', name: 'WhatsMyName.app', urlTemplate: 'https://www.whatsmyname.app/', targetInputId: 'generic_username', isManualSite: true, notes: "Manual. Opens if username given." },

        { id: 'service_tiktok', name: 'TikTok Profile', urlTemplate: 'https://www.tiktok.com/@{INPUT}', targetInputId: 'tiktok_tag', notes: "Input username without @" },
        { id: 'service_gmail_check', name: 'Gmail Login/Check', urlTemplate: 'https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail', targetInputId: 'email', isManualSite: true, notes: "Manual. Opens if email given." },
        { id: 'service_github', name: 'GitHub Profile', urlTemplate: 'https://github.com/{INPUT}', targetInputId: 'github_tag', notes: "" },
        
        { id: 'service_google_img', name: 'Google Images', urlTemplate: 'https://images.google.com/', targetInputId: 'trigger_image_search', isManualSite: true, notes: "Triggered by checkbox" },
        { id: 'service_yandex_img', name: 'Yandex Images', urlTemplate: 'https://yandex.com/images/', targetInputId: 'trigger_image_search', isManualSite: true, notes: "Triggered by checkbox" },
        { id: 'service_metadata_app', name: 'Metadata.app', urlTemplate: 'https://metadata.app/', targetInputId: 'trigger_metadata_search', isManualSite: true, notes: "Triggered by checkbox" },

        { id: 'service_couchsurfing_name', name: 'Couchsurfing (Name-Hyphen)', urlTemplate: 'https://www.couchsurfing.com/people/{NAME}-{SURNAME}', targetInputId: 'name_surname_hyphen', requires: ['name', 'surname'], notes: "Uses {NAME}-{SURNAME}" },
        { id: 'service_idcrawl_name', name: 'IDCrawl (Name-Hyphen)', urlTemplate: 'https://www.idcrawl.com/{NAME}-{SURNAME}', targetInputId: 'name_surname_hyphen', requires: ['name', 'surname'], notes: "Uses {NAME}-{SURNAME}" },
        { id: 'service_familysearch', name: 'FamilySearch (Name Space)', urlTemplate: 'https://www.familysearch.org/en/search/genealogies/results?count=20&q.givenName={NAME}&q.surname={SURNAME}', targetInputId: 'name_surname_space', requires: ['name', 'surname'], notes: "Uses {NAME} & {SURNAME}" },
        
        { id: 'service_pikespeak_crypto', name: 'PikeSpeak Wallet', urlTemplate: 'https://pikespeak.ai/wallet-explorer/{INPUT}/graph', targetInputId: 'crypto_wallet', notes: "Input: wallet.near or wallet.tg" },
        
        { id: 'service_fb_uvrx_name', name: 'Facebook UVRX (Name+Plus)', urlTemplate: 'http://www.uvrx.com/results-fb/index.html?q={NAME}+{SURNAME}', targetInputId: 'name_surname_plus', requires: ['name', 'surname'], notes: "Uses {NAME}+{SURNAME}"},
        { id: 'service_fb_direct', name: 'Facebook Profile', urlTemplate: 'https://www.facebook.com/{INPUT}', targetInputId: 'facebook_username', notes: ""},
        
        { id: 'service_insta_uvrx', name: 'Instagram UVRX', urlTemplate: 'http://www.uvrx.com/results-instagram/index.html?q={INPUT}', targetInputId: 'instagram_tag', notes: "" },
        { id: 'service_insta_direct', name: 'Instagram Profile', urlTemplate: 'https://www.instagram.com/{INPUT}/', targetInputId: 'instagram_tag', notes: ""},
        
        { id: 'service_x_uvrx', name: 'X/Twitter UVRX', urlTemplate: 'http://www.uvrx.com/results-tw/index.html?q={INPUT}', targetInputId: 'x_tag', notes: "" },
        { id: 'service_x_direct', name: 'X/Twitter Profile', urlTemplate: 'https://twitter.com/{INPUT}', targetInputId: 'x_tag', notes: ""},
        
        { id: 'service_li_uvrx_name', name: 'LinkedIn UVRX (Name+Plus)', urlTemplate: 'http://www.uvrx.com/results-li/index.html?q={NAME}+{SURNAME}', targetInputId: 'name_surname_plus', requires: ['name', 'surname'], notes: "Uses {NAME}+{SURNAME}" },
        { id: 'service_li_direct', name: 'LinkedIn Profile Path', urlTemplate: 'https://www.linkedin.com/in/{INPUT}', targetInputId: 'linkedin_username', notes: "" },
        
        { id: 'service_iploc_net', name: 'IPLocation.net', urlTemplate: 'https://www.iplocation.net/ip-lookup', targetInputId: 'ip_address', isManualSite: true, notes: "Manual. Opens if IP given." },
        { id: 'service_ipinfo_io', name: 'IPinfo.io', urlTemplate: 'https://ipinfo.io/{INPUT}', targetInputId: 'ip_address', notes: "" },
    ].map(s => ({...s, id: s.id || `service_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`})); 


    function loadOsintServices() {
        const storedServices = localStorage.getItem(OSINT_SERVICES_STORAGE_KEY);
        if (storedServices) {
            try {
                osintServicesGlobal = JSON.parse(storedServices);
                if (!Array.isArray(osintServicesGlobal) || osintServicesGlobal.some(s => typeof s.id === 'undefined')) { 
                    console.warn("Stored OSINT services invalid or missing IDs, reverting to defaults.");
                    osintServicesGlobal = [...initialDefaultOsintServices];
                    saveOsintServices(); 
                }
            } catch (e) {
                console.error("Error parsing stored OSINT services, reverting to defaults:", e);
                osintServicesGlobal = [...initialDefaultOsintServices];
                saveOsintServices();
            }
        } else {
            osintServicesGlobal = [...initialDefaultOsintServices]; 
            saveOsintServices(); 
        }
        renderOsintServicesList();
    }

    function saveOsintServices() {
        localStorage.setItem(OSINT_SERVICES_STORAGE_KEY, JSON.stringify(osintServicesGlobal));
    }
    
    function renderOsintServicesList() {
        osintServicesListDiv.innerHTML = ''; 
        if (osintServicesGlobal.length === 0) {
            osintServicesListDiv.innerHTML = '<p>No OSINT services configured. Add one below.</p>';
            return;
        }
        osintServicesGlobal.sort((a, b) => a.name.localeCompare(b.name)).forEach(service => { 
            const item = document.createElement('div');
            item.classList.add('osint-service-item');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${service.name} (Targets: ${service.targetInputId})`;
            let titleText = `ID: ${service.id}\nURL: ${service.urlTemplate}`;
            if(service.notes) titleText += `\nNotes: ${service.notes}`;
            if(service.isManualSite) titleText += `\nType: Manual Site`;
            if(service.requires) titleText += `\nRequires: ${service.requires.join(', ')}`;
            nameSpan.title = titleText;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('service-actions');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('btn-secondary'); 
            editBtn.dataset.id = service.id;
            editBtn.addEventListener('click', handleEditService);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Del'; 
            deleteBtn.classList.add('btn-danger');
            deleteBtn.dataset.id = service.id;
            deleteBtn.addEventListener('click', handleDeleteService);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            item.appendChild(nameSpan);
            item.appendChild(actionsDiv);
            osintServicesListDiv.appendChild(item);
        });
    }

    function handleEditService(e) {
        const serviceId = e.target.dataset.id;
        const serviceToEdit = osintServicesGlobal.find(s => s.id === serviceId);
        if (serviceToEdit) {
            editingServiceIdInput.value = serviceId;
            serviceNameInput.value = serviceToEdit.name;
            serviceUrlTemplateInput.value = serviceToEdit.urlTemplate;
            serviceTargetInput.value = serviceToEdit.targetInputId;
            serviceNotesInput.value = serviceToEdit.notes || '';
            
            serviceFormTitle.textContent = 'Edit';
            addServiceBtn.textContent = 'Update Service';
            cancelEditServiceBtn.style.display = 'inline-block';
            serviceNameInput.focus();
        }
    }

    function handleDeleteService(e) {
        const serviceId = e.target.dataset.id;
        const serviceToDelete = osintServicesGlobal.find(s => s.id === serviceId);
        if (confirm(`Are you sure you want to delete the service "${serviceToDelete?.name || serviceId}"?`)) {
            osintServicesGlobal = osintServicesGlobal.filter(s => s.id !== serviceId);
            saveOsintServices();
            renderOsintServicesList();
            showToast('OSINT service deleted.', 'success');
            if (editingServiceIdInput.value === serviceId) { 
                resetServiceForm();
            }
        }
    }
    
    function resetServiceForm() {
        editingServiceIdInput.value = '';
        serviceNameInput.value = '';
        serviceUrlTemplateInput.value = '';
        serviceTargetInput.value = 'name'; 
        serviceNotesInput.value = '';
        
        serviceFormTitle.textContent = 'Add New';
        addServiceBtn.textContent = 'Add Service';
        cancelEditServiceBtn.style.display = 'none';
    }

    cancelEditServiceBtn.addEventListener('click', resetServiceForm);

    addServiceBtn.addEventListener('click', () => {
        const name = serviceNameInput.value.trim();
        const urlTemplate = serviceUrlTemplateInput.value.trim();
        const targetInputId = serviceTargetInput.value;
        const notes = serviceNotesInput.value.trim();
        const idToEdit = editingServiceIdInput.value;

        if (!name || !urlTemplate || !targetInputId) {
            showToast('Service Name, URL Template, and Target Input are required.', 'error');
            return;
        }
        
        const isManual = (targetInputId.startsWith('trigger_')) || 
                         (!urlTemplate.includes('{INPUT}') && targetInputId !== 'name_surname_hyphen' && targetInputId !== 'name_surname_plus' && targetInputId !== 'name_surname_space');
        const currentRequires = (targetInputId.includes('_surname_') || targetInputId.includes('name_')) && (targetInputId !== 'name' && targetInputId !== 'surname') ? ['name', 'surname'] : undefined;


        if (idToEdit) { 
            const serviceIndex = osintServicesGlobal.findIndex(s => s.id === idToEdit);
            if (serviceIndex > -1) {
                osintServicesGlobal[serviceIndex] = { 
                    ...osintServicesGlobal[serviceIndex], 
                    name, 
                    urlTemplate, 
                    targetInputId, 
                    notes,
                    isManualSite: isManual, 
                    requires: currentRequires
                };
                showToast(`Service "${name}" updated.`, 'success');
            }
        } else { 
            const newService = {
                id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                name,
                urlTemplate,
                targetInputId,
                notes,
                isManualSite: isManual,
                requires: currentRequires
            };
            osintServicesGlobal.push(newService);
            showToast(`Custom service "${name}" added.`, 'success');
        }
        
        saveOsintServices();
        renderOsintServicesList();
        resetServiceForm();
    });

    exportServicesBtn.addEventListener('click', () => {
        if (osintServicesGlobal.length === 0) {
            showToast('No services to export.', 'info');
            return;
        }
        downloadJSON(osintServicesGlobal, 'osint_services_backup.json');
        showToast('All OSINT services exported.', 'success');
    });

    importServicesInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedServices = JSON.parse(e.target.result);
                    if (Array.isArray(importedServices) && importedServices.every(s => s.id && s.name && s.urlTemplate && s.targetInputId)) {
                        const importMode = confirm("Import OSINT Services:\nOK to MERGE with existing services (overwrite duplicates by ID).\nCancel to REPLACE all existing services.");

                        if (importMode) { 
                            importedServices.forEach(importedService => {
                                const existingIndex = osintServicesGlobal.findIndex(s => s.id === importedService.id);
                                if (existingIndex > -1) {
                                    osintServicesGlobal[existingIndex] = importedService; 
                                } else {
                                    osintServicesGlobal.push(importedService); 
                                }
                            });
                            showToast('Services merged successfully.', 'success');
                        } else { 
                            osintServicesGlobal = importedServices;
                            showToast('Services replaced successfully.', 'success');
                        }
                        saveOsintServices();
                        renderOsintServicesList();
                    } else {
                        showToast('Invalid services file format. Must be an array of service objects with id, name, urlTemplate, and targetInputId.', 'error');
                    }
                } catch (err) {
                    showToast('Error importing services: Invalid JSON file.', 'error');
                    console.error("Error importing services:", err);
                }
                importServicesInput.value = ''; 
            };
            reader.readAsText(file);
        }
    });


    function getFieldValue(id, treatAsArray = false) {
        const el = document.getElementById(id);
        const checkbox = document.getElementById(`${id}_exclude`);
        if (el && (!checkbox || !checkbox.checked)) {
            const value = el.value.trim();
            if (treatAsArray) {
                return value ? value.split('\n').map(s => s.trim()).filter(s => s) : [];
            }
            return value;
        }
        return treatAsArray ? [] : '';
    }
    
    searchBtn.addEventListener('click', () => {
        const urlsToOpen = new Set();

        const searchData = {
            name: getFieldValue('name'),
            surname: getFieldValue('surname'),
            fathername: getFieldValue('fathername'),
            phone: getFieldValue('phone'),
            address: getFieldValue('address'),
            email: getFieldValue('email', true),
            generic_username: getFieldValue('generic_username', true),
            telegram_tag: getFieldValue('telegram_tag'),
            instagram_tag: getFieldValue('instagram_tag'),
            tiktok_tag: getFieldValue('tiktok_tag'),
            github_tag: getFieldValue('github_tag'),
            facebook_username: getFieldValue('facebook_username'),
            linkedin_username: getFieldValue('linkedin_username'),
            x_tag: getFieldValue('x_tag'),
            discord_tag: getFieldValue('discord_tag'),
            vk_tag: getFieldValue('vk_tag'),
            crypto_wallet: getFieldValue('crypto_wallet'),
            ip_address: getFieldValue('ip_address'),
            photo_notes: getFieldValue('photo_notes'),
            metadata_notes: getFieldValue('metadata_notes'),
            
            name_surname_hyphen: (getFieldValue('name') && getFieldValue('surname')) ? `${getFieldValue('name')}-${getFieldValue('surname')}` : '',
            name_surname_plus: (getFieldValue('name') && getFieldValue('surname')) ? `${getFieldValue('name')}+${getFieldValue('surname')}` : '',
            name_surname_space: (getFieldValue('name') && getFieldValue('surname')) ? `${getFieldValue('name')} ${getFieldValue('surname')}` : '',
            
            trigger_image_search: document.getElementById('trigger_image_search_cb').checked,
            trigger_metadata_search: document.getElementById('trigger_metadata_search_cb').checked,
        };
        
        osintServicesGlobal.forEach(service => {
            const serviceRequiresMet = !service.requires || service.requires.every(reqField => searchData[reqField]);
            if (!serviceRequiresMet) return;

            let inputsToProcess = [];
            const dataFromField = searchData[service.targetInputId]; 

            if (service.targetInputId.startsWith('trigger_')) { 
                if (dataFromField === true) { 
                    inputsToProcess.push(null); 
                }
            } else { 
                if (Array.isArray(dataFromField) && dataFromField.length > 0) {
                    inputsToProcess = dataFromField; 
                } else if (!Array.isArray(dataFromField) && dataFromField) { 
                    inputsToProcess.push(dataFromField);
                }
            }

            if (inputsToProcess.length > 0) {
                inputsToProcess.forEach(currentInput => { 
                    let url = service.urlTemplate;

                    if (service.urlTemplate.includes("{INPUT}")) {
                        if (currentInput !== null) { 
                            url = url.replace(/\{INPUT\}/g, encodeURIComponent(currentInput));
                        } else {
                            return; 
                        }
                    }
                    url = url.replace(/\{NAME\}/g, encodeURIComponent(searchData.name || ''));
                    url = url.replace(/\{SURNAME\}/g, encodeURIComponent(searchData.surname || ''));
                    
                    if (url && !urlsToOpen.has(url)) {
                        urlsToOpen.add(url);
                    }
                });
            }
        });
        
        const searchesLaunched = urlsToOpen.size;
        if (searchesLaunched > 0) {
            urlsToOpen.forEach(url => window.open(url, '_blank'));
            showToast(`${searchesLaunched} search(es) launched.`, 'success');
        } else {
            showToast('No data provided or services matched criteria for search.', 'info');
        }
    });

    function initializeApp() {
        const savedTheme = localStorage.getItem('osint_theme') || 'light';
        applyTheme(savedTheme);
        populateProfileSelector();
        loadOsintServices(); 
        resetServiceForm(); 
        
        profileSelector.value = ""; 
        profileSelector.dispatchEvent(new Event('change')); 
    }

    initializeApp();
});