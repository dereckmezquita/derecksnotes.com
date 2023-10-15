# TODO

- [ ] Add geolocation to every comment.
- [ ] Create method on Comment schema for editing comments; should trigger geolocate.
- [ ] Auth modal closes when click and drag out of modal.
- [ ] Look into nginx module for resizing images; nginx http filter module.

# Bugs

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
