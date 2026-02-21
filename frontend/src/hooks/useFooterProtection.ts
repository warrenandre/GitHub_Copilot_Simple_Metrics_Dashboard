import { useEffect } from 'react';
import { checkSystemState } from '../utils/integrity';

/**
 * Custom hook to ensure footer protection is active
 * This runs validation checks and prevents tampering
 */
export const useFooterProtection = () => {
  useEffect(() => {
    // Initial validation
    if (!checkSystemState()) {
      console.error('Footer protection validation failed');
      return;
    }

    // Create a more robust observer for the footer element
    const validateFooterPresence = () => {
      const footer = document.querySelector('[data-footer-protected="true"]');
      
      if (!footer) {
        console.error('Critical UI component missing - reloading');
        setTimeout(() => window.location.reload(), 100);
        return false;
      }

      // Verify the footer has the correct content
      const footerText = footer.textContent || '';
      if (!footerText.includes('Warren Joubert') || !footerText.includes('Microsoft')) {
        console.error('Critical UI component modified - reloading');
        setTimeout(() => window.location.reload(), 100);
        return false;
      }

      return true;
    };

    // Initial check after a short delay to ensure DOM is ready
    const initialCheck = setTimeout(() => {
      validateFooterPresence();
    }, 1000);

    // Set up periodic checks
    const intervalCheck = setInterval(() => {
      validateFooterPresence();
    }, 30000); // Check every 30 seconds

    // Set up MutationObserver to detect removal attempts
    let observer: MutationObserver | null = null;
    
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        // Check if any mutation might have affected the footer
        let shouldValidate = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
            // Check if the footer or its ancestors were removed
            mutation.removedNodes.forEach((node) => {
              if (node instanceof Element) {
                if (
                  node.hasAttribute('data-footer-protected') ||
                  node.querySelector('[data-footer-protected="true"]')
                ) {
                  shouldValidate = true;
                }
              }
            });
          }
          
          if (mutation.type === 'attributes' && mutation.target instanceof Element) {
            if (mutation.target.hasAttribute('data-footer-protected')) {
              shouldValidate = true;
            }
          }
        }
        
        if (shouldValidate) {
          validateFooterPresence();
        }
      });

      // Start observing
      setTimeout(() => {
        observer?.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['data-footer-protected', 'style', 'class']
        });
      }, 500);
    }

    // Cleanup
    return () => {
      clearTimeout(initialCheck);
      clearInterval(intervalCheck);
      observer?.disconnect();
    };
  }, []);
};
