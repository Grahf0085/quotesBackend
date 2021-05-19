export function formattedQuotes(data) {
  
  return {
      
    quote: data[0].body,
    author: data[0].author,
    tags: data[0].tags,
    favorited: false
  };
}