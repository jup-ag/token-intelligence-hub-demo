import { parseAsString, type UrlKeys } from "nuqs";

// Search page params
export const searchParams = {
  query: parseAsString.withDefault(""),
};

// Short URL keys for clean sharing (team standard)
export const searchUrlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
};

// Content feed params
export const contentFeedParams = {
  type: parseAsString.withDefault("all"),
  page: parseAsString.withDefault("1"),
};

export const contentFeedUrlKeys: UrlKeys<typeof contentFeedParams> = {
  type: "t",
  page: "p",
};

