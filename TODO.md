# TODO

## features

- [x] Add geolocation to every comment.
- [ ] Create method on Comment schema for editing comments; should trigger geolocate.
- [ ] Look into nginx module for resizing images; nginx http filter module.

## bugs

- [x] Comment then reply to comment, if delete parent get error; solution, I was not populating child comments on delete.
```
1 of 2 unhandled errors

Unhandled Runtime Error
TypeError: undefined is not an object (evaluating 'comment.user.username')
Call Stack
dispatchEvent
[native code]
performConcurrentWorkOnRoot
[native code]

---
[Error] TypeError: undefined is not an object (evaluating 'c.user.username')
g — 716-a31c85784980ec41.js:1:2378
ak — framework-63157d71ad419e09.js:3208:161
i — framework-63157d71ad419e09.js:6466
oD — framework-63157d71ad419e09.js:5387
(anonymous function) — framework-63157d71ad419e09.js:5376
oO — framework-63157d71ad419e09.js:5377
oE — framework-63157d71ad419e09.js:5148:99
ox — framework-63157d71ad419e09.js:5062
ox
x — framework-63157d71ad419e09.js:7461
T — framework-63157d71ad419e09.js:7498

	Q (main-a568e19a92d5412a.js:1:9961)
	fn (main-a568e19a92d5412a.js:1:9061)
	componentDidCatch (main-a568e19a92d5412a.js:1:7502)
	(anonymous function) (framework-63157d71ad419e09.js:9:70436)
	lW (framework-63157d71ad419e09.js:9:51389)
	uX (framework-63157d71ad419e09.js:9:90779)
	e (framework-63157d71ad419e09.js:9:111108)
	(anonymous function) (framework-63157d71ad419e09.js:9:111117)
	oU (framework-63157d71ad419e09.js:9:111629)
	ox (framework-63157d71ad419e09.js:9:95001)
	ox
	x (framework-63157d71ad419e09.js:33:1366)
	T (framework-63157d71ad419e09.js:33:1896)
```
- [x] Cannot right click or cmd + click to open post cards in new tab.
- [x] Auth modal closes when click and drag out of modal.
- [x] Collapse nav bar to hamburger menu if screen width is small.