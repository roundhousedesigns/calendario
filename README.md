# Calendario II: The Datening

The professional blogger's editorial calendar. In development...for the second time.

## Usage:

-   Run `yarn install` and `yarn start` inside the `app/` directory and visit `http://localhost:3000`.

    OR

-   Enable plugin inside a WP installation and visit `Posts->Calendario` from the Dashboard and `yarn build`.

---

## TODO:

-   Hover a post:
    -   Links
        -   Edit
        -   View (icon top left)
        -   Unschedule (icon somewhere)
        -   Delete (icon top right)
-   New Post button on hover on a calendar day
-   Post Edit
    -   add cats, tags
    -   fancy up the interface
    -   ~~add excerpt~~
    -   ~~featured image show, but link to full Edit screen~~
-   Jump to Today button
-   Clicking outside Edit modal cancels operation
-   Post order in Unscheduled
-   Cache posts instead of always refetching
-   Abbreviate long titles?
-   Mobile
    -   Like, do all things, but also...
        -   Unscheduled collapsible
-   ~~Start month view on first day of current week~~
-   ~~Fix special char display in posts~~
-   ~~List View~~
    -   ~~rather than show all future, use same Calendar range and allow add/subtract months!~~
-   ~~Show current date range in header~~
-   ~~View Options to header~~
-   ~~All drafts regardless of date should be editable~~
-   ~~Moving to unscheduled drafts:~~
    -   ~~posts should become draft/private~~
-   ~~Allow month cells to expand vertically~~
-   ~~Post Area to Popup~~

## Questions

-   Do we actually want to block dragging/dropping on past dates + future? (currently allowed)

## Don't Forget

-   Permissions checks: non-admins can only edit/delete their posts
-   Times and timezones, and the not-fucking-up thereof
