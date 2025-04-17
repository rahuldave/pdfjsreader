class OutlineView {
    constructor(container, jsonData, onHighlight) {
        this.container = container;
        this.jsonData = jsonData;
        this.onHighlight = onHighlight;
        this.expandedNodes = new Set();
        this.render();
    }

    toggleNode(path) {
        if (this.expandedNodes.has(path)) {
            this.expandedNodes.delete(path);
        } else {
            this.expandedNodes.add(path);
        }
        this.render();
    }

    createNodeElement(item, path = '', index = 0) {
        if (!item || typeof item !== 'object') return null;

        // Handle section headers
        const isSection = item.section && item.title;
        const hasContent = item.content && item.content.children;
        
        // Handle content items
        const hasText = item.text;
        const hasCoords = item.region_coordinates;
        const hasPage = item.start_page_no;

        if (!isSection && !hasText) {
            return null;
        }

        const nodePath = path ? `${path}.${index}` : `${index}`;
        const isExpanded = this.expandedNodes.has(nodePath);

        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'outline-node';
        if (item.indent_level) {
            nodeDiv.style.marginLeft = `${item.indent_level * 20}px`;
        }

        const headerDiv = document.createElement('div');
        headerDiv.className = 'outline-header';
        headerDiv.style.cursor = 'pointer';
        headerDiv.onclick = () => this.toggleNode(nodePath);

        // Add section icon for sections or items with children
        if (isSection || (hasContent && item.content.children.length > 0)) {
            const sectionIcon = document.createElement('span');
            sectionIcon.className = 'section-icon';
            sectionIcon.textContent = '📑';
            headerDiv.appendChild(sectionIcon);
        }

        // Add region icon if it has coordinates
        if (hasCoords) {
            const regionIcon = document.createElement('span');
            regionIcon.className = 'region-icon';
            regionIcon.textContent = '📍';
            headerDiv.appendChild(regionIcon);
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'node-text';
        textSpan.textContent = item.title || item.text || 'Untitled';
        headerDiv.appendChild(textSpan);

        nodeDiv.appendChild(headerDiv);

        if (isExpanded) {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'outline-content';

            if (hasCoords && hasPage) {
                const button = document.createElement('button');
                button.className = 'highlight-button';
                button.textContent = 'Highlight in PDF';
                button.onclick = () => {
                    this.onHighlight({
                        page: item.start_page_no,
                        coordinates: item.region_coordinates
                    });
                };
                contentDiv.appendChild(button);
            }

            // Handle children in content
            if (hasContent && Array.isArray(item.content.children)) {
                item.content.children.forEach((child, childIndex) => {
                    const childNode = this.createNodeElement(child, nodePath, childIndex);
                    if (childNode) {
                        contentDiv.appendChild(childNode);
                    }
                });
            }

            nodeDiv.appendChild(contentDiv);
        }

        return nodeDiv;
    }

    render() {
        this.container.innerHTML = '';
        
        const title = document.createElement('h3');
        title.textContent = 'Document Outline';
        this.container.appendChild(title);

        if (this.jsonData && this.jsonData.toc_item) {
            // Handle array of TOC items
            this.jsonData.toc_item.forEach((item, index) => {
                const node = this.createNodeElement(item, '', index);
                if (node) {
                    this.container.appendChild(node);
                }
            });
        } else {
            const loading = document.createElement('p');
            loading.textContent = 'Loading outline...';
            this.container.appendChild(loading);
        }
    }
}

window.OutlineView = OutlineView; 