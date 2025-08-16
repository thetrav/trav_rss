import { XMLParser } from "fast-xml-parser";
import { RssFeed, RssItem } from "./types";
import { writeFile } from "fs/promises";

async function fetchFeed() {
  const feed = await fetch("https://feeds.theguardian.com/theguardian/us/rss");
  const feedText = await feed.text();
  return feedText;
}

function parseFeed(feedText: string) {
  const parser = new XMLParser();
  const jObj = parser.parse(feedText) as RssFeed;
  return jObj.rss.channel.item.map(
    ({ title, link, description, pubDate, guid }) => ({
      title,
      link,
      description,
      pubDate,
      guid,
    })
  );
}

function toHtml(items: RssItem[]) {
  return `
    <html>
      <head><title>Todays Rss Articles</title></head>
      <body>
        ${items
          .map(
            (i) => `
          <h1><a href="${i.link}">${i.title}</a></h1>
          <div>${i.description}</div>
          `
          )
          .join("\n<hr/>")}
      </body>
    </html>
  `;
}

fetchFeed()
  .then(parseFeed)
  .then(toHtml)
  .then((f) => writeFile("output.html", f, "utf-8"))
  .then(() => console.log("done"))
  .catch((e) => console.log(`ERROR ${e}`));
