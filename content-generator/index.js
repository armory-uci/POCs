require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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
  // path.join(__dirname, '..', 'XssStored/XssStoredTutorial.md'),
  // path.join(__dirname, '..', 'SQLInjectionNodeApp/SQLInjectionTutorial.md'),
];

const getTabContent = (tabName, content) => {
  const [_, contentBegin] = content.split(PLACEHOLDERS[tabName].start);
  const [tabContent] = contentBegin.split(PLACEHOLDERS[tabName].end);

  return tabContent;
};

for (const filePath of filePaths) {
  const contentFile = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(contentFile);

  const exploreContent = getTabContent('explore', content);
  const exploitContent = getTabContent('exploit', content);
  const mitigateContent = getTabContent('mitigate', content);

  console.log({ exploreContent, exploitContent, mitigateContent });
}
