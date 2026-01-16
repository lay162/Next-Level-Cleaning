#!/usr/bin/env node
/**
 * Update all staff cards from template
 * This script copies template files to all staff cards
 * Individual cards load their data from JSON files in /data/
 */

const fs = require('fs');
const path = require('path');

const templateDir = path.join(__dirname, 'id', 'template');
const directorDir = path.join(__dirname, 'id', 'director');
const dataDir = path.join(__dirname, 'data');

// Staff member data - update this when adding new staff
const staffMembers = [
    {
        folder: 'lauren-moore',
        name: 'Lauren Moore',
        role: 'Director',
        email: 'lauren@nextlevelcleaningltd.co.uk',
        phone: '+447700900001'
    },
    {
        folder: 'jenny-roscoe',
        name: 'Jenny Roscoe',
        role: 'Director',
        email: 'jenny@nextlevelcleaningltd.co.uk',
        phone: '+447700900002'
    }
];

// Files to copy from template (structure/design files)
const filesToCopy = ['style.css', 'script.js'];

// Read template HTML
const templateHTML = fs.readFileSync(path.join(templateDir, 'index.html'), 'utf8');

// Update each staff member's card
staffMembers.forEach(staff => {
    const staffDir = path.join(directorDir, staff.folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(staffDir)) {
        fs.mkdirSync(staffDir, { recursive: true });
    }
    
    console.log(`Updating ${staff.name}...`);
    
    // Copy template files (CSS, JS, etc.)
    filesToCopy.forEach(file => {
        const src = path.join(templateDir, file);
        const dest = path.join(staffDir, file);
        
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`  ✓ Copied ${file}`);
        }
    });
    
    // Copy index.html (template is now data-driven, so it's identical for all)
    fs.copyFileSync(path.join(templateDir, 'index.html'), path.join(staffDir, 'index.html'));
    console.log(`  ✓ Copied index.html`);
    
    // Update contact.vcf
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
N:${staff.name.split(' ')[1]};${staff.name.split(' ')[0]};;;
FN:${staff.name}
ORG:Next Level Cleaning Ltd
TITLE:${staff.role}
TEL;TYPE=CELL:${staff.phone}
EMAIL:${staff.email}
URL:https://nextlevelcleaningltd.co.uk/id/director/${staff.folder}
UID:nextlevel-${staff.name.toLowerCase().replace(/\s/g, '')}
END:VCARD`;
    fs.writeFileSync(path.join(staffDir, 'contact.vcf'), vcfContent);
    console.log(`  ✓ Updated contact.vcf for ${staff.name}`);
    
    // Create placeholder profile.jpg and logo.png if they don't exist
    const profileImgPath = path.join(staffDir, 'profile.jpg');
    if (!fs.existsSync(profileImgPath)) {
        fs.writeFileSync(profileImgPath, ''); // Create empty placeholder
        console.log(`  ✓ Created placeholder profile.jpg`);
    }
    const logoPath = path.join(staffDir, 'logo.png');
    if (!fs.existsSync(logoPath)) {
        fs.writeFileSync(logoPath, ''); // Create empty placeholder
        console.log(`  ✓ Created placeholder logo.png`);
    }
    
    // Ensure JSON data file exists
    const jsonPath = path.join(dataDir, `${staff.folder}.json`);
    if (!fs.existsSync(jsonPath)) {
        console.log(`  ⚠ Warning: JSON data file not found at ${jsonPath}`);
        console.log(`     Please ensure ${staff.folder}.json exists in /data/ directory`);
    } else {
        console.log(`  ✓ JSON data file exists`);
    }
});

console.log('\n✅ All cards updated successfully!');
console.log('\nTemplate structure/design has been applied to all staff cards.');
console.log('Each card loads its data from JSON files in /data/ directory.');
console.log('\nNote: Cards are now data-driven. Update JSON files to change content.');
