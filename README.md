# 🔍 Advanced OSINT Search Tool

<p align="center">
  <img src="https://img.shields.io/badge/Ban_Probability-0%25-green?style=for-the-badge&logo=shield" alt="0% Ban Probability">
  <img src="https://img.shields.io/badge/Platform-Web%20Browser-blue?style=for-the-badge" alt="Platform">
  <img src="https://img.shields.io/badge/Architecture-Serverless%20%2F%20Client--Side-orange?style=for-the-badge" alt="Architecture">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

An elegant, client-side web interface designed to automate and parallelize open-source intelligence (OSINT) gathering. By compiling target indicators locally, the tool orchestrates and executes simultaneous queries across dozens of customizable platforms with a single click.

---

## 📂 1. Directory Structure

```text
advanced-osint-tool/
├── css/
│   └── style.css             # UI styling with CSS Variables for light/dark themes
├── js/
│   └── app.js                # Core JS logic for UI, profiles, and search execution
├── index.html                # Main application entrance
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## ⚠️ 2. Essential First-Run Step: Pop-up Permissions

Because this tool opens multiple tabs simultaneously via the native `window.open()` browser API, modern web browsers will automatically block these actions as "unwanted pop-ups" on your first run.

### How to Enable Pop-ups:
1. Open `index.html` in your web browser.
2. Enter any dummy value in the **Name** input field.
3. Click the green **Launch OSINT Search** button on the sidebar.
4. Look at the right side of your browser's address bar. You will see a **Pop-up Blocked** icon.
5. Click this icon, select **"Always allow pop-ups and redirects from [this address]"**, and click **Done**.
6. Click **Launch OSINT Search** again to verify that tabs open correctly.

---

## 🚀 3. Step-by-Step Usage Guide

### Step 3.1: Entering Target Identifiers
Fill in any known indicators of your subject in the categorized input panels:
*   **Single-Value Fields:** Inputs such as *Name*, *Surname*, *Fathername*, *Phone*, *Address*, or social media handles accept a single string. Leading/trailing spaces are automatically stripped.
*   **Multi-Line Iterators:** The **E-mail** and **Usernames** fields are multi-line textareas. Input **one value per line**. The search engine will automatically loop through every line, generating and launching a unique search tab for each distinct value.

### Step 3.2: Applying Field Exclusions
To temporarily disable certain indicators without deleting them:
*   Check the **Exclude** checkbox next to the input field.
*   The data remains visually saved in your active workspace (and will be stored if you save the profile), but is ignored entirely by the search query compiler during execution.

### Step 3.3: Managing Target Profiles
Profiles let you preserve and switch between active investigation targets.

*   **To Save a Profile:**
    1. Enter a unique identifier in the **New Profile Name** field on the sidebar.
    2. Click **Save Current**. This writes all current fields, exclusion states, triggers, and general notes into your browser's persistent `localStorage`.
*   **To Load a Profile:**
    1. Click the **Select a Profile to Load** dropdown menu.
    2. Select your target. The form will instantly populate with the saved dossier.
*   **To Export a Profile:** Select the profile from the dropdown, then click **Export Selected** to download a portable `.json` backup file.
*   **To Import a Profile:** Click **Import Profile**, choose your exported `.json` file, and confirm.

### Step 3.4: Configuring Custom OSINT Services
Customize the built-in search registry with your own search strings or localized databases:

1. Locate the **Manage OSINT Services** panel in the sidebar.
2. Enter a **Service Name** (e.g., `Shodan IP Lookup`).
3. Enter the **URL Template** containing variables (e.g., `https://www.shodan.io/host/{INPUT}`).
4. Select the **Target Input** field (e.g., `ip_address`). This binds the search path. The query will only execute if this specific field is populated on your active dashboard.
5. Click **Add Service**. The service is compiled, saved locally, and immediately integrated into the active alphabetical list.

---

## 🔗 4. URL Templating & Variable Reference

When configuring custom services, the engine translates bracketed placeholders inside your templates into sanitized, URL-encoded query parameters.

| Placeholder | Mapped Source Field | Behavior |
| :--- | :--- | :--- |
| `{INPUT}` | The selected **Target Input** field. | Direct variable injection. Replaced on every active lookup. |
| `{NAME}` | **Name** input field. | Dynamically injected if the Name field contains data. |
| `{SURNAME}`| **Surname** input field. | Dynamically injected if the Surname field contains data. |

### Template Implementations:

*   **Standard Target Mapping:**
    *   *Target Input:* `GitHub Tag`
    *   *URL Template:* `https://github.com/{INPUT}`
    *   *Workspace Data:* `octocat` → *Execution URL:* `https://github.com/octocat`

*   **Composite Full-Name Binding:**
    *   *Target Input:* `Name-Surname (hyphen)`
    *   *URL Template:* `https://www.idcrawl.com/{NAME}-{SURNAME}`
    *   *Workspace Data:* Name: `John`, Surname: `Doe` → *Execution URL:* `https://www.idcrawl.com/John-Doe`

*   **Static Trigger Links:**
    *   *Target Input:* `Trigger: Reverse Image Search`
    *   *URL Template:* `https://images.google.com/`
    *   *Behavior:* Injects no query variables, but launches Google Images to allow drag-and-drop actions whenever the **Perform Reverse Image Searches** checkbox is enabled.

---

## 💾 5. Data Migration Schemas

### Subject Profile Backup Schema (`.json`)
```json
{
  "profileName": "Target_John_Doe",
  "name": "John",
  "surname": "Doe",
  "fathername": "Robert",
  "phone": "+1234567890",
  "address": "123 Main St, New York",
  "email": "john.doe@example.com\nj.doe@corp.com",
  "generic_username": "jdoe99\njohnny_d",
  "telegram_tag": "jdoe_tg",
  "instagram_tag": "jdoe_insta",
  "tiktok_tag": "jdoe_tok",
  "github_tag": "jdoe_git",
  "facebook_username": "john.doe.fb",
  "linkedin_username": "john-doe-li",
  "x_tag": "jdoe_x",
  "discord_tag": "jdoe#1234",
  "vk_tag": "id987654321",
  "crypto_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "ip_address": "192.168.1.1",
  "photo_notes": "Identified at NYC Tech Summit",
  "metadata_notes": "Document metadata points to corporate laptop",
  "general_notes": "Target for active investigation.",
  "name_exclude": false,
  "surname_exclude": false,
  "phone_exclude": true,
  "trigger_image_search_cb": true,
  "trigger_metadata_search_cb": false
}
```

### OSINT Services Catalog Backup Schema (`.json`)
```json
[
  {
    "id": "service_tel_profile",
    "name": "Telegram Profile",
    "urlTemplate": "https://t.me/{INPUT}",
    "targetInputId": "telegram_tag",
    "notes": "Direct redirection link"
  },
  {
    "id": "service_couchsurfing_name",
    "name": "Couchsurfing (Name-Hyphen)",
    "urlTemplate": "https://www.couchsurfing.com/people/{NAME}-{SURNAME}",
    "targetInputId": "name_surname_hyphen",
    "requires": [
      "name",
      "surname"
    ],
    "notes": "Uses composite parameters {NAME} and {SURNAME}"
  }
]
```
