I forced myself to stop, but it was hard because there were a lot of improvements I wanted to make. For starters:

1. I wanted to add filters on the search and then send them in as query strings, I think this would help speed up the search process instead of searching every field every time. I also think adding a clear button to reset the search. This woudn't have been hard to implement, but I just ran out of time.
2. I also left a TODO to handle an empty search better on a larger data set. I think it would be cool to use the geolocation and just return results that are close to the user if there is no query sent in.
3. Finally, I wanted to add pagination. I think this significantly improve the performance of the search by limiting it and having a see more button.

In addition, I chose to focus on optimizing the search and the UI, but didn't add any auth on the endpoint, but I think if this was a real application that would definitely be a top priority. 