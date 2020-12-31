TODO
---
- use WP timezone initializing fullcalendar
- posts querying:
  - evaluate need to re-implement end/"before" post query date (limiting how far in the future we fetch)
	- pull all future posts in and store them in state
	- OR
	- set eventSources to pull in only currently view
- create array of React.createRef() programmatically

Features
---
- Permissions checks: non-admins can only edit/delete their posts