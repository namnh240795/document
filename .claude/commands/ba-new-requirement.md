# Add New Requirement to SRS

Guide the user through adding requirements to a module's SRS document.

## Instructions

Walk the user through each step. Ask questions before proceeding.

### Step 1: Identify Module

Ask: "Which module are you adding requirements for?"

List current modules from `modules.yaml`:
- AUTH (Authentication)
- SMS (SMS Service)
- LOG (Logger)

### Step 2: Determine Requirement Type

Ask: "What type of requirement is this?"

| Type | Prefix | When to Use |
|------|--------|-------------|
| Functional | FR-xxx | What the system must DO |
| Non-Functional | NFR-xxx | Performance, security, availability constraints |
| Data | DR-xxx | Data storage, retention, format rules |
| Integration | IR-xxx | External system connections |

### Step 3: Get Requirement Details

Ask for each requirement:

1. "What is the requirement title? (short, imperative, e.g., 'User Registration')"
2. "What is the detailed description? (what exactly must the system do)"
3. "What is the priority? (High, Medium, Low)"
4. "Which use case does this relate to? (UC-xx, or create new)"
5. "What are the acceptance criteria? (how do we know it's done)"

### Step 4: Assign Requirement ID

Read the module's SRS to find the next available ID:

- FR requirements: FR-001, FR-002, ... (find highest existing, add 1)
- NFR requirements: NFR-001, NFR-002, ...
- DR requirements: DR-001, DR-002, ...
- IR requirements: IR-001, IR-002, ...

### Step 5: Add to SRS

Read `modules/<code>/srs.html` and add the requirement to the Functional Requirements table:

```html
<tr>
  <td id="fr-xxx"><span class="req-id">FR-xxx</span></td>
  <td><span class="module-badge">MODULE</span></td>
  <td>Requirement Title</td>
  <td>UC-xx</td>
  <td>High</td>
  <td>Detailed description of what the system must do</td>
</tr>
```

### Step 6: Add to TOC

Update the Table of Contents to include the new requirement:

```html
<li><a href="#fr-xxx">FR-xxx: Requirement Title</a></li>
```

### Step 7: Update Traceability Matrix

Add the requirement to the traceability matrix at the end of the SRS:

```html
<tr>
  <td>FR-xxx</td>
  <td>Requirement Title</td>
  <td>MODULE</td>
  <td>/api/endpoint</td>
  <td>project_table</td>
</tr>
```

### Step 8: Verify

Check:
- [ ] Requirement has a unique ID
- [ ] Requirement has Module column
- [ ] Requirement is in the TOC
- [ ] Requirement is in the traceability matrix
- [ ] No duplicate IDs exist

### Step 9: Build

```bash
make build-docs
```

## Requirement Template

```markdown
FR-XXX | MODULE | Requirement Title | UC-XX | Priority | Description

Where:
- FR-XXX: Unique functional requirement ID
- MODULE: Module code (AUTH, SMS, LOG, etc.)
- Requirement Title: Short, imperative verb phrase
- UC-XX: Related use case
- Priority: High / Medium / Low
- Description: Detailed what the system must do
```

## Example

```html
<tr>
  <td id="fr-003"><span class="req-id">FR-003</span></td>
  <td><span class="module-badge">AUTH</span></td>
  <td>User Login with Email/Password</td>
  <td>UC-02</td>
  <td>High</td>
  <td>The system shall allow users to authenticate using email and password. Failed attempts shall be logged and rate-limited after 5 consecutive failures.</td>
</tr>
```
