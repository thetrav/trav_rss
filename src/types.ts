export type RssFeed = {
  rss: {
    channel: {
      item: RssItem[];
    };
  };
};

export type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
};
