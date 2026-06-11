Advanced OSINT Automation Tool

An elegant, zero-dependency, local-first OSINT dashboard designed for
intelligence analysts and security researchers. This tool automates the process
of querying diverse online platforms simultaneously by orchestrating structured
search parameters directly through your web browser.

📋 Table of Contents

1.  Core Features
2.  Prerequisites & Critical Browser Settings
3.  User Guide: Step-by-Step Operations
      - 1. Data Entry & Textarea Iteration
      - 2. Using Field Exclusions
      - 3. Initiating the Search
      - 4. Profile Management
      - 5. Managing Custom OSINT Services
4.  Custom Service Templating Reference
5.  Data Portability Schemas

⚡ Core Features

  - Federated Search Orchestration: Launches target queries across dozens of
    customizable OSINT databases with a single action.
  - Zero Server Footprint: Completely serverless. All target identifiers, API
    paths, custom endpoints, and personal notes remain entirely on your local
    machine.
  - Flexible Templating Engine: Supports positional parameters ({INPUT}) as well
    as composite name-surname bindings ({NAME}, {SURNAME}).
  - Subject Profile Lifecycle: Save, load, update, export, and import complete
    target dossiers.
  - Custom Service Manager: Create, update, or remove service definitions
    natively via the integrated sidebar UI.

⚠️ Prerequisites & Critical Browser Settings

Because this application relies on standard browser APIs to launch
multi-platform queries, you must configure your browser to allow pop-ups for
this application before initiating a search.

Enabling Pop-ups (One-time Setup)

1.  Open the application (index.html) in your browser.
2.  Click Launch OSINT Search.
3.  Observe the address bar: A blocked pop-up icon will appear (typically on the
    right-hand side of the URL bar).
4.  Click the icon and select "Always allow pop-ups and redirects from [this
    source]".
5.  Click Done and re-run the search.

📖 User Guide: Step-by-Step Operations

1. Data Entry & Textarea Iteration

The main interface contains categorized input cards. Each input field map
directly to an active search engine query structure.

  - Single-Line Inputs: Fields like Name, Surname, Telegram Tag, and Crypto
    Wallet accept one distinct string identifier.
  - Multi-Line Textareas: Fields like E-mail and Usernames process one entity
    per line. When a search is triggered, the search engine automatically
    generates and opens a unique search tab for every single line populated in
    these blocks.

2. Using Field Exclusions

Next to each input field is a checkbox with a hover title (Exclude this field
from searches).

  - Check this box to dynamically block a parameter from being compiled into the
    active search execution.
  - The data remains visually preserved in the input box for reference but will
    be completely ignored when compiling the active search queue.

3. Initiating the Search

1.  Populate your target's known information.
2.  Ensure you toggle the target-independent trigger boxes if necessary:
      - Perform Reverse Image Searches: Prepares manual tabs for image search
        platforms (e.g., Google Images, Yandex Images).
      - Perform Metadata Lookups: Opens metadata analyzers (e.g., Metadata.app).
3.  Click the green Launch OSINT Search button on the sidebar.
4.  A toast notification will appear in the bottom-middle of the screen
    confirming the precise count of launched searches, and the corresponding
    tabs will instantiate immediately.

4. Profile Management

Use the Profiles controller in the sidebar to maintain persistent investigation
targets.

[ Input Target Data ] ──► [ Enter Profile Name ] ──► [ Click "Save Current" ]
                                                              │
                                                     Saved to localStorage
                                                              │
[ Export Selected ] ◄── [ Choose Dropdown Item ] ◄────┴──► [ Delete Selected ]

  - Saving a Profile:
    1.  Enter a name in the New Profile Name input field.
    2.  Click Save Current. This captures all input values, exclusion states,
        triggers, and general notes, writing them to the browser's localStorage
        API.
  - Loading a Profile:
    1.  Click the Select a Profile to Load dropdown.
    2.  Choose your desired target. The form will instantaneously rehydrate.
  - Exporting/Backing Up Target Profiles:
    1.  Select a profile from the dropdown menu.
    2.  Click Export Selected. A validated .json file containing the profile
        payload will automatically download.
  - Importing Target Profiles:
    1.  Click the Import Profile label button.
    2.  Select the exported .json file.
    3.  If a naming conflict occurs, a browser modal will prompt you to confirm
        whether you wish to overwrite the existing profile.

5. Managing Custom OSINT Services

Add your own proprietary workflows, custom APIs, or local search scripts to the
dynamic orchestrator.

Adding a Service

1.  Navigate to the Manage OSINT Services section in the sidebar.
2.  Enter the Service Name (e.g., LeakLookup API).
3.  Define the URL Template (refer to the Custom Templating section below).
4.  Use the Target Input selector to bind this service to an explicit form field
    (e.g., binding to IP Address means this query will only trigger when the IP
    Address field contains active text).
5.  (Optional) Provide operating instructions or reference details in the Notes
    box.
6.  Click Add Service. The service immediately compiles and sorts alphabetically
    into your active list.

Editing or Deleting a Service

  - Edit: Click the Edit button on any service item in the sidebar list. The
    service form fields will populate with the service's parameters. Modify the
    parameters and click Update Service. To discard changes, click Cancel Edit.
  - Delete: Click the red Del button on any item. Confirm the system alert to
    permanently prune the registry.

🔗 Custom Service Templating Reference

The templating engine interprets bracketed placeholders to construct
fully-qualified domain names and query paths at execution time. All injected
variables undergo strict encodeURIComponent escaping automatically.

| Placeholder | Context                                                      | Execution Conditions                                         |
| :---------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `{INPUT}`   | Direct variable replacement of the active target input data. | Required unless the target is a manual site or trigger hook. |
| `{NAME}`    | Injects the value from the **Name** input field.             | Compiles if Name is populated and not excluded.              |
| `{SURNAME}` | Injects the value from the **Surname** input field.          | Compiles if Surname is populated and not excluded.           |

Practical URL Construction Examples

  - Objective: Query GitHub user profiles using the github_tag input field.
  - Target Input: GitHub Tag
  - Template:
    https://github.com/{INPUT}
  - If input value is octocat, execution URL results in:
    https://github.com/octocat

  - Objective: Query an archive or registry utilizing unified full names
    separated by a hyphen.
  - Target Input: Name-Surname (hyphen)
  - Template:
    https://www.idcrawl.com/{NAME}-{SURNAME}
  - If Name is John and Surname is Doe, execution URL results in:
    https://www.idcrawl.com/John-Doe

  - Objective: Force-launch a landing page with search tools (like Yandex
    Images) when the global image search trigger is enabled.
  - Target Input: Trigger: Reverse Image Search
  - Template:
    https://yandex.com/images/
  - Behavior: Injects no variables, but opens the target page in a separate tab
    when the corresponding checkbox is activated.

💾 Data Portability Schemas

To facilitate easy data migration across different workstations, configuration
files are handled as plaintext JSON payloads.

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
  "photo_notes": "Identified at NYC Tech Summit 2026",
  "metadata_notes": "Document metadata points to corporate laptop",
  "general_notes": "Primary suspect for data exfiltration investigation. Keep tabs updated weekly.",
  "name_exclude": false,
  "surname_exclude": false,
  "phone_exclude": true,
  "trigger_image_search_cb": true,
  "trigger_metadata_search_cb": false
}

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

