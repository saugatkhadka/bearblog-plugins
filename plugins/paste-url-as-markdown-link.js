/*
 Plugin name: Paste URL as Markdown link
 Description: Convert pasted URLs into Markdown links with page title in Bear editor.
 Author: saugatkhadka
 Author URI: https://github.com/saugatkhadka/bearblog-plugins
*/

(function() {
    'use strict';

    const URL_PATTERN = /^https?:\/\/\S+$/i;

    function normalizeText(value) {
        return value.replace(/\s+/g, ' ').trim();
    }

    function isSingleUrl(value) {
        if (!value || !URL_PATTERN.test(value)) {
            return false;
        }

        try {
            new URL(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function escapeMarkdownLabel(label) {
        return label
            .replace(/\\/g, '\\\\')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/\r?\n/g, ' ');
    }

    function getFallbackLabel(urlString) {
        try {
            const parsedUrl = new URL(urlString);
            return parsedUrl.hostname.replace(/^www\./i, '');
        } catch (error) {
            return 'link';
        }
    }

    async function fetchPageTitle(urlString) {
        try {
            const response = await fetch(urlString, {
                method: 'GET',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch page title.');
            }

            const html = await response.text();
            const parser = new DOMParser();
            const documentNode = parser.parseFromString(html, 'text/html');
            const titleNode = documentNode.querySelector('title');
            const titleText = normalizeText(titleNode ? titleNode.textContent : '');

            if (!titleText) {
                throw new Error('No title found for URL.');
            }

            return titleText;
        } catch (error) {
            return getFallbackLabel(urlString);
        }
    }

    function replaceSelectionWithText(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const scrollTop = textarea.scrollTop;

        textarea.value = value.slice(0, start) + text + value.slice(end);

        const nextCaretPosition = start + text.length;
        textarea.selectionStart = nextCaretPosition;
        textarea.selectionEnd = nextCaretPosition;
        textarea.scrollTop = scrollTop;

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function onPasteUrl(event, textarea) {
        const clipboardData = event.clipboardData;
        const pastedText = normalizeText(clipboardData ? clipboardData.getData('text/plain') : '');

        if (!isSingleUrl(pastedText)) {
            return;
        }

        event.preventDefault();

        const title = await fetchPageTitle(pastedText);
        const safeTitle = escapeMarkdownLabel(title);
        const markdownLink = '[' + safeTitle + '](' + pastedText + ')';

        replaceSelectionWithText(textarea, markdownLink);
    }

    function initializePlugin() {
        const textarea = window.$textarea || document.getElementById('body_content');

        if (!textarea) {
            return;
        }

        if (textarea.dataset.markdownUrlPasteReady === 'true') {
            return;
        }

        textarea.dataset.markdownUrlPasteReady = 'true';
        textarea.addEventListener('paste', function(event) {
            onPasteUrl(event, textarea);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }
})();
