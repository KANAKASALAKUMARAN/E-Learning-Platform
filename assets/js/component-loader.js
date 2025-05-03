// Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load all components with data-component attribute
    loadComponents();
    
    // Function to load HTML components
    function loadComponents() {
        const components = document.querySelectorAll('[data-component]');
        
        components.forEach(element => {
            const componentName = element.getAttribute('data-component');
            const componentPath = `../components/${componentName}.html`;
            
            fetch(componentPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load component: ${componentName}`);
                    }
                    return response.text();
                })
                .then(html => {
                    element.innerHTML = html;
                    
                    // Process any scripts in the component
                    const scripts = element.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        Array.from(script.attributes).forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });
                        newScript.textContent = script.textContent;
                        script.parentNode.replaceChild(newScript, script);
                    });
                    
                    // Dispatch event when component is loaded
                    const event = new CustomEvent('componentLoaded', {
                        detail: { componentName }
                    });
                    document.dispatchEvent(event);
                })
                .catch(error => {
                    console.error(`Error loading component ${componentName}:`, error);
                    element.innerHTML = `<div class="alert alert-danger">Failed to load component: ${componentName}</div>`;
                });
        });
    }
});