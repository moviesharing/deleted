const fs = require('fs');
const readline = require('readline');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../../xvideos.com-export-full.csv');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const VIDEOS_OUT = path.join(OUTPUT_DIR, 'videos.json');

// We will extract 50,000 videos to keep the JSON size reasonable
const MAX_VIDEOS = 50000;

async function processCSV() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const videos = [];
  let count = 0;

  console.log(`Reading CSV from ${CSV_PATH}...`);

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // Columns: URL;Title;Duration;Thumb;Embed;Tags;Actors;ID;Category;Quality;Uploader;Blank;Date;...
    const cols = line.split(';');
    if (cols.length < 13) continue;

    const [url, title, duration, thumb, embed, tagsStr, actorsStr, id, category, quality, uploader, blank1, date] = cols;

    if (!embed || !id || !title) continue;

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    const actors = actorsStr ? actorsStr.split(',').map(a => a.trim()).filter(Boolean) : [];

    videos.push({
      id,
      title,
      duration: duration.replace('sec', '').trim(),
      thumb,
      embed,
      tags,
      actors,
      category,
      quality,
      uploader,
      date
    });

    count++;
    if (count % 10000 === 0) {
      console.log(`Processed ${count} videos...`);
    }

    if (count >= MAX_VIDEOS) {
      break;
    }
  }

  console.log(`Finished reading. Saving ${videos.length} videos to ${VIDEOS_OUT}...`);
  fs.writeFileSync(VIDEOS_OUT, JSON.stringify(videos));
  console.log('Done!');
}

processCSV().catch(console.error);
