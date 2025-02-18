Release notes
=============
### 4.0.1 (2025-02-18)
* Make payload signature less strict, [#38176](http://projects.theforeman.org/issues/38176)
* Drop el8 from packit config ([PR #82](https://github.com/theforeman/foreman_webhooks/pull/82))
* Make theforeman-rubocop dev dep, use 2.7 for cop target

### 4.0.0 (2024-09-12)
* Support zeitwerk loader, [#37469](http://projects.theforeman.org/issues/37469)
* Provide meaningful error message on org/loc mismatch, [#37667](http://projects.theforeman.org/issues/37667)
* Update packit to build on rhel 8 & 9
* Use theforeman-rubocop gem ([PR #74](https://github.com/theforeman/foreman_webhooks/pull/74))
* Rewrite to a shared github actions workflow ([PR #71](https://github.com/theforeman/foreman_webhooks/pull/71))
* Update packit
* Bump version to 3.2.2
* Expect erb in url for test webhook, [#36910](http://projects.theforeman.org/issues/36910)
* Use foreman-devel:el8 module
* Bump version to 3.2.1
* Fail delivery task if delivery fails ([PR #67](https://github.com/theforeman/foreman_webhooks/pull/67)), [#32368](http://projects.theforeman.org/issues/32368)
* Correct event names in webhook template documentation
* Fix example templates ([PR #65](https://github.com/theforeman/foreman_webhooks/pull/65)), [#36653](http://projects.theforeman.org/issues/36653)

### 3.2.0 (2023-06-27)
* Update transifex config
* Graphql api, [#31413](http://projects.theforeman.org/issues/31413)
* Don't depend on theforeman/stories
* Add test button ([PR #57](https://github.com/theforeman/foreman_webhooks/pull/57)), [#32363](http://projects.theforeman.org/issues/32363)
* Use plugin dsl for gettext, [#36388](http://projects.theforeman.org/issues/36388)
* Set translations up, [#36454](http://projects.theforeman.org/issues/36454)
* Add packit config ([PR #62](https://github.com/theforeman/foreman_webhooks/pull/62))
* Improve rel-eng localization
* Make arrays for typeahead mutable, [#36215](http://projects.theforeman.org/issues/36215)
* Include example in tooltip for target url, [#36155](http://projects.theforeman.org/issues/36155)
* Improve http headers inline help, [#34172](http://projects.theforeman.org/issues/34172)
* Support ec (and other non-rsa) keys, [#34847](http://projects.theforeman.org/issues/34847)
* Adjust rubocop

### 3.1.0 (2023-03-21)
* Add rel-eng
* Fix default katello templates ([PR #55](https://github.com/theforeman/foreman_webhooks/pull/55)), [#35867](http://projects.theforeman.org/issues/35867)
