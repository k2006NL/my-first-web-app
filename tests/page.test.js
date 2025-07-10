import { url } from '../url.js';

describe('URL Tests', () => {
  test('url should match the expected GitHub Pages pattern', () => {
    // Check if URL matches "https://{your-user-name}.github.io/{your-repository-name}/" pattern
    // Allows dots(.), hyphens(-), underscores(_) in user-name and repository-name
    const githubPagesPattern = /^https:\/\/[a-zA-Z0-9._-]+\.github\.io\/[a-zA-Z0-9._-]+\/$/;
    expect(url).toMatch(githubPagesPattern);
  });

  test('url should not contain placeholder values', () => {
    // Ensure URL does not contain placeholder values
    expect(url).not.toMatch(/\{[^}]+\}/);
    expect(url).not.toContain('{your-website-url}');
  });

  test('url should be accessible with HTTP 200 response', async () => {
    // Test if URL is accessible and returns HTTP 200 response
    // First, ensure no placeholder values are present
    if (url.match(/\{[^}]+\}/)) {
      throw new Error(`URL contains placeholder values: ${url}. Please replace {your-website-url} with actual values.`);
    }
    
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error(`Expected HTTP 200 but received ${response.status} for URL: ${url}`);
      }
      expect(response.status).toBe(200);
    } catch (error) {
      if (error.message.includes('Only absolute URLs are supported')) {
        throw new Error(`Invalid URL format: ${url}. Please provide a valid absolute URL.`);
      }
      throw error;
    }
  }, 10000); // 10 second timeout

  test('website should contain required HTML tags', async () => {
    // Test if website HTML contains title, body, and head tags
    // First, ensure no placeholder values are present
    if (url.match(/\{[^}]+\}/)) {
      throw new Error(`URL contains placeholder values: ${url}. Please replace {your-website-url} with actual values.`);
    }
    
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error(`Cannot fetch HTML content. Expected HTTP 200 but received ${response.status} for URL: ${url}`);
      }

      const html = await response.text();
      
      // Check for required HTML tags
      if (!html.match(/<title[\s>]/i)) {
        throw new Error(`HTML does not contain <title> tag. URL: ${url}`);
      }
      if (!html.match(/<body[\s>]/i)) {
        throw new Error(`HTML does not contain <body> tag. URL: ${url}`);
      }
      if (!html.match(/<head[\s>]/i)) {
        throw new Error(`HTML does not contain <head> tag. URL: ${url}`);
      }
      
      expect(html).toMatch(/<title[\s>]/i);
      expect(html).toMatch(/<body[\s>]/i);
      expect(html).toMatch(/<head[\s>]/i);
    } catch (error) {
      if (error.message.includes('Only absolute URLs are supported')) {
        throw new Error(`Invalid URL format: ${url}. Please provide a valid absolute URL.`);
      }
      throw error;
    }
  }, 10000); // 10 second timeout
});
