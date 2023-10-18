# TODO

## features

- [x] Add geolocation to every comment.
- [ ] Create method on Comment schema for editing comments; should trigger geolocate.
- [ ] Look into nginx module for resizing images; nginx http filter module.

## bugs

- [ ] Comment then reply to comment, if delete parent get error:
```
1 of 2 unhandled errors

Unhandled Runtime Error
TypeError: undefined is not an object (evaluating 'comment.user.username')
Call Stack
dispatchEvent
[native code]
performConcurrentWorkOnRoot
[native code]
```
- [x] Cannot right click or cmd + click to open post cards in new tab.
- [x] Auth modal closes when click and drag out of modal.