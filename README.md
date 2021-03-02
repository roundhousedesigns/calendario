# Calendario II: The Datening

The professional blogger's editorial calendar. For the two-th time.

## Usage:

Enable the plugin inside a WP installation and visit `Posts->Calendario` from the Dashboard.

## Quick start:

-   cd `app`
    then
-   React dev: `yarn start` (`localhost:3000`)
-   Production URL: `/wp-admin/edit.php?page=calendario`

---

## Bugs

-   Nothing atm...

## TODO

-   Hover a post:
    -   Links
        -   Edit
        -   View (icon top left)
        -   Unschedule (icon somewhere)
        -   Delete (icon top right) // MAYBE NOT
-   Post Edit
    -   add cats, tags
    -   ~~add delete~~
    -   ~~add excerpt~~
    -   ~~featured image show, but link to full Edit screen~~
-   Mobile
    -   Like, do all things, but also...
        -   Unscheduled collapsible
-   ~~Load/fetch animations~~
-   ~~drag and drop post order in Unscheduled~~
-   ~~Scroll within calendar and list views~~
-   ~~Clicking outside Edit modal cancels operation~~
-   ~~New Post button on hover on a calendar day~~
-   ~~Jump to Today button~~
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

## Maybes

-   Cache posts instead of always refetching?
-   Abbreviate long titles?

## Questions

-   Do we actually want to block dragging/dropping on past dates + future? (currently allowed)

## Don't Forget

-   Permissions checks: non-admins can only edit/delete their posts
-   Times and timezones, and the not-fucking-up thereof
