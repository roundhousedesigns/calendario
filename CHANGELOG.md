# Changelog

All notable changes to Calendar.io will be documented in this file.

## [0.7.62-63] - 2021-12-08

### Changed

- CSS improvements
- QuickEdit: "Slug" -> "Permalink/URL Slug"
- EditPost layout and style improvements
- Code refinements and formatting; minor refactoring
- `<user>` in REST routes removed (development crutch), all checks now look for logged in user server-side
- Improved sidebar toggle button location and and layout
- Removed `DrawerHandle` component

### Fixed

- PHP code improvements (Codacy)

## [0.7.61] - 2021-12-07

### Fixed

- Unscheduled draft order saving

### Added

- Lock icon (and action prevention) on posts with `_edit_lock` (being edited by a user).

### Changed

- Calendar days no longer animate as though reorderable.
- Embiggened the Post Title field on the editor.

## [0.7.6] - 2021-12-07

### Fixed

- iOS date formatting bugs.
- iOS interaction improvements.
- Date-to-string issues with timezone offsets fixed.
- Loading animation working on post Update.
- Some iPad interactions (ongoing...).

### Added

- Quick Edit explicit link in PostLinks component.

## [0.7.58] - 2021-12-01

### Changed

- Changed static default color definition to action hooked into plugin load.
- Minor code improvements.

### Fixed

- Using ISO 8601 date format for date string REST returns to the frontend.

## [0.7.57] - 2021-12-01

### Changed

- Release script upgraded.

## [0.7.56] - 2021-12-01

### Added

- This changelog!
- Changelog link in sidebar.

### Changed

- `RHD_DATE_FORMAT` const renamed `RHD_WP_DATE_FORMAT` for clarity.

### Fixed

- Updating/dragging `draft` and `pending` posts doesn't update post date.
