# Claude Code Instructions: GenZen Site Content Update

## Mission Statement
You are the chief engineer and developer for GenZen. Your role is to execute content updates with precision, efficiency, and attention to the existing architecture. This update implements the new "Architects of Autonomy" positioning and restructured site copy.

## Repository Information
- **Repository**: https://github.com/adamking77/gz-hq-site
- **Framework**: Astro.js
- **Type**: Single-page website with custom card components and animations

## Phase 1: Repository Analysis (Execute First)

### 1.1 Initial Assessment
```bash
# Navigate to repository and analyze structure
cd gz-hq-site
find . -name "*.astro" -o -name "*.md" -o -name "*.js" -o -name "*.ts" | head -20
ls -la src/
```

### 1.2 Identify Current Architecture
Look for these key files and document their structure:
- `src/pages/index.astro` (main page)
- `src/components/` (custom components, especially cards)
- `src/layouts/` (layout components)
- `package.json` (dependencies and scripts)
- `astro.config.mjs` (configuration)

### 1.3 Document Current Content Structure
Create a content map of existing sections by examining:
- Hero/header sections
- Navigation elements
- Main content sections
- Footer
- Any existing custom components or animations

## Phase 2: Content Mapping

### 2.1 New Content Structure
The updated copy contains these main sections:

1. **Header Section**
   - Heading: "Architects of Autonomy"
   - Subheading: (Full autonomy intelligence description)

2. **Core Problem Section**
   - Problem statement about weaponized systems
   - Traditional solutions failure explanation

3. **Three Pillars Section**
   - Pattern Recognition
   - Resilience Architecture
   - Strategic Transformation

4. **Autonomy Intelligence Divisions** (3 cards/sections)
   - Personal Autonomy Intelligence (GenZen Pro)
   - Professional Autonomy Intelligence (Business)
   - Generational Autonomy Intelligence (GenZen Solutions)

5. **About Section**
   - Company description
   - Adam King founder profile

6. **CTA Section**
   - Ready to Explore call-to-action

### 2.2 Preserve Existing Features
- Maintain all animations and transitions
- Keep custom card components structure
- Preserve responsive design
- Maintain any existing styling frameworks

## Phase 3: Implementation Strategy

### 3.1 Backup Current Version
```bash
git branch backup-$(date +%Y%m%d)
git checkout -b content-update-architects-autonomy
```

### 3.2 Update Main Page Content

#### If using index.astro:
1. Replace hero/header content with new heading and subheading
2. Update main content sections following the new structure
3. Ensure proper mapping to existing component system

#### If using components:
1. Identify which components handle each content section
2. Update content within components while preserving structure
3. Test component functionality after updates

### 3.3 Specific Content Updates

#### Header/Hero Section:
- **Heading**: "Architects of Autonomy"
- **Subheading**: "GenZen is a global provider of autonomy intelligence - restoring your power by exposing and transforming systematic exploitation that targets your personal, professional, and generational agency."

#### Navigation Updates:
Ensure navigation links map to new structure:
- GenZen Pro → Personal Autonomy Intelligence
- Business Intelligence → Professional Autonomy Intelligence  
- GenZen Solutions → Generational Autonomy Intelligence

#### Card Components (Critical):
If custom card components exist, update them with the three divisions:

**Card 1 - Personal Autonomy Intelligence**
- Title: "Personal Autonomy Intelligence"
- Subtitle: "GenZen Pro"
- Description: "When your accomplishments, relationships, or reputation are weaponized to control your choices."
- Details: "Communication intelligence and extraction protocols for high-stakes interpersonal situations."
- CTA: "Visit GenZen Pro →"

**Card 2 - Professional Autonomy Intelligence**
- Title: "Professional Autonomy Intelligence"
- Subtitle: "Business Autonomy Intelligence"
- Description: "When your business model, industry position, or operational systems stop serving your actual goals."
- Details: "Operational redesign and professional identity restoration when industry standards conflict with your capabilities."
- CTA: "Explore Business Autonomy Intelligence →"

**Card 3 - Generational Autonomy Intelligence**
- Title: "Generational Autonomy Intelligence"
- Subtitle: "GenZen Solutions"
- Description: "When your wealth, legacy, or family systems become targets for sophisticated exploitation."
- Details: "Legacy intelligence and wealth protection for families and institutions facing sophisticated threats."
- CTA: "Visit GenZen Solutions →"

## Phase 4: Quality Assurance

### 4.1 Technical Validation
```bash
# Test build process
npm run build

# Test development server
npm run dev

# Check for any console errors or warnings
```

### 4.2 Content Review
- Verify all new content displays correctly
- Ensure animations and transitions still function
- Test responsive design across breakpoints
- Validate all links and CTAs work properly

### 4.3 Component Testing
- Test custom card animations
- Verify hover states and interactions
- Ensure accessibility features remain intact

## Phase 5: Fallback Strategies

### If Repository Structure is Non-Standard:
1. **No src/pages/index.astro**: Look for alternative main page files
2. **Different component structure**: Adapt content updates to existing architecture
3. **Custom build process**: Follow existing package.json scripts
4. **Unique styling approach**: Preserve existing CSS/styling methodology

### If Components Don't Match Expected Structure:
1. Document actual component structure found
2. Map new content to existing component system
3. Provide alternative implementation approach
4. Suggest component restructuring if beneficial

## Phase 6: Documentation and Handoff

### 6.1 Create Update Summary
Document:
- Files modified
- Changes made to each section
- Any technical decisions or adaptations
- Testing results

### 6.2 Deployment Preparation
```bash
# Final build test
npm run build

# Create pull request or prepare for deployment
git add .
git commit -m "Content update: Architects of Autonomy positioning"
git push origin content-update-architects-autonomy
```

## Emergency Protocols

### If Build Fails:
1. Revert to backup branch
2. Identify specific error
3. Fix incrementally section by section
4. Test after each change

### If Components Break:
1. Isolate problematic component
2. Update content without structural changes
3. Note issues for future component optimization
4. Ensure site remains functional

## Success Criteria
- [ ] New content accurately reflects provided copy
- [ ] All existing animations and interactions preserved
- [ ] Site builds and deploys without errors
- [ ] Responsive design maintained across devices
- [ ] Navigation and CTAs function correctly
- [ ] Content hierarchy matches new structure

## Notes for Claude Code
- Prioritize preserving existing functionality over perfect content mapping
- When in doubt, choose the approach that maintains site stability
- Document any deviations from these instructions with reasoning
- Test thoroughly at each phase before proceeding
- Communicate any structural discoveries that could improve future updates