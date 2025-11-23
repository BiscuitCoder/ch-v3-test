#!/usr/bin/env node

/**
 * Update links in CONTRIBUTING.md
 */

const fs = require('fs');
const path = require('path');
const { FIELD_NAMES, GITHUB_CONFIG, REQUIRED_FIELDS } = require('./config/constants');

// Get command line arguments
const args = process.argv.slice(2);
const repoUrl = args[0] || GITHUB_CONFIG.REPO_URL;

console.log('🔗 Updating links in CONTRIBUTING.md...');
console.log(`📦 Repository URL: ${repoUrl}`);

// Function to generate links
function generateIssueUrl(title, body) {
    const encodedTitle = encodeURIComponent(title);
    const encodedBody = encodeURIComponent(body);
    return `${repoUrl}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
}

const NOTE = `> 📝 **Please fill in the content after ">"**`;

// Generate fields with required markers
function generateFieldWithRequired(fieldName, description, fieldType) {
    const requiredFields = REQUIRED_FIELDS[fieldType];
    const isRequired = requiredFields.includes(fieldName);
    const requiredMark = isRequired ? ' | Required' : '';
    return `**${fieldName}** (${description}${requiredMark})`;
}

// Generate registration link
const registrationLink = generateIssueUrl(`${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.REGISTRATION} - New`, `## Registration Form

${NOTE}

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.NAME, 'Please enter your full name', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.DESCRIPTION, 'Brief personal introduction including skills and experience', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.CONTACT, 'Format: Contact Method: Contact Account, e.g., Telegram: @username, WeChat: username, Email: email@example.com', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.WALLET_ADDRESS, 'Your wallet address or ENS domain on Ethereum mainnet', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.TEAM_WILLINGNESS, 'Choose one: Yes | No | Maybe', 'REGISTRATION')}
>`);

// Generate submission link
const submissionLink = generateIssueUrl(`${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.SUBMISSION} - New`, `## Project Submission Form

${NOTE}

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_NAME, 'Enter your project name', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION, 'Brief description about your project in one sentence', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.REPOSITORY_URL, 'Open source repository URL - project must be open source', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_LEADER, 'Project leader name', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS, 'List all team members, comma-separated', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.TEAM_MEMBERS_WALLET, 'List all team members wallet, comma-separated e.g., Alice:0x12345... , Bob:0x12345...', 'SUBMISSION')}
>`);

console.log('\n📝 Generated links:');
console.log('Registration link:', registrationLink);
console.log('Submission link:', submissionLink);

// Read CONTRIBUTING.md file
const contributingPath = path.join(__dirname, '../../CONTRIBUTING.md');
let contributingContent = fs.readFileSync(contributingPath, 'utf8');

// Update registration link (replace all content between comment markers)
const registrationPattern = /(<!-- Registration link start -->)[\s\S]*?(<!-- Registration link end -->)/;
const newRegistrationContent = `$1\n[Register ➡️](${registrationLink})\n$2`;
contributingContent = contributingContent.replace(registrationPattern, newRegistrationContent);

// Update submission link (replace all content between comment markers)
const submissionPattern = /(<!-- Submission link start -->)[\s\S]*?(<!-- Submission link end -->)/;
const newSubmissionContent = `$1\n\n[Submit ➡️](${submissionLink})\n\n$2`;
contributingContent = contributingContent.replace(submissionPattern, newSubmissionContent);

// Write back to file
fs.writeFileSync(contributingPath, contributingContent, 'utf8');

console.log('\n✅ CONTRIBUTING.md links update completed!');
console.log('📄 File path:', contributingPath);