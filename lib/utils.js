export function formattedQuotes(data) {
  return data.quotes.map(item => {
    return {
      quote: item.body,
      author: item.author,
      tags: item.tags,
      favorited: false
    };
  });
    
}