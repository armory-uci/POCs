require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { setProblemContent } = require('./firestore_db');

const PLACEHOLDERS = {
  explore: {
    start: '<!-- explore-start -->',
    end: '<!-- explore-end -->',
  },
  exploit: {
    start: '<!-- exploit-start -->',
    end: '<!-- exploit-end -->',
  },
  mitigate: {
    start: '<!-- mitigate-start -->',
    end: '<!-- mitigate-end -->',
  },
};

const filePaths = [
  path.join(__dirname, '..', 'SQLInjectionFlaskApp/SQLInjectionTutorial.md'),
  path.join(__dirname, '..', 'XssStored/XssStoredTutorial.md'),
  path.join(__dirname, '..', 'SQLInjectionNodeApp/SQLInjectionTutorial.md'),
  path.join(__dirname, '..', 'CsrfNodeApp/CsrfTutorial.md'),
];

const getTabContent = (tabName, content) => {
  const [_, contentBegin] = content.split(PLACEHOLDERS[tabName].start);
  const [tabContent] = contentBegin.split(PLACEHOLDERS[tabName].end);

  return tabContent;
};

const readMarkdownFiles = () => {
  const problemContents = {};
  for (const filePath of filePaths) {
    const contentFile = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(contentFile);

    const explore = getTabContent('explore', content);
    const exploit = getTabContent('exploit', content);
    const mitigate = getTabContent('mitigate', content);

    problemContents[data.server_id] = {
      content: {
        explore,
        exploit,
        mitigate,
      },
      metadata: data,
    };
  }

  return problemContents;
};

/**
 * firebase_problem_id = find problem by server_id and language
 * if not exists
 *    firebase_problem_id = create /problems with ids/language/server_id, support.push(language), title
 * content_id = find problem_contents with server_id and language
 * update/create content and add server_id, firebase_problem_id
 */

const markdownFilesContent = readMarkdownFiles();

const server_ids = Object.keys(markdownFilesContent);

server_ids.forEach((server_id) => {
  const { content, metadata } = markdownFilesContent[server_id];

  setProblemContent(metadata, content);
});
