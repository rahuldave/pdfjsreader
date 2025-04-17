# Data Directory

Place your PDF and corresponding JSON files here. The application expects:

1. A PDF file (default name: `HLLY - Amendment no 1.pdf`)
2. A JSON file containing the document structure and coordinates (default name: `HLLY - Amendment no 1.json`)

You can use different filenames by updating the paths in `app.js` and `init.js` respectively.

## JSON Structure Overview

The JSON file contains a hierarchical representation of your document's structure, with coordinates for text highlighting. The structure has two main parts:

1. Configuration settings (`configs`)
2. Table of Contents items (`toc_item`)

### Top Level Structure

```json
{
  "configs": {
    "TOC_START_FILTER": "^ARTICLE,^Section [0-9]+\\.[0-9]+",
    "TOC_TYPE": "TOC_CENTRE_ALIGNED",
    "HAS_FOOTER": true
  },
  "toc_item": [ ... ]
}
```

### Section Structure

Sections represent the highest level of document organization (e.g., Articles, Chapters). Each section contains:

```json
{
  "section": "ARTICLE I Definitions and Accounting Terms",  // Full section title
  "number": "ARTICLE",                                     // Section type/number
  "title": "I Definitions and Accounting Terms",           // Section title
  "content": {
    "children": [ ... ]                                    // Array of subsections/items
  }
}
```

### Content Items

Content items represent actual text in the document. Each item includes:

```json
{
  "text": "Section 1.01 Defined Terms.",          // The actual text content
  "region_coordinates": [                         // PDF coordinates for highlighting
    134.7,      // x1: left position
    691.7272,   // y1: top position
    567.276138, // x2: right position
    682.8272    // y2: bottom position
  ],
  "start_page_no": 23,                           // PDF page where this text appears
  "end_page_no": 23,                             // PDF page where this text ends
  "indent_level": 1                              // Indentation level for display
}
```

### Coordinate System

The `region_coordinates` use the PDF coordinate system where:
- Origin (0,0) is at the bottom-left of the page
- Units are in PDF points (1/72 inch)
- Coordinates are [x1, y1, x2, y2] representing a rectangle
- x1,y1 is the top-left corner
- x2,y2 is the bottom-right corner

### Complete Example

```json
{
  "configs": {
    "TOC_START_FILTER": "^ARTICLE,^Section [0-9]+\\.[0-9]+",
    "TOC_TYPE": "TOC_CENTRE_ALIGNED",
    "HAS_FOOTER": true
  },
  "toc_item": [
    {
      "section": "ARTICLE I Definitions and Accounting Terms",
      "number": "ARTICLE",
      "title": "I Definitions and Accounting Terms",
      "content": {
        "children": [
          {
            "text": "Section 1.01 Defined Terms.",
            "region_coordinates": [134.7, 691.7272, 567.276138, 682.8272],
            "start_page_no": 23,
            "end_page_no": 23,
            "indent_level": 1,
            "children": [
              {
                "text": ""Acceptable Intercreditor Agreement" means:",
                "region_coordinates": [145.8, 670.5272, 558.276138, 661.6272],
                "start_page_no": 23,
                "end_page_no": 23,
                "indent_level": 2
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Important Notes

1. The JSON structure must match this format exactly for the viewer to work
2. All coordinates must be within the PDF page dimensions
3. Page numbers must be valid for the PDF
4. The hierarchy (sections → content → children) must be maintained
5. Each text item that should be highlightable needs region_coordinates 