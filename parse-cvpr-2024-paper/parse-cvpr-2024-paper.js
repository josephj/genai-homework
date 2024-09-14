import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

async function fetchCVPRPapers() {
  const url = 'https://openaccess.thecvf.com/CVPR2024?day=all';
  console.log('Fetching CVPR 2024 paper list...');
  const response = await axios.get(url);
  const $ = load(response.data);

  const papers = [];
  const totalPapers = $('.ptitle').length;
  console.log(`Found ${totalPapers} papers in total`);

  $('.ptitle').each((index, element) => {
    const $element = $(element);
    const title = $element.text().trim();
    const detailsLink =
      'https://openaccess.thecvf.com' + $element.find('a').attr('href');
    const authors = $element.next('.pauthors').text().trim();
    const pdfLink =
      $('a:contains("pdf")', $element.parent()).attr('href') || '';

    papers.push({ title, authors, detailsLink, pdfLink });

    if ((index + 1) % 10 === 0 || index + 1 === totalPapers) {
      console.log(`Processed ${index + 1}/${totalPapers} papers`);
    }
  });

  return papers;
}

async function main() {
  try {
    console.time('Processing time');
    const papers = await fetchCVPRPapers();
    console.log('Writing JSON file...');
    fs.writeFileSync('cvpr_2024_papers.json', JSON.stringify(papers, null, 2));
    console.log('JSON file generated successfully: cvpr_2024_papers.json');
    console.timeEnd('Processing time');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
