# TODO

## PRIORITY

-   Change eventSources BACK to using event arrays. OR work out subscribing to event changes for refetches in other components.

## FIX

-   caching API responses? memoize or something?
-   deal with post times when updating/retrieving posts
-   Allow php versions < php 7.4
-   When post is set to Unscheduled, make it a draft (or pending)
-   Finish implementing View (app in WP dashboard)
-   Modal
    -   Update rendered values on submit (sidebar + mainview), refresh in the background
-   Don't allow setting future posts to 'publish,' force to Future

## Features

-   Manual list view (drag and drop reordering, w/ days)
-   Loading animations
-   Option: show/include Private posts (and make editable)
-   Finish implementing viewMonthCount (store data somewhere) and maybe move all view storage to localstorage instead of db?
-   MAYBE move List view to persistent sidebar widget, as a non-editable at-a-glance?

## Don't Forget

-   Permissions checks: non-admins can only edit/delete their posts

## Notes

-   make sure time zones aren't cray cray somehow
